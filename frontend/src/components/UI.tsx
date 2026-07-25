import { Icon } from './Icons';
import React from 'react';
import { EventType } from '../types';

export function EventBadge({ type }: { type: EventType }) {
    const map = {
        known: { label: "Known Person", bg: "#dcfce7", text: "#15803d", dot: "#16a34a" },
        unknown: { label: "Unknown Visitor", bg: "#fff7ed", text: "#c2410c", dot: "#ea580c" },
        spoofing: { label: "Spoofing Detected", bg: "#fef2f2", text: "#b91c1c", dot: "#dc2626" },
    }
    const c = map[type]
    return (
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "3px 10px", borderRadius: 20, background: c.bg, color: c.text, fontSize: 12, fontWeight: 500 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: c.dot, flexShrink: 0 }} />
            {c.label}
        </span>
    )
}
export function StatCard({ label, value, icon, color, sub }: { label: string; value: number | string; icon: string; color: string; sub?: string }) {
    const colorMap: Record<string, { bg: string; icon: string }> = {
        blue: { bg: "#eff6ff", icon: "#2563eb" },
        green: { bg: "#f0fdf4", icon: "#16a34a" },
        orange: { bg: "#fff7ed", icon: "#ea580c" },
        red: { bg: "#fef2f2", icon: "#dc2626" },
    }
    const c = colorMap[color]
    return (
        <div style={{ background: "#fff", borderRadius: 12, padding: "20px 24px", border: "1px solid #e2e8f0", display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                    <p style={{ margin: 0, fontSize: 13, color: "#64748b", fontWeight: 500 }}>{label}</p>
                    <p style={{ margin: "8px 0 0", fontSize: 32, fontWeight: 700, color: "#0f172a", lineHeight: 1 }}>{value}</p>
                </div>
                <span style={{ width: 44, height: 44, borderRadius: 10, background: c.bg, display: "flex", alignItems: "center", justifyContent: "center", color: c.icon }}>
                    <Icon name={icon} size={20} />
                </span>
            </div>
            {sub && <p style={{ margin: 0, fontSize: 12, color: "#94a3b8" }}>{sub}</p>}
        </div>
    )
}
export function Modal({ title, onClose, children, maxWidth = 440 }: { title: string; onClose: () => void; children: React.ReactNode; maxWidth?: number }) {
    return (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.45)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
            <div style={{ background: "#fff", borderRadius: 16, width: "100%", maxWidth, boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 24px", borderBottom: "1px solid #e2e8f0" }}>
                    <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: "#0f172a" }}>{title}</h2>
                    <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b", padding: 4, borderRadius: 6, display: "flex" }}>
                        <Icon name="close" size={16} />
                    </button>
                </div>
                <div style={{ padding: "24px" }}>{children}</div>
            </div>
        </div>
    )
}
export function ImageUpload({ preview, onChange }: { preview: string; onChange: (url: string) => void }) {
    return (
        <div style={{ border: "2px dashed #e2e8f0", borderRadius: 10, padding: 24, textAlign: "center", cursor: "pointer", background: "#f8fafc" }}
            onClick={() => onChange("https://images.unsplash.com/photo-1560250097-0b93528c311a?w=160&h=160&fit=crop&auto=format")}
        >
            {preview
                ? <img src={preview} alt="Preview" style={{ width: 96, height: 96, borderRadius: 8, objectFit: "cover", margin: "0 auto 12px", display: "block" }} />
                : <div style={{ color: "#94a3b8", marginBottom: 8, display: "flex", justifyContent: "center" }}><Icon name="upload" size={32} /></div>
            }
            <p style={{ margin: 0, fontSize: 13, color: "#64748b", fontWeight: 500 }}>Nhấn để tải ảnh lên</p>
            <p style={{ margin: "4px 0 0", fontSize: 12, color: "#94a3b8" }}>PNG, JPG tối đa 5MB</p>
        </div>
    )
}
export function Pagination({ page, total, count, perPage, label, onPage }: { page: number; total: number; count: number; perPage: number; label: string; onPage: (p: number) => void }) {
    if (total <= 1) return null
    return (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <p style={{ margin: 0, fontSize: 13, color: "#64748b" }}>Hiển thị {(page - 1) * perPage + 1}–{Math.min(page * perPage, count)} / {count} {label}</p>
            <div style={{ display: "flex", gap: 4 }}>
                <button onClick={() => onPage(Math.max(1, page - 1))} disabled={page === 1}
                    style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid #e2e8f0", background: "#fff", cursor: page === 1 ? "not-allowed" : "pointer", color: page === 1 ? "#cbd5e1" : "#64748b", display: "flex", alignItems: "center" }}>
                    <Icon name="chevronLeft" size={14} />
                </button>
                {Array.from({ length: total }, (_, i) => i + 1).map(p => (
                    <button key={p} onClick={() => onPage(p)}
                        style={{ padding: "6px 12px", borderRadius: 6, border: "1px solid", fontSize: 13, fontWeight: 500, cursor: "pointer", background: page === p ? "#2563eb" : "#fff", color: page === p ? "#fff" : "#64748b", borderColor: page === p ? "#2563eb" : "#e2e8f0" }}>
                        {p}
                    </button>
                ))}
                <button onClick={() => onPage(Math.min(total, page + 1))} disabled={page === total}
                    style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid #e2e8f0", background: "#fff", cursor: page === total ? "not-allowed" : "pointer", color: page === total ? "#cbd5e1" : "#64748b", display: "flex", alignItems: "center" }}>
                    <Icon name="chevronRight" size={14} />
                </button>
            </div>
        </div>
    )
}
export function ToggleSwitch({ on, onChange, disabled }: { on: boolean; onChange: (v: boolean) => void; disabled?: boolean }) {
    return (
        <button
            onClick={() => !disabled && onChange(!on)}
            style={{
                width: 64, height: 34, borderRadius: 17, border: "none", cursor: disabled ? "not-allowed" : "pointer", position: "relative",
                background: on ? "#2563eb" : "#cbd5e1", transition: "background .2s", flexShrink: 0,
                boxShadow: on ? "0 0 0 4px rgba(37,99,235,0.15)" : "none",
            }}
        >
            <span style={{
                position: "absolute", top: 3, left: on ? 33 : 3, width: 28, height: 28, borderRadius: "50%",
                background: "#fff", boxShadow: "0 1px 4px rgba(0,0,0,0.2)", transition: "left .2s",
            }} />
        </button>
    )
}