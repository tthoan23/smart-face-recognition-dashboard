1. 🏗️ Tổng quan Kiến trúc Hệ thống
Hệ thống được thiết kế theo mô hình Client - Server - External AI Gateway kết hợp với cơ sở dữ liệu quan hệ PostgreSQL.

code
Text
┌──────────────────────────────┐
│  Camera Gateway / AI Service │ (Xử lý AI bên ngoài: FaceID, Liveness)
└──────────────┬───────────────┘
               │  1. HTTP Webhook (POST /api/webhook/events)
               ▼
┌──────────────────────────────┐      2. Query / Persist
│    Backend (Node.js/Express) ├───────────────────────────────┐
└──────────────▲───────────────┘                               │
               │                                               ▼
               │ 3. REST API Polling                  ┌──────────────────┐
               │    (GET/POST/PUT/DELETE)             │  PostgreSQL DB   │
               │                                      └──────────────────┘
┌──────────────┴───────────────┐
│     Frontend (React + Vite)  │ (Dashboard Quản trị cho Admin)
└──────────────────────────────┘
2. 🔄 Luồng Giao tiếp API & Công việc (Workflow)

🔴 Luồng 1: Tiếp nhận Sự kiện Nhận diện từ AI Service (Real-time Webhook)
Camera Gateway / AI Service thực hiện nhận diện khuôn mặt và kiểm tra thực thể sống (Anti-spoofing).

Sau khi có kết quả, AI Service bắn bản tin JSON qua HTTP POST tới endpoint:
POST http://localhost:3000/api/webhook/events

Backend (server.js):

Tiếp nhận dữ liệu (eventType, personId, capturedImage).

Khấu trừ quy tắc nghiệp vụ: Nếu eventType là người lạ (unknown) hoặc giả mạo (spoofing), PersonID được gán thành NULL.

Lưu trữ sự kiện vào bảng NhatKyRaVao trong PostgreSQL.

🔵 Luồng 2: Cập nhật & Hiển thị trên Dashboard / Nhật ký (Frontend Polling)
Frontend (App.tsx): Khi Admin đăng nhập, một cơ chế Polling (3 giây/lần) được kích hoạt.

Gọi API: GET http://localhost:3000/api/events.

Backend (server.js): Thực hiện câu lệnh SQL LEFT JOIN giữa hai bảng NhatKyRaVao và NguoiQuen để lấy tên đầy đủ của người quen tương ứng với PersonID.

Hiển thị & Thông báo:

Dữ liệu sự kiện đổ vào DashboardView (cập nhật số liệu thống kê) và LogsView.

Nếu phát hiện bản ghi mới xuất hiện ở đầu danh sách, App.tsx tự động sinh ra một Notification (Chuông thông báo) màu sắc tương ứng (Mở cửa, Người lạ, Giả mạo).

🟢 Luồng 3: Quản lý Người quen (CRUD Persons)
Thêm mới: Admin nhập tên và ảnh tại PersonsView -> Gửi POST /api/persons.

Backend đếm tổng số lượng người hiện tại (COUNT(*)) và tự động sinh mã ID theo quy tắc: P + (Count + 1) (Ví dụ: P1, P2, P3...).

Cập nhật: Bấm chỉnh sửa -> Gửi PUT /api/persons/:id -> Cập nhật bảng NguoiQuen.

Xóa: Bấm xóa -> Gửi DELETE /api/persons/:id -> Xóa khỏi bảng NguoiQuen.

🟡 Luồng 4: Điều khiển Khoá cửa từ xa (Access Control)
Trên màn hình AccessControlView, Admin bật/tắt khoá chốt cửa.

Frontend hiển thị Modal xác nhận hành động.

Khi bấm xác nhận -> Gửi POST /api/door/lock với hành động locked hoặc unlocked.

Backend ghi vết thao tác vào bảng lock_history để phục vụ tra cứu lịch sử.

📂 3. Ý nghĩa & Công dụng Chi tiết từng File trong Dự án

🖥️ Thư mục backend/ (Server & Cơ sở dữ liệu)
Tên File	Công dụng & Ý nghĩa
server.js	Trái tim của Backend: Khởi tạo server Express, kết nối PostgreSQL, cung cấp tất cả các REST API endpoints (/api/events, /api/persons, /api/door/lock, /api/webhook/events). Chứa hàm initializeDatabase() tự tạo DB và nạp schema.
init.sql	Khung xương Cơ sở dữ liệu: Chứa câu lệnh SQL tạo bảng NguoiQuen (lưu hồ sơ người quen, vector khuôn mặt, ảnh) và bảng NhatKyRaVao (lưu lịch sử ra vào có khóa ngoại kết nối tới NguoiQuen).
.env	Cấu hình môi trường: Lưu mật khẩu DB, Port server, chuỗi kết nối PostgreSQL bí mật.
package.json	Khai báo các thư viện Backend: express (web framework), pg (PostgreSQL driver), cors (cho phép Frontend gọi API), dotenv (đọc file môi trường).
💻 Thư mục src/ (Giao diện Frontend React)

1. Các File Cốt lõi (Core)
Tên File	Công dụng & Ý nghĩa
App.tsx	Root Component chính: Quản lý State tập trung cho toàn ứng dụng (view, logs, notifications, loggedIn), chạy timer Polling làm mới dữ liệu 3s/lần, tự động phát hiện sự kiện mới để bắn thông báo.
main.tsx	Điểm khởi chạy của React, mount App.tsx vào thẻ <div id="root"> trong index.html.
index.css	File CSS toàn cục, tích hợp Tailwind CSS v4 và tùy chỉnh thanh cuộn (scrollbar).
types/index.ts	TypeScript Interfaces: Định nghĩa cấu trúc kiểu dữ liệu cho toàn bộ ứng dụng (LogEntry, Person, Notification, EventType, DoorLock, LockHistoryEntry).
utils/mockData.ts	Chứa dữ liệu mẫu dự phòng cho luồng camera, dữ liệu khóa cửa khởi tạo ban đầu.
2. Thư mục components/ (Linh kiện UI tái sử dụng)
Tên File	Công dụng & Ý nghĩa
Icons.tsx	Tập hợp toàn bộ icon SVG dưới dạng component gọn nhẹ (kính lúp, thùng rác, cái khóa, mắt xem, quả chuông...).
UI.tsx	Bộ linh kiện giao diện dùng chung: StatCard (thẻ thống kê số lượng), EventBadge (nhãn màu cho loại sự kiện), Modal (hộp thoại xác nhận), ImageUpload (tải ảnh), Pagination (phân trang), ToggleSwitch (công tắc bật/tắt khóa).
3. Thư mục layout/ (Khung giao diện cố định)
Tên File	Công dụng & Ý nghĩa
Layout.tsx	Chứa 3 thành phần khung chính: <br>• Sidebar: Thanh menu điều hướng bên trái.<br>• Header: Thanh tiêu đề trên cùng hiển thị avatar admin và nút quả chuông.<br>• NotificationPanel: Bảng danh sách thông báo thả xuống từ quả chuông.
4. Thư mục pages/ (Các màn hình chức năng)
Tên File	Công dụng & Ý nghĩa
LoginScreen.tsx	Màn hình đăng nhập quản trị viên (Admin authentication).
DashboardView.tsx	Trang Thống kê tổng quan: Hiển thị 4 thẻ số liệu thực tế (Tổng người quen, Nhận diện hôm nay, Người lạ, Giả mạo) và bảng 5 sự kiện mới nhất.
LogsView.tsx	Trang Nhật ký ra vào: Hiển thị danh sách sự kiện đầy đủ, hỗ trợ ô tìm kiếm đa năng (tên/ID/thời gian), bộ lọc theo loại sự kiện và nút xóa bản ghi.
PersonsView.tsx	Trang Quản lý người quen: Cho phép Xem chi tiết, Thêm mới người quen (tự động sinh ID P1, P2...), Sửa tên/ảnh và Xóa người quen khỏi Database.
CameraView.tsx	Trang Xem Camera trực tiếp: Hiển thị luồng Livestream, hỗ trợ chụp ảnh nhanh (Snapshot), bật/tắt chế độ ghi hình (Record) và xem danh sách clip đã lưu.
AccessControlView.tsx	Trang Điều khiển khoá cửa: Cho phép Mở/Khóa cửa từ xa có Modal xác nhận và bảng ghi vết Lịch sử đóng/mở cửa.
🗄️ 4. Cấu trúc Cơ sở dữ liệu (Database Schema)

Bảng NguoiQuen
id (VARCHAR, Primary Key): Mã định danh (P1, P2, P3...)

name (VARCHAR): Họ tên thành viên

facevector (TEXT): Chuỗi vector khuôn mặt 128 chiều

imagepath (VARCHAR): Đường dẫn file ảnh chân dung

Bảng NhatKyRaVao
logid (SERIAL, Primary Key): Mã log tự tăng

timestamp (TIMESTAMP): Thời gian xảy ra sự kiện

eventtype (VARCHAR): Loại sự kiện (known, unknown, spoofing)

personid (VARCHAR, Foreign Key -> NguoiQuen.id): NULL nếu là người lạ/giả mạo

capturedimage (VARCHAR): Link ảnh camera chụp lại lúc sự kiện diễn ra