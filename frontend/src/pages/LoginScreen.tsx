import { useState } from "react";
import { Icon } from "../components/Icons";

// Bắt buộc phải có "export default" ở đây để App.tsx có thể import được
export default function LoginScreen({ onLogin }: { onLogin: () => void }) {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [remember, setRemember] = useState(false)
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        if (!username || !password) { setError("Vui lòng nhập đầy đủ thông tin."); return }
        if (username !== "admin" || password !== "admin123") { setError("Tên đăng nhập hoặc mật khẩu không đúng."); return }
        setLoading(true)
        setTimeout(() => { setLoading(false); onLogin() }, 800)
    }

    const inputStyle = (focused: boolean): React.CSSProperties => ({
        width: "100%", padding: "10px 12px", borderRadius: 8,
        border: `1px solid ${focused ? "#2563eb" : "#e2e8f0"}`,
        boxShadow: focused ? "0 0 0 3px rgba(37,99,235,0.1)" : "none",
        fontSize: 14, color: "#0f172a", outline: "none", background: "#f8fafc", transition: "border-color .15s",
    })
    const [focusU, setFocusU] = useState(false)
    const [focusP, setFocusP] = useState(false)

    return (
        <div style= {{ minHeight: "100vh", background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 50%, #e0e7ff 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }
}>
    <div style={ { width: "100%", maxWidth: 400 } }>
        <div style={ { textAlign: "center", marginBottom: 32 } }>
            <div style={ { width: 56, height: 56, borderRadius: 14, background: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", boxShadow: "0 8px 24px rgba(37,99,235,0.3)" } }>
                <span style={ { color: "#fff" } }> <Icon name="face" size = { 28} /> </span>
                    </div>
                    < h1 style = {{ margin: 0, fontSize: 22, fontWeight: 700, color: "#0f172a" }}> FaceGuard </h1>
                        < p style = {{ margin: "6px 0 0", fontSize: 14, color: "#64748b" }}> Smart Face Recognition Dashboard </p>
                            </div>
                            < div style = {{ background: "#fff", borderRadius: 16, padding: 32, boxShadow: "0 4px 24px rgba(0,0,0,0.08)", border: "1px solid #e2e8f0" }}>
                                <h2 style={ { margin: "0 0 24px", fontSize: 18, fontWeight: 600, color: "#0f172a" } }> Đăng nhập </h2>
                                    < form onSubmit = { handleSubmit } style = {{ display: "flex", flexDirection: "column", gap: 16 }}>
                                        <div>
                                        <label style={ { fontSize: 13, fontWeight: 500, color: "#374151", display: "block", marginBottom: 6 } }> Tên đăng nhập </label>
                                            < input type = "text" value = { username } onChange = { e => setUsername(e.target.value) } placeholder = "admin" style = { inputStyle(focusU) } onFocus = {() => setFocusU(true)} onBlur = {() => setFocusU(false)} />
                                                </div>
                                                < div >
                                                <label style={ { fontSize: 13, fontWeight: 500, color: "#374151", display: "block", marginBottom: 6 } }> Mật khẩu </label>
                                                    < input type = "password" value = { password } onChange = { e => setPassword(e.target.value) } placeholder = "••••••••" style = { inputStyle(focusP) } onFocus = {() => setFocusP(true)} onBlur = {() => setFocusP(false)} />
                                                        </div>
                                                        < div style = {{ display: "flex", alignItems: "center", gap: 8 }}>
                                                            <input type="checkbox" id = "remember" checked = { remember } onChange = { e => setRemember(e.target.checked) } style = {{ width: 16, height: 16, accentColor: "#2563eb", cursor: "pointer" }} />
                                                                < label htmlFor = "remember" style = {{ fontSize: 13, color: "#64748b", cursor: "pointer" }}> Ghi nhớ đăng nhập </label>
                                                                    </div>
{
    error && (
        <div style={ { padding: "10px 14px", borderRadius: 8, background: "#fef2f2", border: "1px solid #fecaca", color: "#b91c1c", fontSize: 13, display: "flex", alignItems: "center", gap: 8 } }>
            <Icon name="alertTriangle" size = { 14} /> { error }
                </div>
            )
}
<button type="submit" disabled = { loading } style = {{ padding: "11px", borderRadius: 8, background: loading ? "#93c5fd" : "#2563eb", color: "#fff", border: "none", fontSize: 14, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer" }}>
    { loading? "Đang đăng nhập...": "Đăng nhập" }
    </button>
    </form>
    < p style = {{ margin: "16px 0 0", fontSize: 12, color: "#94a3b8", textAlign: "center" }}> Dùng: admin / admin123 để thử </p>
        </div>
        </div>
        </div>
  )
}