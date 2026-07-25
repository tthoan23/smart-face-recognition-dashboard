// src/pages/LogsView.tsx

import { useState } from "react";
import { LogEntry, EventType } from "../types";
import { Icon } from "../components/Icons";
import { EventBadge, Pagination } from "../components/UI";

interface LogsViewProps {
    logs: LogEntry[];
    onDeleteLog?: (id: number) => void;
}

export default function LogsView({ logs, onDeleteLog }: LogsViewProps) {
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState<"all" | EventType | string>("all");
    const [page, setPage] = useState(1);
    const PER = 6;

    const safeLogs = Array.isArray(logs) ? logs : [];

    // Lọc dữ liệu theo Từ khóa và Loại sự kiện
    const filtered = safeLogs.filter(l => {
        const q = search.toLowerCase();
        const pName = (l.personName || "").toLowerCase();
        const pId = (l.personId || "").toLowerCase();
        const time = (l.timestamp || "").toLowerCase();

        const matchSearch = pName.includes(q) || pId.includes(q) || time.includes(q);
        if (filter === "all") return matchSearch;

        const eType = (l.eventType as string) || "";
        if (filter === "known") return matchSearch && (eType === "known" || eType === "Người quen mở cửa");
        if (filter === "unknown") return matchSearch && (eType === "unknown" || eType === "Khách lạ tương tác");
        if (filter === "spoofing") return matchSearch && (eType === "spoofing" || eType === "Cảnh báo giả mạo");

        return matchSearch;
    });

    const total = Math.ceil(filtered.length / PER);
    const paged = filtered.slice((page - 1) * PER, page * PER);

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Thanh tìm kiếm và bộ lọc */}
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <div style={{ position: "relative", flex: 1 }}>
                    <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }}>
                        <Icon name="search" size={15} />
                    </span>
                    <input
                        value={search}
                        onChange={e => { setSearch(e.target.value); setPage(1); }}
                        placeholder="Tìm kiếm theo tên, ID, thời gian..."
                        style={{ width: "100%", padding: "9px 12px 9px 36px", borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 13.5, color: "#0f172a", background: "#fff", outline: "none" }}
                    />
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                    {(["all", "known", "unknown", "spoofing"] as const).map(f => (
                        <button
                            key={f}
                            onClick={() => { setFilter(f); setPage(1); }}
                            style={{
                                padding: "8px 14px", borderRadius: 8, border: "1px solid", fontSize: 12.5, fontWeight: 500, cursor: "pointer",
                                background: filter === f ? "#2563eb" : "#fff",
                                color: filter === f ? "#fff" : "#64748b",
                                borderColor: filter === f ? "#2563eb" : "#e2e8f0"
                            }}
                        >
                            {f === "all" ? "Tất cả" : f === "known" ? "Known" : f === "unknown" ? "Unknown" : "Spoofing"}
                        </button>
                    ))}
                </div>
            </div>

            {/* Bảng Nhật ký */}
            <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr style={{ background: "#f8fafc" }}>
                            {["Thời gian", "Loại sự kiện", "Person ID", "Họ tên", "Ảnh chụp", "Thao tác"].map(h => (
                                <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid #e2e8f0" }}>
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {paged.map((log, i) => (
                            <tr
                                key={log.id}
                                style={{ borderBottom: i < paged.length - 1 ? "1px solid #f1f5f9" : "none" }}
                                onMouseEnter={e => { (e.currentTarget as HTMLTableRowElement).style.background = "#f8fafc"; }}
                                onMouseLeave={e => { (e.currentTarget as HTMLTableRowElement).style.background = ""; }}
                            >
                                <td style={{ padding: "14px 16px", fontSize: 13, color: "#64748b", fontFamily: "monospace", whiteSpace: "nowrap" }}>
                                    {log.timestamp ? new Date(log.timestamp).toLocaleString("vi-VN") : "—"}
                                </td>
                                <td style={{ padding: "14px 16px" }}>
                                    <EventBadge type={log.eventType} />
                                </td>
                                <td style={{ padding: "14px 16px", fontSize: 13, color: "#0f172a", fontFamily: "monospace", fontWeight: 500 }}>
                                    {log.personId || "—"}
                                </td>
                                <td style={{ padding: "14px 16px", fontSize: 13, color: "#0f172a", fontWeight: 500 }}>
                                    {log.personName || "Khách lạ"}
                                </td>
                                <td style={{ padding: "14px 16px" }}>
                                    <img
                                        src={log.image || "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&h=60&fit=crop&auto=format"}
                                        alt={log.personName || "Log"}
                                        style={{ width: 44, height: 44, borderRadius: 8, objectFit: "cover", background: "#e2e8f0", border: "1px solid #e2e8f0" }}
                                    />
                                </td>
                                <td style={{ padding: "14px 16px" }}>
                                    {onDeleteLog && (
                                        <button
                                            onClick={() => onDeleteLog(log.id)}
                                            style={{ width: 32, height: 32, borderRadius: 6, border: "1px solid #e2e8f0", background: "#fff", cursor: "pointer", color: "#dc2626", display: "flex", alignItems: "center", justifyContent: "center" }}
                                            title="Xóa bản ghi này"
                                        >
                                            <Icon name="trash" size={14} />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {paged.length === 0 && (
                            <tr>
                                <td colSpan={6} style={{ padding: 40, textAlign: "center", color: "#94a3b8" }}>
                                    Không tìm thấy bản ghi nhật ký nào
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <Pagination page={page} total={total} count={filtered.length} perPage={PER} label="bản ghi" onPage={setPage} />
        </div>
    );
}