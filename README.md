# 🛡️ Smart Face Recognition Dashboard

Hệ thống Web Dashboard Quản lý và Kiểm soát Ra vào bằng Nhận diện Khuôn mặt (React + Node.js + PostgreSQL).

---

## 📌 1. Yêu cầu hệ thống (Prerequisites)

Trước khi cài đặt, đảm bảo máy tính của bạn đã cài đặt sẵn các công cụ sau:
* **Node.js**: Phiên bản 18.x trở lên ([Tải tại đây](https://nodejs.org/))
* **PostgreSQL**: Phiên bản 14.x trở lên ([Tải tại đây](https://www.postgresql.org/download/))
* **Trình quản lý gói**: `npm` (đi kèm Node.js) hoặc `pnpm`

---

## 📁 2. Cấu trúc dự án

```text
├── backend/                  # Server Node.js (Express + PostgreSQL)
│   ├── node_modules/
│   ├── .env                  # File cấu hình môi trường (Tự tạo)
│   ├── init.sql              # Script khởi tạo bảng cơ sở dữ liệu
│   ├── package.json
│   └── server.js             # Mã nguồn Backend
│
├── src/                      # Frontend React (Vite + Tailwind CSS)
│   ├── components/           # UI Components tái sử dụng
│   ├── layout/               # Sidebar, Header, Notification
│   ├── pages/                # Các màn hình (Dashboard, Logs, Persons, Camera, AccessControl)
│   ├── types/                # Định nghĩa TypeScript
│   ├── utils/                # Mock data & Utilities
│   └── App.tsx               # Root Component
│
├── index.html
├── package.json
└── vite.config.ts
⚙️ 3. Hướng dẫn cài đặt & Chạy Backend
Backend có tính năng TỰ ĐỘNG kiểm tra, tạo Database PostgreSQL và nạp file init.sql nếu chưa có.

Bước 3.1: Di chuyển vào thư mục Backend & Cài đặt Module
Mở Terminal và chạy các lệnh sau:

code
Bash
cd backend
npm install
Bước 3.2: Tạo file .env cho Backend
Tạo một file đặt tên là .env nằm bên trong thư mục backend/ và điền thông tin kết nối PostgreSQL trên máy của bạn (Xem mẫu ở phần 5).

Bước 3.3: Khởi chạy Backend
code
Bash
node server.js
Khi chạy thành công, Terminal sẽ hiển thị:

code
Text
Database already exists. (hoặc Creating database faceguard...)
Database initialized successfully.
Backend running on port 3000
💻 4. Hướng dẫn cài đặt & Chạy Frontend
Mở một cửa sổ Terminal mới (không tắt Terminal Backend):

Bước 4.1: Cài đặt Module cho Frontend
Trở về thư mục gốc của dự án và cài đặt các thư viện:

code
Bash
# Nếu dùng npm:
npm install

# Hoặc nếu dùng pnpm:
pnpm install
Bước 4.2: Khởi chạy Frontend
code
Bash
npm run dev
# Hoặc: pnpm run dev
Sau khi chạy thành công, Terminal sẽ cấp đường dẫn local, bạn mở trình duyệt và truy cập:
👉 http://localhost:5173 (hoặc port được cấp trên Terminal).

🔑 5. Mẫu file .env (Backend)
Tạo file backend/.env với nội dung sau và thay đổi DB_PASSWORD / DB_USER tương ứng với tài khoản PostgreSQL trên máy của bạn:

code
Env
# Cấu hình Port chạy Backend
PORT=3000

# Thông tin tài khoản Admin PostgreSQL trên máy bạn
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=123456

# Tên Database dự án (Server sẽ tự tạo DB này nếu chưa có)
DB_NAME=faceguard

# Chuỗi kết nối Database chính
DATABASE_URL=postgres://postgres:123456@localhost:5432/faceguard
Lưu ý về .env:

Thay postgres bằng Username PostgreSQL của bạn (trên Mac có thể là tên tài khoản Mac).
Thay 123456 bằng Mật khẩu PostgreSQL bạn đã tạo khi cài đặt.
🔑 6. Tài khoản đăng nhập ứng dụng (Mặc định)
Tên đăng nhập: admin

Mật khẩu: admin123

🛠️ 7. Các lỗi thường gặp & Cách xử lý
Lỗi password authentication failed for user "postgres":
👉 Mật khẩu hoặc User trong file backend/.env bị sai. Hãy kiểm tra lại mật khẩu PostgreSQL trên máy bạn.

Lỗi ECONNREFUSED 127.0.0.1:5432:
👉 Service PostgreSQL trên máy bạn chưa được bật. Hãy mở app PostgreSQL/pgAdmin hoặc bật service Postgres lên.

Lỗi Port 3000 is already in use:
👉 Cổng 3000 đã bị ứng dụng khác chiếm dụng. Bạn có thể đổi PORT=3001 trong file .env và cập nhật các đường dẫn fetch ở Frontend thành http://localhost:3001.

code
Code
---

# 📄 FILE 2: `backend/.env.example` (File mẫu đẩy lên Git)

Vì file `.env` chứa mật khẩu cá nhân nên không nên đẩy lên GitHub. Bạn hãy tạo một file đặt tên là `backend/.env.example` để làm mẫu cho các bạn trong nhóm copy ra thành `.env`:

```env
PORT=3000

# PostgreSQL Credentials
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_postgres_password_here
DB_NAME=faceguard

# Connection string
DATABASE_URL=postgres://postgres:your_postgres_password_here@localhost:5432/faceguard