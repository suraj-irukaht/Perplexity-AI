import crypto from "crypto";

export function generateRandomToken(bytes = 32) {
    return crypto.randomBytes(bytes).toString("hex");
}

export function sha256(data) {
    return crypto.createHash("sha256").update(data).digest("hex");
}