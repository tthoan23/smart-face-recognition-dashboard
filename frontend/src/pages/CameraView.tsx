import { useState, useEffect, useRef } from "react";
import { RecordedClip } from "../types";
import { MOCK_CLIPS, CAMERAS } from "../utils/mockData";
import { Icon } from "../components/Icons";

const SINGLE_CAM = CAMERAS[0]

export default function CameraView() {
    const [playing, setPlaying] = useState(true)
    const [recording, setRecording] = useState(false)
    const [recordSecs, setRecordSecs] = useState(0)
    const [snapshot, setSnapshot] = useState(false)
    const [clips, setClips] = useState<RecordedClip[]>(MOCK_CLIPS.filter(c => c.cameraId === 1))
    const [blink, setBlink] = useState(true)
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
    const blinkRef = useRef<ReturnType<typeof setInterval> | null>(null)

    useEffect(() => {
        if (recording) {
            intervalRef.current = setInterval(() => setRecordSecs(s => s + 1), 1000)
            blinkRef.current = setInterval(() => setBlink(b => !b), 600)
        } else {
            if (intervalRef.current) clearInterval(intervalRef.current)
            if (blinkRef.current) clearInterval(blinkRef.current)
            setRecordSecs(0)
            setBlink(true)
        }
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current)
            if (blinkRef.current) clearInterval(blinkRef.current)
        }
    }, [recording])

    const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`

    const handleRecord = () => {
        if (recording) {
            setClips(prev => [{
                id: Date.now(), cameraId: 1,
                thumbnail: SINGLE_CAM.feed,
                timestamp: new Date().toLocaleString("sv").replace("T", " "),
                duration: fmt(recordSecs),
            }, ...prev])
        }
        setRecording(r => !r)
    }

    const handleSnapshot = () => {
        setSnapshot(true)
        setTimeout(() => setSnapshot(false), 2000)
    }

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Video frame */}
            <div style={{ position: "relative", borderRadius: 14, overflow: "hidden", background: "#000", border: "1px solid #1e293b", boxShadow: "0 4px 24px rgba(0,0,0,0.12)" }}>
                <img
                    src={SINGLE_CAM.feed}
                    alt="Camera feed"
                    style={{ width: "100%", aspectRatio: "16/9", objectFit: "cover", display: "block", opacity: playing ? 1 : 0.3, filter: playing ? "none" : "grayscale(0.6)", transition: "opacity .3s, filter .3s" }}
                />

                {/* Top-left: Online/Offline + LIVE badge */}
                <div style={{ position: "absolute", top: 14, left: 14, display: "flex", gap: 8, alignItems: "center" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 12px", borderRadius: 20, background: playing ? "rgba(22,163,74,0.9)" : "rgba(220,38,38,0.9)", color: "#fff", fontSize: 12, fontWeight: 700, backdropFilter: "blur(4px)" }}>
                        <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#fff", opacity: playing && blink ? 1 : 0.4, transition: "opacity .15s" }} />
                        {playing ? "ONLINE" : "OFFLINE"}
                    </span>
                    {playing && (
                        <span style={{ padding: "5px 10px", borderRadius: 20, background: "rgba(0,0,0,0.55)", color: "#e2e8f0", fontSize: 11, fontWeight: 600, backdropFilter: "blur(4px)" }}>
                            LIVE
                        </span>
                    )}
                </div>

                {/* Top-right: REC indicator */}
                {recording && (
                    <div style={{ position: "absolute", top: 14, right: 14, display: "flex", alignItems: "center", gap: 7, padding: "5px 12px", borderRadius: 20, background: "rgba(0,0,0,0.7)", color: "#fff", fontSize: 13, fontWeight: 700, backdropFilter: "blur(4px)" }}>
                        <span style={{ width: 9, height: 9, borderRadius: "50%", background: "#ef4444", opacity: blink ? 1 : 0, transition: "opacity .1s", flexShrink: 0 }} />
                        REC &nbsp;{fmt(recordSecs)}
                    </div>
                )}

                {/* Paused overlay */}
                {!playing && (
                    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ width: 72, height: 72, borderRadius: "50%", background: "rgba(0,0,0,0.55)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", backdropFilter: "blur(4px)" }}>
                            <Icon name="pause" size={30} />
                        </span>
                    </div>
                )}

                {/* Snapshot flash */}
                {snapshot && (
                    <div style={{ position: "absolute", inset: 0, background: "rgba(255,255,255,0.35)", display: "flex", alignItems: "center", justifyContent: "center", animation: "none" }}>
                        <div style={{ background: "rgba(0,0,0,0.7)", borderRadius: 12, padding: "13px 22px", color: "#fff", fontSize: 14, fontWeight: 600, display: "flex", alignItems: "center", gap: 9, backdropFilter: "blur(6px)" }}>
                            <Icon name="snapshot" size={17} />Ảnh đã chụp
                        </div>
                    </div>
                )}

                {/* Bottom gradient info bar */}
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)", padding: "36px 18px 14px" }}>
                    <p style={{ margin: 0, fontSize: 14, color: "#f1f5f9", fontWeight: 600 }}>{SINGLE_CAM.name}</p>
                    <p style={{ margin: "3px 0 0", fontSize: 12, color: "#94a3b8", fontFamily: "monospace" }}>{SINGLE_CAM.location} · 2026-07-22 {new Date().toLocaleTimeString("vi-VN")}</p>
                </div>
            </div>

            {/* Controls toolbar */}
            <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", padding: "14px 20px", display: "flex", alignItems: "center", gap: 10 }}>
                {/* Play/Pause */}
                <button onClick={() => setPlaying(p => !p)}
                    style={{
                        display: "flex", alignItems: "center", gap: 8, padding: "9px 20px", borderRadius: 8, border: "1px solid", fontSize: 13.5, fontWeight: 600, cursor: "pointer", transition: "all .15s",
                        background: playing ? "#0f172a" : "#fff", color: playing ? "#fff" : "#0f172a", borderColor: playing ? "#0f172a" : "#e2e8f0"
                    }}>
                    <Icon name={playing ? "pause" : "play"} size={15} />
                    {playing ? "Tạm dừng" : "Phát"}
                </button>

                <div style={{ width: 1, height: 28, background: "#e2e8f0", flexShrink: 0 }} />

                {/* Record */}
                <button onClick={handleRecord}
                    style={{
                        display: "flex", alignItems: "center", gap: 8, padding: "9px 20px", borderRadius: 8, border: "1px solid", fontSize: 13.5, fontWeight: 600, cursor: "pointer", transition: "all .15s",
                        background: recording ? "#fff5f5" : "#fff", color: recording ? "#dc2626" : "#475569", borderColor: recording ? "#fca5a5" : "#e2e8f0"
                    }}>
                    <span style={{ color: recording && blink ? "#dc2626" : recording ? "rgba(220,38,38,0.2)" : "#dc2626", transition: "color .1s" }}>
                        <Icon name="record" size={13} />
                    </span>
                    {recording ? `Dừng quay · ${fmt(recordSecs)}` : "Ghi hình"}
                </button>

                <div style={{ width: 1, height: 28, background: "#e2e8f0", flexShrink: 0 }} />

                {/* Snapshot */}
                <button onClick={handleSnapshot}
                    style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 20px", borderRadius: 8, border: "1px solid #e2e8f0", background: "#fff", color: "#475569", fontSize: 13.5, fontWeight: 600, cursor: "pointer" }}>
                    <Icon name="snapshot" size={15} />Chụp nhanh
                </button>

                <div style={{ flex: 1 }} />

                {/* Camera info chip */}
                <span style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 8, background: "#f8fafc", border: "1px solid #e2e8f0", fontSize: 12.5, color: "#64748b" }}>
                    <Icon name="camera" size={13} />{SINGLE_CAM.name} — {SINGLE_CAM.location}
                </span>
            </div>

            {/* Recorded clips */}
            {/*
            <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0" }}>
                <div style={{ padding: "16px 20px", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                        <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: "#0f172a" }}>Đoạn ghi hình đã lưu</h3>
                        <p style={{ margin: "2px 0 0", fontSize: 12, color: "#94a3b8" }}>{clips.length} đoạn ghi</p>
                    </div>
                </div>
                {clips.length === 0 ? (
                    <div style={{ padding: 48, textAlign: "center", color: "#94a3b8", fontSize: 14 }}>Chưa có đoạn ghi nào</div>
                ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16, padding: 20 }}>
                        {clips.map(clip => (
                            <div key={clip.id} style={{ border: "1px solid #e2e8f0", borderRadius: 10, overflow: "hidden", background: "#f8fafc" }}>
                                <div style={{ position: "relative", background: "#1e293b" }}>
                                    <img src={clip.thumbnail} alt="Clip" style={{ width: "100%", aspectRatio: "16/9", objectFit: "cover", display: "block", opacity: 0.8 }} />
                                    <span style={{ position: "absolute", bottom: 6, right: 8, background: "rgba(0,0,0,0.75)", color: "#fff", fontSize: 11, fontWeight: 700, padding: "2px 7px", borderRadius: 4, fontFamily: "monospace" }}>{clip.duration}</span>
                                </div>
                                <div style={{ padding: "10px 12px" }}>
                                    <p style={{ margin: "0 0 8px", fontSize: 12, color: "#475569", fontFamily: "monospace" }}>{clip.timestamp}</p>
                                    <div style={{ display: "flex", gap: 6 }}>
                                        <button style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 5, padding: "6px 0", borderRadius: 6, border: "1px solid #e2e8f0", background: "#fff", color: "#2563eb", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                                            <Icon name="play" size={11} />Xem lại
                                        </button>
                                        <button style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 5, padding: "6px 0", borderRadius: 6, border: "1px solid #e2e8f0", background: "#fff", color: "#64748b", fontSize: 12, fontWeight: 500, cursor: "pointer" }}>
                                            <Icon name="download" size={11} />Tải xuống
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>*/}
        </div>
    )
}
