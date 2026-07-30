import { useEffect, useState } from "react";
import { LogEntry, EventType } from "../types";
import { Icon } from "../components/Icons";
import { EventBadge, Pagination } from "../components/UI";

interface LogsViewProps {
    logs?: LogEntry[];
    onDeleteLog?: (id: number) => void;
}

const API_URL = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");

export default function LogsView({ logs = [], onDeleteLog }: LogsViewProps) {
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState<"all" | EventType | string>("all");
    const [page, setPage] = useState(1);
    const [remoteLogs, setRemoteLogs] = useState<LogEntry[]>(Array.isArray(logs) ? logs : []);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const PER = 6;

    useEffect(() => {
        let cancelled = false;

        const loadLogs = async () => {
            try {
                setLoading(true);
                setError("");

                if (!API_URL) {
                    throw new Error("Missing VITE_API_URL");
                }

                const res = await fetch(`${API_URL}/api/events`);
                if (!res.ok) {
                    throw new Error(`Failed to fetch logs: ${res.status}`);
                }

                const data = await res.json();

                if (!cancelled) {
                    setRemoteLogs(Array.isArray(data) ? data : []);
                }
            } catch (err) {
                if (!cancelled) {
                    setError(err instanceof Error ? err.message : "Không thể tải nhật ký");
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        void loadLogs();

        return () => {
            cancelled = true;
        };
    }, []);

    const safeLogs = Array.isArray(remoteLogs) ? remoteLogs : [];

    const filtered = safeLogs.filter(l => {
        const q = search.toLowerCase();
        const pName = (l.personName || "").toLowerCase();
        const pId = (l.personId || "").toLowerCase();
        const time = (l.timestamp || "").toString().toLowerCase();

        const matchSearch = pName.includes(q) || pId.includes(q) || time.includes(q);
        if (filter === "all") return matchSearch;

        const eType = (l.eventType as string) || "";
        if (filter === "known") return matchSearch && (eType === "known" || eType === "Người quen mở cửa" || eType === "1. Người quen mở cửa (Cười Liveness đạt)");
        if (filter === "unknown") return matchSearch && (eType === "unknown" || eType === "Khách lạ tương tác");
        if (filter === "spoofing") return matchSearch && (eType === "spoofing" || eType === "Cảnh báo giả mạo");

        return matchSearch;
    });

    const total = Math.max(1, Math.ceil(filtered.length / PER));
    const paged = filtered.slice((page - 1) * PER, page * PER);

    useEffect(() => {
        if (page > total) setPage(1);
    }, [total, page]);

    const handleDelete = async (id: number) => {
        if (!onDeleteLog) return;
        await onDeleteLog(id);
        setRemoteLogs(prev => prev.filter(l => l.id !== id));
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
                <div style={{ position: "relative", flex: 1, minWidth: 260 }}>
                    <span
                        style={{
                            position: "absolute",
                            left: 12,
                            top: "50%",
                            transform: "translateY(-50%)",
                            color: "#94a3b8",
                        }}
                    >
                        <Icon name="search" size={15} />
                    </span>
                    <input
                        value={search}
                        onChange={e => {
                            setSearch(e.target.value);
                            setPage(1);
                        }}
                        placeholder="Tìm kiếm theo tên, ID hoặc thời gian..."
                        style={{
                            width: "100%",
                            padding: "9px 12px 9px 36px",
                            borderRadius: 8,
                            border: "1px solid #e2e8f0",
                            fontSize: 13.5,
                            color: "#0f172a",
                            background: "#fff",
                            outline: "none",
                        }}
                    />
                </div>

                <select
                    value={filter}
                    onChange={e => {
                        setFilter(e.target.value as any);
                        setPage(1);
                    }}
                    style={{
                        padding: "9px 12px",
                        borderRadius: 8,
                        border: "1px solid #e2e8f0",
                        background: "#fff",
                        fontSize: 13.5,
                        color: "#0f172a",
                        outline: "none",
                    }}
                >
                    <option value="all">Tất cả</option>
                    <option value="known">Người quen</option>
                    <option value="unknown">Khách lạ</option>
                    <option value="spoofing">Giả mạo</option>
                </select>
            </div>

            <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", overflow: "hidden" }}>
                {loading ? (
                    <div style={{ padding: 32, textAlign: "center", color: "#64748b" }}>
                        Đang tải dữ liệu nhật ký...
                    </div>
                ) : error ? (
                    <div style={{ padding: 32, textAlign: "center", color: "#dc2626" }}>
                        {error}
                    </div>
                ) : (
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr style={{ background: "#f8fafc" }}>
                                {["Thời gian", "Loại sự kiện", "Person ID", "Tên", "Thao tác"].map(h => (
                                    <th
                                        key={h}
                                        style={{
                                            padding: "12px 16px",
                                            textAlign: "left",
                                            fontSize: 12,
                                            fontWeight: 600,
                                            color: "#64748b",
                                            textTransform: "uppercase",
                                            letterSpacing: "0.05em",
                                            borderBottom: "1px solid #e2e8f0",
                                        }}
                                    >
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
                                    onMouseEnter={e => {
                                        (e.currentTarget as HTMLTableRowElement).style.background = "#f8fafc";
                                    }}
                                    onMouseLeave={e => {
                                        (e.currentTarget as HTMLTableRowElement).style.background = "";
                                    }}
                                >
                                    <td style={{ padding: "14px 16px", fontSize: 13, color: "#0f172a" }}>
                                        {new Date(log.timestamp).toLocaleString("vi-VN")}
                                    </td>
                                    <td style={{ padding: "14px 16px" }}>
                                        <EventBadge type={log.eventType as EventType} />
                                    </td>
                                    <td style={{ padding: "14px 16px", fontFamily: "monospace", fontSize: 13, color: "#2563eb" }}>
                                        {log.personId || "-"}
                                    </td>
                                    <td style={{ padding: "14px 16px", fontSize: 13, color: "#0f172a" }}>
                                        {log.personName || "Không xác định"}
                                    </td>
                                    <td style={{ padding: "14px 16px" }}>
                                        <button
                                            onClick={() => handleDelete(log.id)}
                                            style={{
                                                padding: "7px 12px",
                                                borderRadius: 8,
                                                border: "1px solid #e2e8f0",
                                                background: "#fff",
                                                color: "#dc2626",
                                                cursor: "pointer",
                                                fontSize: 13,
                                                fontWeight: 600,
                                            }}
                                        >
                                            Xóa
                                        </button>
                                    </td>
                                </tr>
                            ))}

                            {paged.length === 0 && (
                                <tr>
                                    <td colSpan={5} style={{ padding: 40, textAlign: "center", color: "#94a3b8" }}>
                                        Không tìm thấy dữ liệu
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            {!loading && !error && (
                <Pagination
                    page={page}
                    total={total}
                    count={filtered.length}
                    perPage={PER}
                    label="bản ghi"
                    onPage={setPage}
                />
            )}
        </div>
    );
}
