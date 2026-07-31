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
let mqttClient;
let dbPool;


export function initMQTT(pool) {
    dbPool = pool;

    mqttClient = mqtt.connect(MQTT_BROKER_URL, {
        reconnectPeriod: 5000,
        connectTimeout: 30000,
    });

    mqttClient.on("connect", () => {
        console.log("MQTT connected successfully.");

        mqttClient.subscribe(
            MQTT_STATUS_TOPIC,
            (err) => {
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
            }
        );
    });

    mqttClient.on("error", (err) => {
        console.error(
            "MQTT connection error:",
            err.message
        );
    });

    mqttClient.on("reconnect", () => {
        console.log("MQTT reconnecting...");
    });

    mqttClient.on("offline", () => {
        console.log("MQTT client is offline.");
    });

    mqttClient.on(
        "message",
        handleMQTTMessage
    );
}

async function handleMQTTMessage(topic, message) {
    if (topic !== MQTT_STATUS_TOPIC) {
        return;
    }

    try {
        const payload = JSON.parse(
            message.toString()
        );

        console.log(
            "MQTT status received:",
            payload
        );

        if (
            payload.status ===
            "enroll_success"
        ) {
            await handleEnrollSuccess(
                payload
            );
        }

        if (
            payload.status ===
            "enroll_failed"
        ) {
            console.error(
                "ESP32 enroll failed:",
                payload
            );
        }

        if (
            payload.status ===
            "delete_success"
        ) {
            console.log(
                "ESP32 delete success:",
                payload.id
            );
        }

        if (
            payload.status ===
            "delete_failed"
        ) {
            console.error(
                "ESP32 delete failed:",
                payload
            );
        }

    } catch (err) {
        console.error(
            "Invalid MQTT JSON payload:",
            err.message
        );
    }
}

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

async function handleEnrollSuccess(payload, pool) {
    const { status, name, id, image_url } = payload;

    if (status !== "enroll_success") {
        return;
    }

    if (!name || !id) {
        console.error(
            "Invalid enroll_success payload: missing name or id"
        );
        return;
    }

    try {
        // Kiểm tra ID đã tồn tại chưa
        const existing = await pool.query(
            'SELECT ID FROM NguoiQuen WHERE ID = $1',
            [id]
        );

        if (existing.rows.length > 0) {
            console.warn(
                `Person ${id} already exists in database.`
            );
            return;
        }

        // Thêm người quen mới vào database
        const result = await pool.query(
            `INSERT INTO NguoiQuen
                (ID, Name, FaceVector, ImagePath)
             VALUES
                ($1, $2, $3, $4)
             RETURNING
                ID AS "personId",
                Name AS name,
                ImagePath AS image`,
            [
                id,
                name,
                null,
                image_url || null
            ]
        );

        console.log(
            "Enroll success saved to database:",
            result.rows[0]
        );

    } catch (err) {
        console.error(
            "Failed to save enroll_success to database:",
            err.message
        );
    }
}

mqttClient.on("message", async (topic, message) => {
if (topic !== MQTT_STATUS_TOPIC) {
return;
}


try {
    const payload = JSON.parse(message.toString());

    console.log("MQTT status received:", payload);

    // TODO:
    // Xử lý các status từ ESP32 ở đây.
    //
    // ================================================================
        // ESP32 báo đăng ký khuôn mặt thành công
        // ================================================================

        if (payload.status === "enroll_success") {
            await handleEnrollSuccess(payload, mqttClient.pool);
        }

        // ================================================================
        // Các status khác có thể xử lý sau
        // ================================================================

        if (payload.status === "enroll_failed") {
            console.error(
                "ESP32 enroll failed:",
                payload
            );
        }

        if (payload.status === "delete_success") {
            console.log(
                `ESP32 deleted face successfully: ${payload.id}`
            );
        }

        if (payload.status === "delete_failed") {
            console.error(
                "ESP32 delete face failed:",
                payload
            );
        }

        if (payload.status === "door_opened") {
            console.log(
                "ESP32 confirmed door opened."
            );
        }

        if (payload.status === "door_failed") {
            console.error(
                "ESP32 failed to open door:",
                payload
            );
        }

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
        name: name,
});
}
