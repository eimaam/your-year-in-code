import { config } from "@/config/config";
import crypto from "crypto";

const ALGORITHM = config.encryption.ALGORITHM;
const KEY = config.encryption.KEY;



export class TokenService {
    static encrypt(value: string) {
const iv = crypto.randomBytes(12); // unique iv for each encryption
        const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv) as crypto.CipherGCM;

        let encrypted = cipher.update(value, "utf8", "base64");
        encrypted += cipher.final("base64");

        const tag = cipher.getAuthTag();

        return {
            encrypted,
            iv: iv.toString("base64"),
            tag: tag.toString("base64"),
        };
    }

    static decrypt(encrypted: string, iv: string, tag: string) {
        const decipher = crypto.createDecipheriv(
            ALGORITHM,
            KEY,
            Buffer.from(iv, "base64")
        ) as crypto.DecipherGCM;

        decipher.setAuthTag(Buffer.from(tag, "base64"));

        let decrypted = decipher.update(encrypted, "base64", "utf8");
        decrypted += decipher.final("utf8");

        return decrypted;
    }
}
