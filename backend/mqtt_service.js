import mqtt from "mqtt";

const MQTT_BROKER_URL =
process.env.MQTT_BROKER_URL || "mqtt://broker.emqx.io:1883";

const MQTT_COMMAND_TOPIC =
process.env.MQTT_COMMAND_TOPIC || "kenit1301/aiot/commands";

const MQTT_STATUS_TOPIC =
process.env.MQTT_STATUS_TOPIC || "kenit1301/aiot/status";

// ============================================================================
// MQTT Client
// ============================================================================

const mqttClient = mqtt.connect(MQTT_BROKER_URL, {
reconnectPeriod: 5000,
connectTimeout: 30000,
});

// ============================================================================
// 1. MQTT Connection
// ============================================================================

mqttClient.on("connect", () => {
console.log("MQTT connected successfully.");

mqttClient.subscribe(MQTT_STATUS_TOPIC, (err) => {
    if (err) {
        console.error(
            "MQTT subscribe failed:",
            err.message
        );
        return;
    }

    console.log(
        `MQTT subscribed to status topic: ${MQTT_STATUS_TOPIC}`
    );
});


});

// ============================================================================
// 2. MQTT Error
// ============================================================================

mqttClient.on("error", (err) => {
console.error("MQTT connection error:", err.message);
});

// ============================================================================
// 3. MQTT Reconnect
// ============================================================================

mqttClient.on("reconnect", () => {
console.log("MQTT reconnecting...");
});

// ============================================================================
// 4. MQTT Offline
// ============================================================================

mqttClient.on("offline", () => {
console.log("MQTT client is offline.");
});

// ============================================================================
// 5. Nhận Status từ ESP32
// ============================================================================

mqttClient.on("message", (topic, message) => {
if (topic !== MQTT_STATUS_TOPIC) {
return;
}


try {
    const payload = JSON.parse(message.toString());

    console.log("MQTT status received:", payload);

    // TODO:
    // Xử lý các status từ ESP32 ở đây.
    //
    // Ví dụ:
    // enroll_success
    // enroll_failed
    // delete_success
    // delete_failed
    // door_opened
    // door_failed

} catch (err) {
    console.error(
        "Invalid MQTT JSON payload:",
        err.message
    );
}


});

// ============================================================================
// 6. Publish Command tới ESP32
// ============================================================================

export function publishCommand(payload) {
return new Promise((resolve, reject) => {
if (!mqttClient.connected) {
return reject(
new Error("MQTT client is not connected")
);
}


    const message = JSON.stringify(payload);

    mqttClient.publish(
        MQTT_COMMAND_TOPIC,
        message,
        { qos: 0 },
        (err) => {
            if (err) {
                console.error(
                    "MQTT publish failed:",
                    err.message
                );

                return reject(err);
            }

            console.log(
                "MQTT command published:",
                payload
            );

            resolve();
        }
    );
});


}

// ============================================================================
// 7. Các hàm Command cụ thể
// ============================================================================

// Mở cửa
export function publishOpenDoor() {
return publishCommand({
action: "open_door",
});
}

// Xóa khuôn mặt
export function publishDeleteFace(personId) {
return publishCommand({
action: "delete_face",
id: personId,
});
}

// Đăng ký khuôn mặt từ xa
export function publishEnrollFace(personId, name) {
return publishCommand({
action: "enroll_face",
id: personId,
name: name,
});
}
