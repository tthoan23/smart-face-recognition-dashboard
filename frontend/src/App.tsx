import { useState, useEffect } from "react";
import { View, Notification, LogEntry } from "./types";
import { INIT_NOTIFICATIONS } from "./utils/mockData";

import { Sidebar, Header, NotificationPanel } from "./layout/Layout";
import LoginScreen from "./pages/LoginScreen";
import DashboardView from "./pages/DashboardView";
import LogsView from "./pages/LogsView";
import PersonsView from "./pages/PersonsView";
import CameraView from "./pages/CameraView";
import AccessControlView from "./pages/AccessControlView";

const viewTitles: Record<View, string> = {
  dashboard: "Dashboard",
  logs: "Nhật ký ra vào",
  persons: "Danh sách người quen",
  camera: "Camera Livestream",
  access: "Điều khiển khoá cửa",
};

const API_URL = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [view, setView] = useState<View>("dashboard");
  const [notifications, setNotifications] = useState<Notification[]>(INIT_NOTIFICATIONS);
  const [showNotif, setShowNotif] = useState(false);

  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [personsCount, setPersonsCount] = useState<number>(0);

  useEffect(() => {
    if (!loggedIn) return;

    if (!API_URL) {
      console.error("Missing VITE_API_URL");
      return;
    }

    const loadData = async () => {
      try {
        const [eventsRes, personsRes] = await Promise.all([
          fetch(`${API_URL}/api/events`),
          fetch(`${API_URL}/api/persons`),
        ]);

        const eventsData = await eventsRes.json();
        const personsData = await personsRes.json();

        if (Array.isArray(eventsData)) setLogs(eventsData);
        if (Array.isArray(personsData)) setPersonsCount(personsData.length);
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      }
    };

    void loadData();
  }, [loggedIn, view]);

  const handleDeleteLog = async (logId: number) => {
    if (!window.confirm("Bạn có chắc muốn xóa bản ghi nhật ký này?")) return;
    if (!API_URL) return;

    try {
      const res = await fetch(`${API_URL}/api/events/${logId}`, { method: "DELETE" });
      if (res.ok) {
        setLogs(prev => prev.filter(l => l.id !== logId));
      }
    } catch (err) {
      console.error("Lỗi xóa log:", err);
    }
  };

  const markRead = (id: number) =>
    setNotifications(ns => ns.map(n => (n.id === id ? { ...n, read: true } : n)));

  const handleLockChange = (lockName: string, action: "locked" | "unlocked") => {
    const newNotif: Notification = {
      id: Date.now(),
      type: "lock",
      message: `${lockName} đã được ${action === "locked" ? "KHOÁ" : "MỞ"} bởi Admin User`,
      time: "Vừa xong",
      read: false,
    };
    setNotifications(ns => [newNotif, ...ns]);
  };

  if (!loggedIn) return <LoginScreen onLogin={() => setLoggedIn(true)} />;

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar
        view={view}
        onView={(v: View) => {
          setView(v);
          setShowNotif(false);
        }}
        onLogout={() => setLoggedIn(false)}
      />

      <div style={{ marginLeft: 240, flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <Header
          title={viewTitles[view]}
          notifications={notifications}
          onToggleNotif={() => setShowNotif(s => !s)}
        />

        <main style={{ flex: 1, padding: 24, background: "#f1f5f9" }}>
          {view === "dashboard" && <DashboardView logs={logs} personsCount={personsCount} />}
          {view === "logs" && <LogsView logs={logs} onDeleteLog={handleDeleteLog} />}
          {view === "persons" && <PersonsView />}
          {view === "camera" && <CameraView />}
          {view === "access" && <AccessControlView onLockChange={handleLockChange} />}
        </main>
      </div>

      /*{showNotif && (
        <NotificationPanel
          notifications={notifications}
          onClose={() => setShowNotif(false)}
          onMarkRead={markRead}
        />
      )}*/
    </div>
  );
}
