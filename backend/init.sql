-- ============================================================================
-- Smart Face Recognition Dashboard
-- PostgreSQL schema for Supabase / external managed DB
-- Chạy file này 1 lần trên Supabase SQL Editor hoặc migration tool
-- ============================================================================

-- Bảng 1: Danh sách người quen
CREATE TABLE IF NOT EXISTS nguoiquen (
id VARCHAR(50) PRIMARY KEY,
name VARCHAR(255) NOT NULL,
facevector TEXT,
imagepath VARCHAR(255)
);

-- Bảng 2: Nhật ký ra vào
CREATE TABLE IF NOT EXISTS nhatkyravao (
logid SERIAL PRIMARY KEY,
"timestamp" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
eventtype VARCHAR(100) NOT NULL,
personid VARCHAR(50),
capturedimage VARCHAR(255),
CONSTRAINT fk_nguoi_quen
FOREIGN KEY (personid)
REFERENCES nguoiquen(id)
ON DELETE SET NULL
);

-- ============================================================================
-- Ghi chú nghiệp vụ:
-- 1. EventType có thể là:
--    - known / Người quen mở cửa
--    - unknown / Khách lạ
--    - spoofing / Giả mạo
--------------------------

-- 2. PersonID:
--    - Nếu là người quen thì có giá trị và trỏ tới nguoiquen.id
--    - Nếu là người lạ hoặc giả mạo thì để NULL
------------------------------------------------
-- ============================================================================
