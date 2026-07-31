import express from 'express';
import cors from 'cors';
import pkg from 'pg';
import dotenv from 'dotenv';
import { initMQTT,
    publishOpenDoor,
    publishDeleteFace,
    publishEnrollFace } from './mqtt_service.js';
const { Pool } = pkg;

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.get('/', (req, res) => {
    res.json({
        status: 'ok',
        message: 'Smart Face Recognition Backend is running'
    });
});
async function initializeDatabase() {
    try {
            pool = new Pool({
        connectionString: process.env.DATABASE_URL
        });

        await pool.query('SELECT 1');
        console.log('Connected to database successfully.');
    } catch (err) {
        console.error('Database connection failed:', err);
        process.exit(1);
    }
}

let pool;

// ============================================================================
// 1. API: Webhook nhận sự kiện từ AI Service / Camera Gateway
// ============================================================================
app.post('/api/webhook/events', async (req, res) => {
    // Nhận payload từ AI: loại sự kiện, ID người (nếu có) và ảnh chụp
    const { eventType, personId, capturedImage } = req.body;

    try {
        // Nghiệp vụ: Khách lạ hoặc giả mạo -> PersonID = NULL
        const isKnown = (eventType === 'known' || eventType === 'Người quen mở cửa');
        const finalPersonId = isKnown ? personId : null;

        const result = await pool.query(
            `INSERT INTO NhatKyRaVao (EventType, PersonID, CapturedImage) 
       VALUES ($1, $2, $3) RETURNING *`,
            [eventType, finalPersonId, capturedImage]
        );

        // TODO: Phát socket.io/SSE event cho Frontend để cập nhật realtime
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ============================================================================
// 2. API: Lấy danh sách sự kiện cho màn Nhật ký
// ============================================================================
app.get('/api/events', async (req, res) => {
    try {
        // JOIN 2 bảng để lấy Tên người quen (nếu có) thay vì lưu trùng lặp tên vào log
        const query = `
      SELECT 
        nk.logid AS id, 
        nk.timestamp AS timestamp, 
        nk.eventtype AS "eventType", 
        nk.personid AS "personId", 
        nk.capturedimage AS image, 
        nq.name AS "personName"
      FROM nhatkyravao nk
      LEFT JOIN nguoiquen nq ON nk.PersonID = nq.ID
      ORDER BY nk.timestamp DESC 
      LIMIT 50
    `;
        const { rows } = await pool.query(query);

        // Xử lý giá trị trả về cho Frontend (hiển thị 'Khách lạ' nếu personName là null)
        const formattedRows = rows.map(row => ({
            ...row,
            personName: row.personName || (row.eventType.includes('unknown') ? 'Khách lạ' : 'Giả mạo')
        }));

        res.json(formattedRows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ============================================================================
// 3. API: Quản lý người quen (CRUD)
// ============================================================================
app.get('/api/persons', async (req, res) => {
    try {
        const { rows } = await pool.query(
            'SELECT ID AS "personId", Name AS name, ImagePath AS image FROM NguoiQuen ORDER BY ID ASC'
        );
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/persons', async (req, res) => {
    const { name, faceVector, imagePath } = req.body;

    try {
        // Nghiệp vụ: Tự động sinh ID dựa trên tổng số bản ghi (Ví dụ: P1, P2...)
        const idResult = await pool.query(`
          SELECT COALESCE(
            MAX(CAST(SUBSTRING(ID FROM 2) AS INTEGER)),
            0
          ) AS max_id
          FROM NguoiQuen
        `);

        const newId = `P${parseInt(idResult.rows[0].max_id, 10) + 1}`;

        const { rows } = await pool.query(
            `INSERT INTO NguoiQuen (ID, Name, FaceVector, ImagePath) 
       VALUES ($1, $2, $3, $4) RETURNING ID AS "personId", Name AS name, ImagePath AS image`,
            [newId, name, faceVector, imagePath]
        );

        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// backend/server.js

// API: Sửa thông tin người quen theo ID
app.put('/api/persons/:id', async (req, res) => {
    const { id } = req.params;
    const { name, imagePath } = req.body;

    try {
        const { rows } = await pool.query(
            `UPDATE NguoiQuen 
       SET Name = $1, ImagePath = $2 
       WHERE ID = $3 
       RETURNING ID AS "personId", Name AS name, ImagePath AS image`,
            [name, imagePath, id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: "Không tìm thấy người quen này" });
        }

        res.json(rows[0]);
    } catch (err) {
        console.error("Lỗi PUT /api/persons:", err.message);
        res.status(500).json({ error: err.message });
    }
});

// API: Xóa người quen theo ID
app.delete('/api/persons/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query('DELETE FROM NguoiQuen WHERE ID = $1', [id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Không tìm thấy người quen để xóa" });
        }

        res.json({ success: true, message: `Đã xóa người quen ${id}` });
    } catch (err) {
        console.error("Lỗi DELETE /api/persons:", err.message);
        res.status(500).json({ error: err.message });
    }
});

// API: Xóa một log sự kiện
app.delete('/api/events/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM nhatkyravao WHERE logid = $1', [id]);
        res.json({ success: true, message: `Đã xóa log ${id}` });
    } catch (err) {
        console.error("Lỗi DELETE /api/events:", err.message);
        res.status(500).json({ error: err.message });
    }
});

// ============================================================================
// 4. API: Điều khiển khoá cửa
// ============================================================================
app.post('/api/door/lock', async (req, res) => {
    const { lockName, action, performedBy } = req.body;

    try {
        // TODO: Gọi API/MQTT xuống IoT Gateway điều khiển khoá vật lý
        // Sau khi thao tác phần cứng thành công, lưu vào database
                // Chỉ gửi lệnh MQTT khi Admin yêu cầu mở cửa
        if (action === 'unlocked') {
            await publishOpenDoor();
        }
        
        // Lưu lịch sử thao tác vào Database
        await pool.query(
            'INSERT INTO lock_history (lock_name, action, performed_by) VALUES ($1, $2, $3)',
            [lockName, action, performedBy]
        );
        
        res.json({
            success: true,
            message: `Door ${action}`,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 3000;

async function startServer() {
    await initializeDatabase();

    initMQTT(pool);

    app.listen(PORT, () => {
        console.log(`Backend running on port ${PORT}`);
    });
}

startServer();
