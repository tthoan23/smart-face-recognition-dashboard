import { Icon } from '../components/Icons';
import { View, Notification, NotifType } from '../types';

export function Sidebar({ view, onView, onLogout }: { view: View; onView: (v: View) => void; onLogout: () => void }) {
    const items: { id: View; label: string; icon: string }[] = [
        { id: "dashboard", label: "Dashboard", icon: "dashboard" },
        { id: "logs", label: "Nhật ký ra vào", icon: "logs" },
        { id: "persons", label: "Người quen", icon: "persons" },
        { id: "camera", label: "Camera Livestream", icon: "camera" },
        { id: "access", label: "Điều khiển khoá", icon: "lock" },
    ]
    return (
        <aside style={{ width: 240, background: "#0f172a", display: "flex", flexDirection: "column", height: "100vh", position: "fixed", left: 0, top: 0, zIndex: 50 }}>
            <div style={{ padding: "24px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 9, background: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <span style={{ color: "#fff" }}><Icon name="face" size={18} /></span>
                    </div>
                    <div>
                        <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#fff" }}>FaceGuard</p>
                        <p style={{ margin: 0, fontSize: 11, color: "#64748b" }}>Recognition System</p>
                    </div>
                </div>
            </div>
            <nav style={{ flex: 1, padding: "12px 10px", display: "flex", flexDirection: "column", gap: 2 }}>
                {items.map(item => {
                    const active = view === item.id
                    return (
                        <button key={item.id} onClick={() => onView(item.id)}
                            style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 8, background: active ? "#2563eb" : "transparent", color: active ? "#fff" : "#94a3b8", border: "none", cursor: "pointer", fontSize: 13.5, fontWeight: 500, textAlign: "left", width: "100%", transition: "background .15s, color .15s" }}
                            onMouseEnter={e => { if (!active) { (e.currentTarget as HTMLButtonElement).style.background = "#1e293b"; (e.currentTarget as HTMLButtonElement).style.color = "#e2e8f0" } }}
                            onMouseLeave={e => { if (!active) { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; (e.currentTarget as HTMLButtonElement).style.color = "#94a3b8" } }}
                        >
                            <Icon name={item.icon} size={16} />
                            {item.label}
                        </button>
                    )
                })}
            </nav>
            <div style={{ padding: "12px 10px", borderBottom: "1px solid rgba(255,255,255,0.06)", margin: "0 0 8px" }}>
                <div style={{ padding: "10px 12px", borderRadius: 8, background: "#1e293b" }}>
                    <p style={{ margin: 0, fontSize: 11, color: "#475569", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>Trạng thái hệ thống</p>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 0 2px rgba(34,197,94,0.3)" }} />
                        <span style={{ fontSize: 12, color: "#94a3b8" }}>1 camera đang hoạt động</span>
                    </div>
                </div>
            </div>
            <div style={{ padding: "0 10px 12px" }}>
                <button onClick={onLogout}
                    style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 8, background: "transparent", color: "#64748b", border: "none", cursor: "pointer", fontSize: 13.5, fontWeight: 500, width: "100%", textAlign: "left", transition: "background .15s, color .15s" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "#1e293b"; (e.currentTarget as HTMLButtonElement).style.color = "#f87171" }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; (e.currentTarget as HTMLButtonElement).style.color = "#64748b" }}
                >
                    <Icon name="logout" size={16} />Đăng xuất
                </button>
            </div>
        </aside>
    )
}
export function Header({ title, notifications, onToggleNotif }: { title: string; notifications: Notification[]; onToggleNotif: () => void }) {
    const unread = notifications.filter(n => !n.read).length
    return (
        <header style={{ height: 60, background: "#fff", borderBottom: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px", position: "sticky", top: 0, zIndex: 40 }}>
            <h1 style={{ margin: 0, fontSize: 17, fontWeight: 600, color: "#0f172a" }}>{title}</h1>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                {/*<button onClick={onToggleNotif} style={{ position: "relative", background: "none", border: "none", cursor: "pointer", color: "#64748b", padding: 6, borderRadius: 8, display: "flex", alignItems: "center" }}>
                    <Icon name="bell" size={18} />
                    {unread > 0 && (
                        <span style={{ position: "absolute", top: 2, right: 2, width: 16, height: 16, borderRadius: "50%", background: "#dc2626", color: "#fff", fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #fff" }}>
                            {unread}
                        </span>
                    )}
                </button>*/
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    {/*<img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&auto=format" alt="Admin" style={{ width: 34, height: 34, borderRadius: "50%", objectFit: "cover", border: "2px solid #e2e8f0" }} />*/}
                    <div style={{ lineHeight: 1.3 }}>
                        <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#0f172a" }}>Admin User</p>
                        <p style={{ margin: 0, fontSize: 11, color: "#94a3b8" }}>Quản trị viên</p>
                    </div>
                </div>
            </div>
        </header>
    )
}
export function NotificationPanel({ notifications, onClose, onMarkRead }: { notifications: Notification[]; onClose: () => void; onMarkRead: (id: number) => void }) {
    const config: Record<NotifType, { icon: string; bg: string; color: string; label: string }> = {
        known: { icon: "face", bg: "#dcfce7", color: "#16a34a", label: "Nhận diện" },
        unknown: { icon: "unknown", bg: "#fff7ed", color: "#ea580c", label: "Người lạ" },
        spoofing: { icon: "shield", bg: "#fef2f2", color: "#dc2626", label: "Giả mạo" },
        lock: { icon: "keyRound", bg: "#eff6ff", color: "#2563eb", label: "Khoá cửa" },
    }
    return (
        <div style={{ position: "fixed", top: 60, right: 0, width: 380, background: "#fff", borderLeft: "1px solid #e2e8f0", boxShadow: "-8px 8px 32px rgba(0,0,0,0.08)", zIndex: 60, maxHeight: "calc(100vh - 60px)", overflowY: "auto", borderRadius: "0 0 0 12px" }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, background: "#fff" }}>
                <div>
                    <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: "#0f172a" }}>Thông báo</h3>
                    <p style={{ margin: "2px 0 0", fontSize: 12, color: "#94a3b8" }}>{notifications.filter(n => !n.read).length} chưa đọc</p>
                </div>
                <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b" }}><Icon name="close" size={16} /></button>
            </div>

            {/* Type legend */}
            <div style={{ padding: "10px 20px", borderBottom: "1px solid #f1f5f9", display: "flex", gap: 8, flexWrap: "wrap" }}>
                {(Object.entries(config) as [NotifType, typeof config[NotifType]][]).map(([type, c]) => (
                    <span key={type} style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 8px", borderRadius: 12, background: c.bg, color: c.color, fontSize: 11, fontWeight: 500 }}>
                        <Icon name={c.icon} size={10} />{c.label}
                    </span>
                ))}
            </div>

            {notifications.map(n => {
                const c = config[n.type]
                return (
                    <div key={n.id} onClick={() => onMarkRead(n.id)}
                        style={{ padding: "14px 20px", borderBottom: "1px solid #f1f5f9", cursor: "pointer", background: n.read ? "#fff" : "#fafbff", display: "flex", gap: 12, alignItems: "flex-start", transition: "background .1s" }}
                        onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = "#f8fafc" }}
                        onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = n.read ? "#fff" : "#fafbff" }}
                    >
                        <span style={{ width: 36, height: 36, borderRadius: 9, background: c.bg, color: c.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <Icon name={c.icon} size={16} />
                        </span>
                        <div style={{ flex: 1 }}>
                            <p style={{ margin: 0, fontSize: 13, color: "#0f172a", lineHeight: 1.5 }}>{n.message}</p>
                            <p style={{ margin: "4px 0 0", fontSize: 11, color: "#94a3b8" }}>{n.time}</p>
                        </div>
                        {!n.read && <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#2563eb", flexShrink: 0, marginTop: 4 }} />}
                    </div>
                )
            })}
        </div>
    )
}
