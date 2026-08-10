// src/pages/DashboardView.tsx

import { LogEntry } from "../types";
import { StatCard, EventBadge } from "../components/UI";

interface DashboardViewProps {
    logs: LogEntry[];
    personsCount?: number; // Số lượng người quen thực tế từ DB
}

export default function DashboardView({ logs, personsCount = 0 }: DashboardViewProps) {
    const safeLogs = Array.isArray(logs) ? logs : [];

    // Lọc các số liệu thống kê
    //const known = safeLogs.filter(l => (l.eventType as string) === "known" || (l.eventType as string) === "Người quen mở cửa" || (l.eventType as string) === "1. Người quen mở cửa (Cười Liveness đạt)").length;
    //const unknown = safeLogs.filter(l => (l.eventType as string) === "unknown" || (l.eventType as string) === "Khách lạ tương tác").length;
    //const spoofing = safeLogs.filter(l => (l.eventType as string) === "spoofing" || (l.eventType as string) === "Cảnh báo giả mạo").length;

    const today = new Date(); const startOfToday = new Date( today.getFullYear(), today.getMonth(), today.getDate() ); 
    const startOfTomorrow = new Date( today.getFullYear(), today.getMonth(), today.getDate() + 1 ); 
    // Chỉ giữ lại các event xảy ra trong ngày hôm nay 
    const todayLogs = safeLogs.filter((log) => { 
        if (!log.timestamp) return false; 
        const logDate = new Date(log.timestamp); 
        return logDate >= startOfToday && logDate < startOfTomorrow; 
    }); // Lọc các số liệu thống kê trong ngày hôm nay 
    const known = todayLogs.filter( (l) => (l.eventType as string) === "known" || (l.eventType as string) === "Người quen mở cửa" || (l.eventType as string) === "1. Người quen mở cửa (Cười Liveness đạt)" ).length; 
    const unknown = todayLogs.filter( (l) => (l.eventType as string) === "unknown" || (l.eventType as string) === "Khách lạ tương tác" ).length; 
    const spoofing = todayLogs.filter( (l) => (l.eventType as string) === "spoofing" || (l.eventType as string) === "Cảnh báo giả mạo" ).length;
    
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {/* 4 Thẻ Thống kê */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
                {/* Số người quen dùng giá trị personsCount thực tế từ Backend */}
                <StatCard label="Tổng người quen" value={personsCount} icon="persons" color="blue" sub="Đã đăng ký hệ thống" />
                <StatCard label="Nhận diện hôm nay" value={known} icon="face" color="green" sub="Lượt xác nhận thành công" />
                <StatCard label="Người lạ hôm nay" value={unknown} icon="unknown" color="orange" sub="Cần xem xét thêm" />
                <StatCard label="Cảnh báo giả mạo" value={spoofing} icon="shield" color="red" sub="Phát hiện trong ngày" />
            </div>

            {/* Bảng Sự kiện gần đây */}
            <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0" }}>
                <div style={{ padding: "16px 20px", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h2 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: "#0f172a" }}>Sự kiện hôm nay</h2>
                    <span style={{ fontSize: 12, color: "#94a3b8" }}>{today.toLocaleDateString("vi-VN")}</span>
                </div>

                {todayLogs.length === 0 ? (
                    <div style={{ padding: 40, textAlign: "center", color: "#94a3b8" }}>
                        Chưa có sự kiện ra vào nào được ghi nhận trong cơ sở dữ liệu.
                    </div>
                ) : (
                    todayLogs.slice(0, 5).map((log, i) => (
                        <div key={log.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 20px", borderBottom: i < Math.min(todayLogs.length, 5) - 1 ? "1px solid #f1f5f9" : "none" }}>
                            <img
                                src={log.image || "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&h=60&fit=crop&auto=format"}
                                alt={log.personName || "Khách"}
                                style={{ width: 40, height: 40, borderRadius: 8, objectFit: "cover", background: "#e2e8f0" }}
                            />
                            <div style={{ flex: 1 }}>
                                <p style={{ margin: 0, fontSize: 13.5, fontWeight: 500, color: "#0f172a" }}>
                                    {log.personName || (log.eventType === "unknown" ? "Khách lạ" : "Giả mạo")}
                                </p>
                                <p style={{ margin: "2px 0 0", fontSize: 12, color: "#94a3b8" }}>
                                    {log.personId ? `ID: ${log.personId} · ` : ""}
                                    {log.timestamp ? new Date(log.timestamp).toLocaleString("vi-VN") : "—"}
                                </p>
                            </div>
                            <EventBadge type={log.eventType} />
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
