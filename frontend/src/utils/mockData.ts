import {
    LogEntry,
    Person,
    Notification,
    RecordedClip,
    DoorLock,
    LockHistoryEntry
} from "../types";

export const MOCK_LOGS: LogEntry[] = [
    { id: 1, timestamp: "2026-07-22 08:02:14", eventType: "known", personId: "P-001", personName: "Nguyễn Văn An", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&auto=format" },
    { id: 2, timestamp: "2026-07-22 08:15:37", eventType: "unknown", personId: "—", personName: "Khách lạ", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&h=60&fit=crop&auto=format" },
    { id: 3, timestamp: "2026-07-22 08:31:02", eventType: "known", personId: "P-003", personName: "Lê Thị Hoa", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=60&h=60&fit=crop&auto=format" },
    { id: 4, timestamp: "2026-07-22 08:49:55", eventType: "spoofing", personId: "—", personName: "Giả mạo", image: "https://images.unsplash.com/photo-1601412436009-d964bd02edbc?w=60&h=60&fit=crop&auto=format" },
    { id: 5, timestamp: "2026-07-22 09:03:18", eventType: "known", personId: "P-002", personName: "Trần Minh Khoa", image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=60&h=60&fit=crop&auto=format" },
    { id: 6, timestamp: "2026-07-22 09:22:44", eventType: "unknown", personId: "—", personName: "Khách lạ", image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=60&h=60&fit=crop&auto=format" },
    { id: 7, timestamp: "2026-07-22 09:41:09", eventType: "known", personId: "P-004", personName: "Phạm Đức Thành", image: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=60&h=60&fit=crop&auto=format" },
    { id: 8, timestamp: "2026-07-22 10:05:33", eventType: "spoofing", personId: "—", personName: "Giả mạo", image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=60&h=60&fit=crop&auto=format" },
    { id: 9, timestamp: "2026-07-22 10:18:22", eventType: "known", personId: "P-001", personName: "Nguyễn Văn An", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&auto=format" },
    { id: 10, timestamp: "2026-07-22 10:44:51", eventType: "unknown", personId: "—", personName: "Khách lạ", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=60&h=60&fit=crop&auto=format" },
]

export const MOCK_PERSONS: Person[] = [
    { id: 1, personId: "P-001", name: "Nguyễn Văn An", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&auto=format" },
    { id: 2, personId: "P-002", name: "Trần Minh Khoa", image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=80&h=80&fit=crop&auto=format" },
    { id: 3, personId: "P-003", name: "Lê Thị Hoa", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop&auto=format" },
    { id: 4, personId: "P-004", name: "Phạm Đức Thành", image: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=80&h=80&fit=crop&auto=format" },
    { id: 5, personId: "P-005", name: "Hoàng Thị Mai", image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=80&h=80&fit=crop&auto=format" },
    { id: 6, personId: "P-006", name: "Vũ Quang Huy", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&auto=format" },
]

export const INIT_NOTIFICATIONS: Notification[] = [
    { id: 1, type: "known", message: "Nguyễn Văn An đã được nhận diện tại Camera 1", time: "2 phút trước", read: false },
    { id: 2, type: "unknown", message: "Phát hiện người lạ tại Camera 2 — lúc 10:44", time: "8 phút trước", read: false },
    { id: 3, type: "spoofing", message: "Cảnh báo giả mạo tại Camera 1 — lúc 10:05", time: "47 phút trước", read: true },
    { id: 4, type: "lock", message: "Cửa chính đã được MỞ bởi Admin User — lúc 09:30", time: "1 giờ trước", read: false },
    { id: 5, type: "lock", message: "Cửa phụ đã được KHOÁ bởi Hệ thống tự động — lúc 08:00", time: "2 giờ trước", read: true },
    { id: 6, type: "known", message: "Lê Thị Hoa đã được nhận diện tại Camera 3", time: "2 giờ trước", read: true },
]

export const MOCK_CLIPS: RecordedClip[] = [
    { id: 1, cameraId: 1, thumbnail: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=200&h=112&fit=crop&auto=format", timestamp: "2026-07-22 10:18:00", duration: "02:34" },
    { id: 2, cameraId: 1, thumbnail: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=200&h=112&fit=crop&auto=format", timestamp: "2026-07-22 09:05:10", duration: "01:12" },
    { id: 3, cameraId: 2, thumbnail: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=200&h=112&fit=crop&auto=format", timestamp: "2026-07-22 08:49:00", duration: "00:47" },
    { id: 4, cameraId: 2, thumbnail: "https://images.unsplash.com/photo-1556761175-4b46a572b786?w=200&h=112&fit=crop&auto=format", timestamp: "2026-07-22 08:02:00", duration: "03:15" },
    { id: 5, cameraId: 3, thumbnail: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=200&h=112&fit=crop&auto=format", timestamp: "2026-07-22 07:30:00", duration: "01:58" },
]

export const INIT_LOCKS: DoorLock[] = [
    { id: 1, name: "Cửa chính", location: "Tầng 1 — Sảnh vào", locked: false, lastAction: "2026-07-22 09:30:12", lastBy: "Admin User" },
    { id: 2, name: "Cửa phụ", location: "Tầng 1 — Hành lang B", locked: true, lastAction: "2026-07-22 08:00:00", lastBy: "Hệ thống tự động" },
    { id: 3, name: "Cửa kho", location: "Tầng B1 — Kho vật tư", locked: true, lastAction: "2026-07-21 18:45:03", lastBy: "Admin User" },
]

export const INIT_LOCK_HISTORY: LockHistoryEntry[] = [
    { id: 1, lockId: 1, lockName: "Cửa chính", timestamp: "2026-07-22 09:30:12", action: "unlocked", performedBy: "Admin User" },
    { id: 2, lockId: 2, lockName: "Cửa phụ", timestamp: "2026-07-22 08:00:00", action: "locked", performedBy: "Hệ thống tự động" },
    { id: 3, lockId: 1, lockName: "Cửa chính", timestamp: "2026-07-22 07:58:44", action: "locked", performedBy: "Admin User" },
    { id: 4, lockId: 3, lockName: "Cửa kho", timestamp: "2026-07-21 18:45:03", action: "locked", performedBy: "Admin User" },
    { id: 5, lockId: 1, lockName: "Cửa chính", timestamp: "2026-07-21 17:30:00", action: "unlocked", performedBy: "Hệ thống tự động" },
    { id: 6, lockId: 2, lockName: "Cửa phụ", timestamp: "2026-07-21 12:10:22", action: "unlocked", performedBy: "Admin User" },
]

export const CAMERAS = [
    { id: 1, name: "Camera 1", location: "Sảnh vào", feed: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=900&h=506&fit=crop&auto=format" },
    { id: 2, name: "Camera 2", location: "Hành lang B", feed: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=900&h=506&fit=crop&auto=format" },
    { id: 3, name: "Camera 3", location: "Khu vực kho", feed: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=900&h=506&fit=crop&auto=format" },
]