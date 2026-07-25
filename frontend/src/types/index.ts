export type View = "dashboard" | "logs" | "persons" | "camera" | "access";
export type EventType = "known" | "unknown" | "spoofing";
export type NotifType = EventType | "lock";

export interface LogEntry { id: number; timestamp: string; eventType: EventType; personId: string; personName: string; image: string; }
export interface Person { id: number; personId: string; name: string; image: string; }
export interface Notification { id: number; type: NotifType; message: string; time: string; read: boolean; }
export interface RecordedClip { id: number; cameraId: number; thumbnail: string; timestamp: string; duration: string; }
export interface DoorLock { id: number; name: string; location: string; locked: boolean; lastAction: string; lastBy: string; }
export interface LockHistoryEntry { id: number; lockId: number; lockName: string; timestamp: string; action: "locked" | "unlocked"; performedBy: string; }