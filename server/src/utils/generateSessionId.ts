import crypto from "crypto";

export const generateSessionId = () => crypto.randomBytes(32).toString("hex");
export const hashSessionId = (sessionId: string) => {
    return crypto.createHash("sha256").update(sessionId).digest("hex")
};
export const generateAndHashSessionId = () => {
    const newSessionId = generateSessionId();
    const hashedSessionId = hashSessionId(newSessionId);
    return { newSessionId, hashedSessionId };
}
