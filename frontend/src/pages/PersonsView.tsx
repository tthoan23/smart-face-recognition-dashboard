import { useState, useEffect } from "react";
import { Person } from "../types";
import { Icon } from "../components/Icons";
import { Modal, ImageUpload, Pagination } from "../components/UI";
//import { MOCK_PERSONS } from "../utils/mockData";


type PersonModal = { type: "none" } | { type: "add" } | { type: "edit"; person: Person } | { type: "delete"; person: Person } | { type: "view"; person: Person }


export default function PersonsView() {
    const [persons, setPersons] = useState<Person[]>([]);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [modal, setModal] = useState<PersonModal>({ type: "none" });
    const [formName, setFormName] = useState("");
    const [formImage, setFormImage] = useState("");
    const API_URL = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");

    useEffect(() => {
        fetch(`${API_URL}/api/persons`)
            .then(res => res.json())
            .then(data => setPersons(data))
            .catch(err => console.error("Lỗi lấy danh sách người quen", err));
    }, []);
    const PER = 5
    const filtered = persons.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.personId.toLowerCase().includes(search.toLowerCase()))
    const total = Math.ceil(filtered.length / PER)
    const paged = filtered.slice((page - 1) * PER, page * PER)

    const openAdd = () => { setFormName(""); setFormImage(""); setModal({ type: "add" }) }
    const openEdit = (p: Person) => { setFormName(p.name); setFormImage(p.image); setModal({ type: "edit", person: p }) }
    const close = () => setModal({ type: "none" })

    const handleAdd = async () => {
        const name = formName.trim(); if (!name) { alert("Vui lòng nhập tên người quen!"); return; }

        try {
            const response = await fetch(`${API_URL}/api/persons`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name
                })
            });
            const newPerson = await response.json();
        {/*setPersons([...persons, newPerson]); // Cập nhật lại UI*/}
            if (!response.ok) 
                { throw new Error( newPerson.error || "Không thể gửi yêu cầu đăng ký khuôn mặt" ); } 
            console.log( "Đã gửi yêu cầu đăng ký khuôn mặt:", newPerson ); 
            alert( `Đã gửi yêu cầu đăng ký khuôn mặt cho "${name}".\n\nVui lòng nhìn vào camera để ESP32 quét khuôn mặt.` );
            close();
        } catch (err) {
            console.error("Lỗi thêm người quen: ", err);
        }
    }
    const handleEdit = async () => {
        if (modal.type !== "edit" || !formName.trim()) return;

        try {
            const targetPerson = modal.person;
            // Lấy ID định danh của người cần sửa (ví dụ: "P1", "P2")
            const personIdToUpdate = targetPerson.personId || targetPerson.id;

            const response = await fetch(`${API_URL}/api/persons/${personIdToUpdate}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formName.trim()
                }),
            });

            if (!response.ok) throw new Error("Cập nhật thất bại!");

            // Cập nhật lại State trên UI ngay lập tức
            setPersons((prev) =>
                (Array.isArray(prev) ? prev : []).map((p) =>
                    (p.personId === personIdToUpdate || p.id === personIdToUpdate)
                        ? { ...p, name: formName.trim(), image: formImage || p.image }
                        : p
                )
            );

            close(); // Đóng Modal
        } catch (err) {
            console.error("Lỗi khi sửa người quen:", err);
            alert("Không thể cập nhật thông tin người quen!");
        }
    };

    // 2. Hàm Xử lý Xóa Người quen (DELETE)
    const handleDelete = async () => {
        if (modal.type !== "delete") return;

        try {
            const targetPerson = modal.person;
            const personIdToDelete = targetPerson.personId || targetPerson.id;

            const response = await fetch(`${API_URL}/api/persons/${personIdToDelete}`, {
                method: "DELETE",
            });

            if (!response.ok) throw new Error("Xóa thất bại!");

            // Cập nhật lại State loại bỏ người vừa xóa khỏi UI
            setPersons((prev) =>
                (Array.isArray(prev) ? prev : []).filter(
                    (p) => (p.personId || p.id) !== personIdToDelete
                )
            );

            close(); // Đóng Modal
        } catch (err) {
            console.error("Lỗi khi xóa người quen:", err);
            alert("Không thể xóa người này!");
        }
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <div style={{ position: "relative", flex: 1 }}>
                    <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }}><Icon name="search" size={15} /></span>
                    <input value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} placeholder="Tìm kiếm theo tên hoặc ID..."
                        style={{ width: "100%", padding: "9px 12px 9px 36px", borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 13.5, color: "#0f172a", background: "#fff", outline: "none" }} />
                </div>
                <button onClick={openAdd} style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 16px", borderRadius: 8, background: "#2563eb", color: "#fff", border: "none", fontSize: 13.5, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}>
                    <Icon name="plus" size={15} />Thêm người quen
                </button>
            </div>
            <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead><tr style={{ background: "#f8fafc" }}>
                        {["Person ID", "Ảnh", "Họ tên", "Thao tác"].map(h => (
                            <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid #e2e8f0" }}>{h}</th>
                        ))}
                    </tr></thead>
                    <tbody>
                        {paged.map((person, i) => (
                            <tr key={person.id} style={{ borderBottom: i < paged.length - 1 ? "1px solid #f1f5f9" : "none" }}
                                onMouseEnter={e => { (e.currentTarget as HTMLTableRowElement).style.background = "#f8fafc" }}
                                onMouseLeave={e => { (e.currentTarget as HTMLTableRowElement).style.background = "" }}>
                                <td style={{ padding: "14px 16px", fontSize: 13, fontFamily: "monospace", fontWeight: 600, color: "#2563eb" }}>{person.personId}</td>
                                <td style={{ padding: "14px 16px" }}><img src={person.image} alt={person.name} style={{ width: 48, height: 48, borderRadius: 10, objectFit: "cover", background: "#e2e8f0", border: "1px solid #e2e8f0" }} /></td>
                                <td style={{ padding: "14px 16px", fontSize: 14, fontWeight: 500, color: "#0f172a" }}>{person.name}</td>
                                <td style={{ padding: "14px 16px" }}>
                                    <div style={{ display: "flex", gap: 6 }}>
                                        {[
                                            { icon: "eye", action: () => setModal({ type: "view", person }), color: "#64748b" },
                                            { icon: "edit", action: () => openEdit(person), color: "#2563eb" },
                                            { icon: "trash", action: () => setModal({ type: "delete", person }), color: "#dc2626" },
                                        ].map(btn => (
                                            <button key={btn.icon} onClick={btn.action}
                                                style={{ width: 32, height: 32, borderRadius: 6, border: "1px solid #e2e8f0", background: "#fff", cursor: "pointer", color: btn.color, display: "flex", alignItems: "center", justifyContent: "center", transition: "all .1s" }}>
                                                <Icon name={btn.icon} size={14} />
                                            </button>
                                        ))}
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {paged.length === 0 && <tr><td colSpan={4} style={{ padding: 40, textAlign: "center", color: "#94a3b8" }}>Không tìm thấy</td></tr>}
                    </tbody>
                </table>
            </div>
            <Pagination page={page} total={total} count={filtered.length} perPage={PER} label="người" onPage={setPage} />

            {modal.type === "add" && (
                <Modal title="Thêm người quen mới" onClose={close}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        <div><label style={{ fontSize: 13, fontWeight: 500, color: "#374151", display: "block", marginBottom: 6 }}>Họ và tên *</label>
                            <input value={formName} onChange={e => setFormName(e.target.value)} placeholder="Nhập họ và tên"
                                style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 14, outline: "none", background: "#f8fafc" }} /></div>
                        {/*<div><label style={{ fontSize: 13, fontWeight: 500, color: "#374151", display: "block", marginBottom: 6 }}>Ảnh chân dung</label>
                            <ImageUpload preview={formImage} onChange={setFormImage} /></div>*/}
                        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", paddingTop: 8 }}>
                            <button onClick={close} style={{ padding: "9px 20px", borderRadius: 8, border: "1px solid #e2e8f0", background: "#fff", fontSize: 13.5, fontWeight: 500, cursor: "pointer", color: "#64748b" }}>Hủy</button>
                            <button onClick={handleAdd} style={{ padding: "9px 20px", borderRadius: 8, border: "none", background: "#2563eb", color: "#fff", fontSize: 13.5, fontWeight: 600, cursor: "pointer" }}>Lưu</button>
                        </div>
                    </div>
                </Modal>
            )}
            {modal.type === "edit" && (
                <Modal title="Chỉnh sửa thông tin" onClose={close}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        <div><label style={{ fontSize: 13, fontWeight: 500, color: "#374151", display: "block", marginBottom: 6 }}>Họ và tên *</label>
                            <input value={formName} onChange={e => setFormName(e.target.value)} placeholder="Nhập họ và tên"
                                style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 14, outline: "none", background: "#f8fafc" }} /></div>
                        {/*<div><label style={{ fontSize: 13, fontWeight: 500, color: "#374151", display: "block", marginBottom: 6 }}>Thay ảnh</label>
                            <ImageUpload preview={formImage} onChange={setFormImage} /></div>*/}
                        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", paddingTop: 8 }}>
                            <button onClick={close} style={{ padding: "9px 20px", borderRadius: 8, border: "1px solid #e2e8f0", background: "#fff", fontSize: 13.5, fontWeight: 500, cursor: "pointer", color: "#64748b" }}>Hủy</button>
                            <button onClick={handleEdit} style={{ padding: "9px 20px", borderRadius: 8, border: "none", background: "#2563eb", color: "#fff", fontSize: 13.5, fontWeight: 600, cursor: "pointer" }}>Lưu thay đổi</button>
                        </div>
                    </div>
                </Modal>
            )}
            {modal.type === "delete" && (
                <Modal title="Xác nhận xóa" onClose={close}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                        <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                            <span style={{ width: 44, height: 44, borderRadius: 10, background: "#fef2f2", color: "#dc2626", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                <Icon name="trash" size={20} />
                            </span>
                            <div>
                                <p style={{ margin: 0, fontSize: 14, fontWeight: 500, color: "#0f172a" }}>Bạn có chắc muốn xóa người này?</p>
                                <p style={{ margin: "6px 0 0", fontSize: 13, color: "#64748b", lineHeight: 1.5 }}>
                                    <strong>{modal.person.name}</strong> ({modal.person.personId}) sẽ bị xóa vĩnh viễn. Hành động này không thể hoàn tác.
                                </p>
                            </div>
                        </div>
                        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                            <button onClick={close} style={{ padding: "9px 20px", borderRadius: 8, border: "1px solid #e2e8f0", background: "#fff", fontSize: 13.5, fontWeight: 500, cursor: "pointer", color: "#64748b" }}>Hủy</button>
                            <button onClick={handleDelete} style={{ padding: "9px 20px", borderRadius: 8, border: "none", background: "#dc2626", color: "#fff", fontSize: 13.5, fontWeight: 600, cursor: "pointer" }}>Xóa</button>
                        </div>
                    </div>
                </Modal>
            )}
            {modal.type === "view" && (
                <Modal title="Thông tin chi tiết" onClose={close}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 20, alignItems: "center" }}>
                        <img src={modal.person.image} alt={modal.person.name} style={{ width: 120, height: 120, borderRadius: 16, objectFit: "cover", border: "3px solid #e2e8f0" }} />
                        <div style={{ textAlign: "center" }}>
                            <p style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#0f172a" }}>{modal.person.name}</p>
                            <p style={{ margin: "6px 0 0", fontSize: 13, color: "#94a3b8", fontFamily: "monospace" }}>{modal.person.personId}</p>
                        </div>
                        <div style={{ width: "100%", background: "#f8fafc", borderRadius: 10, padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
                            {[["Họ và tên", modal.person.name], ["Person ID", modal.person.personId], ["Trạng thái", "Đang hoạt động"]].map(([k, v]) => (
                                <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                                    <span style={{ color: "#64748b" }}>{k}</span><span style={{ color: "#0f172a", fontWeight: 500 }}>{v}</span>
                                </div>
                            ))}
                        </div>
                        <button onClick={close} style={{ width: "100%", padding: "10px", borderRadius: 8, border: "1px solid #e2e8f0", background: "#fff", fontSize: 13.5, fontWeight: 500, cursor: "pointer", color: "#64748b" }}>Đóng</button>
                    </div>
                </Modal>
            )}
        </div>
    );
}
