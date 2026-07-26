import { useState } from "react";
import { LockHistoryEntry } from "../types";
import { INIT_LOCKS, INIT_LOCK_HISTORY } from "../utils/mockData";
import { Icon } from "../components/Icons";
import { ToggleSwitch, Modal } from "../components/UI";

export default function AccessControlView({ onLockChange }: { onLockChange: (lockName: string, action: "locked" | "unlocked") => void }) {
    const DOOR = INIT_LOCKS[0]
    const [locked, setLocked] = useState(DOOR.locked)
    const [lastAction, setLastAction] = useState(DOOR.lastAction)
    const [lastBy, setLastBy] = useState(DOOR.lastBy)
    const [history, setHistory] = useState<LockHistoryEntry[]>(INIT_LOCK_HISTORY)
    const [confirm, setConfirm] = useState<boolean | null>(null)
    const API_URL = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");


    const handleConfirm = async () => {
        if (confirm === null) return
        const next = confirm
        const now = new Date().toLocaleString("sv").replace("T", " ")


        try {
            // Gọi API xuống Backend
            await fetch("${API_URL}/api/door/lock", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    lockName: DOOR.name,
                    action: next ? "locked" : "unlocked",
                    performedBy: "Admin User"
                })
            });

            setLocked(next)
            setLastAction(now)
            setLastBy("Admin User")
            setHistory(h => [
                { id: Date.now(), lockId: 1, lockName: DOOR.name, timestamp: now, action: next ? "locked" : "unlocked", performedBy: "Admin User" },
                ...h
            ]);
            onLockChange(DOOR.name, next ? "locked" : "unlocked")
            setConfirm(null)
        } catch (err) {
            console.error("Lỗi khi thay đổi trạng thái khoá: ", err)
        }
    }

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 720, margin: "0 auto" }}>
            {/* Single lock card */}
            <div style={{
                background: "#fff", borderRadius: 16, border: `2px solid ${locked ? "#e2e8f0" : "#86efac"}`,
                padding: "32px", display: "flex", flexDirection: "column", gap: 24,
                boxShadow: locked ? "0 1px 8px rgba(0,0,0,0.04)" : "0 0 0 6px rgba(34,197,94,0.07), 0 1px 8px rgba(0,0,0,0.04)",
                transition: "border-color .3s, box-shadow .3s",
            }}>
                {/* Top row: icon + name + toggle */}
                <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                    <span style={{
                        width: 72, height: 72, borderRadius: 18, flexShrink: 0,
                        background: locked ? "#f1f5f9" : "#dcfce7",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: locked ? "#475569" : "#16a34a",
                        transition: "background .3s, color .3s",
                    }}>
                        <Icon name={locked ? "lock" : "unlock"} size={34} />
                    </span>
                    <div style={{ flex: 1 }}>
                        <p style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#0f172a" }}>{DOOR.name}</p>
                        <p style={{ margin: "4px 0 0", fontSize: 13, color: "#94a3b8" }}>{DOOR.location}</p>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                        <ToggleSwitch on={!locked} onChange={v => setConfirm(!v)} />
                        <span style={{ fontSize: 11, fontWeight: 600, color: locked ? "#94a3b8" : "#16a34a" }}>
                            {locked ? "Đang khoá" : "Đang mở"}
                        </span>
                    </div>
                </div>

                {/* Big status display */}
                <div style={{
                    borderRadius: 12, padding: "20px 24px", textAlign: "center",
                    background: locked ? "#f8fafc" : "#f0fdf4",
                    border: `1px solid ${locked ? "#e2e8f0" : "#bbf7d0"}`,
                    transition: "background .3s, border-color .3s",
                }}>
                    <p style={{ margin: 0, fontSize: 28, fontWeight: 800, letterSpacing: "-0.02em", color: locked ? "#334155" : "#15803d" }}>
                        {locked ? "🔒 Đang khoá" : "🔓 Đang mở"}
                    </p>
                    <p style={{ margin: "8px 0 0", fontSize: 13, color: "#94a3b8" }}>
                        Cập nhật lúc {lastAction} · bởi {lastBy}
                    </p>
                </div>

                {/* Action button */}
                <button
                    onClick={() => setConfirm(!locked)}
                    style={{
                        width: "100%", padding: "13px", borderRadius: 10, border: "none", fontSize: 15, fontWeight: 700, cursor: "pointer", transition: "background .15s",
                        background: locked ? "#2563eb" : "#dc2626", color: "#fff",
                        letterSpacing: "-0.01em",
                    }}>
                    {locked ? "Mở khoá cửa từ xa" : "Khoá cửa lại"}
                </button>
            </div>

            {/* History table */}
            <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0" }}>
                <div style={{ padding: "16px 20px", borderBottom: "1px solid #e2e8f0" }}>
                    <h2 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: "#0f172a" }}>Lịch sử thao tác khoá cửa</h2>
                </div>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead><tr style={{ background: "#f8fafc" }}>
                        {["Thời gian", "Cửa", "Hành động", "Người thực hiện"].map(h => (
                            <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid #e2e8f0" }}>{h}</th>
                        ))}
                    </tr></thead>
                    <tbody>
                        {history.slice(0, 10).map((entry, i) => (
                            <tr key={entry.id} style={{ borderBottom: i < Math.min(history.length, 10) - 1 ? "1px solid #f1f5f9" : "none" }}
                                onMouseEnter={e => { (e.currentTarget as HTMLTableRowElement).style.background = "#f8fafc" }}
                                onMouseLeave={e => { (e.currentTarget as HTMLTableRowElement).style.background = "" }}>
                                <td style={{ padding: "13px 16px", fontSize: 13, color: "#64748b", fontFamily: "monospace", whiteSpace: "nowrap" }}>{entry.timestamp}</td>
                                <td style={{ padding: "13px 16px", fontSize: 13, color: "#0f172a", fontWeight: 500 }}>{entry.lockName}</td>
                                <td style={{ padding: "13px 16px" }}>
                                    <span style={{
                                        display: "inline-flex", alignItems: "center", gap: 6, padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 500,
                                        background: entry.action === "unlocked" ? "#dcfce7" : "#f1f5f9",
                                        color: entry.action === "unlocked" ? "#15803d" : "#475569"
                                    }}>
                                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: entry.action === "unlocked" ? "#16a34a" : "#94a3b8" }} />
                                        {entry.action === "unlocked" ? "Đã mở" : "Đã khoá"}
                                    </span>
                                </td>
                                <td style={{ padding: "13px 16px", fontSize: 13, color: "#0f172a" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                        <span style={{ width: 22, height: 22, borderRadius: "50%", background: entry.performedBy === "Hệ thống tự động" ? "#eff6ff" : "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: entry.performedBy === "Hệ thống tự động" ? "#2563eb" : "#16a34a" }}>
                                            {entry.performedBy === "Hệ thống tự động" ? <Icon name="shield" size={11} /> : <Icon name="persons" size={11} />}
                                        </span>
                                        {entry.performedBy}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Confirm modal */}
            {confirm !== null && (
                <Modal title={`Xác nhận ${confirm ? "khoá" : "mở"} cửa`} onClose={() => setConfirm(null)}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                        <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                            <span style={{ width: 48, height: 48, borderRadius: 12, background: confirm ? "#f1f5f9" : "#dcfce7", color: confirm ? "#475569" : "#16a34a", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                <Icon name={confirm ? "lock" : "unlock"} size={22} />
                            </span>
                            <div>
                                <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "#0f172a" }}>
                                    Bạn có chắc muốn {confirm ? "KHOÁ" : "MỞ"} {DOOR.name} từ xa?
                                </p>
                                <p style={{ margin: "6px 0 0", fontSize: 13, color: "#64748b", lineHeight: 1.5 }}>
                                    {DOOR.location}. Hành động này sẽ được ghi lại vào lịch sử thao tác.
                                </p>
                            </div>
                        </div>
                        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                            <button onClick={() => setConfirm(null)} style={{ padding: "9px 20px", borderRadius: 8, border: "1px solid #e2e8f0", background: "#fff", fontSize: 13.5, fontWeight: 500, cursor: "pointer", color: "#64748b" }}>Hủy</button>
                            <button onClick={handleConfirm}
                                style={{
                                    padding: "9px 20px", borderRadius: 8, border: "none", fontSize: 13.5, fontWeight: 600, cursor: "pointer", color: "#fff",
                                    background: confirm ? "#475569" : "#2563eb"
                                }}>
                                Xác nhận {confirm ? "Khoá" : "Mở"}
                            </button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    )
}
