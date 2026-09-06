import { createCipheriv, createDecipheriv, randomBytes, createHash } from "crypto"

// AES-256-GCM Encryption for PDPA sensitive fields
const ALGORITHM = "aes-256-gcm"
const IV_LENGTH = 12

function getMasterKey(): Buffer {
  const secret = process.env.PII_ENCRYPTION_KEY || "mvp-college-default-pii-secret-key-32b"
  return createHash("sha256").update(secret).digest()
}

export function encryptPii(plainText: string): string {
  if (!plainText) return plainText
  const iv = randomBytes(IV_LENGTH)
  const cipher = createCipheriv(ALGORITHM, getMasterKey(), iv)
  let encrypted = cipher.update(plainText, "utf8", "hex")
  encrypted += cipher.final("hex")
  const authTag = cipher.getAuthTag()
  return `${iv.toString("hex")}:${authTag.toString("hex")}:${encrypted}`
}

export function decryptPii(cipherText: string): string {
  if (!cipherText || !cipherText.includes(":")) return cipherText
  try {
    const [ivHex, authTagHex, encrypted] = cipherText.split(":")
    if (!ivHex || !authTagHex || !encrypted) return cipherText
    const iv = Buffer.from(ivHex, "hex")
    const authTag = Buffer.from(authTagHex, "hex")
    const decipher = createDecipheriv(ALGORITHM, getMasterKey(), iv)
    decipher.setAuthTag(authTag)
    let decrypted = decipher.update(encrypted, "hex", "utf8")
    decrypted += decipher.final("utf8")
    return decrypted
  } catch {
    return cipherText
  }
}

export function hashSha256(data: string | Buffer): string {
  return createHash("sha256").update(data).digest("hex")
}

export function maskPii(val: string, type: "nationalId" | "phone" | "email" = "phone"): string {
  if (!val) return val
  if (type === "nationalId" && val.length === 13) {
    return `${val.slice(0, 1)}XXXXXX${val.slice(7, 11)}XX`
  }
  if (type === "phone" && val.length >= 9) {
    return `${val.slice(0, 3)}XXXX${val.slice(7)}`
  }
  if (type === "email" && val.includes("@")) {
    const [local, domain] = val.split("@")
    const maskedLocal = local.length > 2 ? `${local[0]}***${local[local.length - 1]}` : `${local}***`
    return `${maskedLocal}@${domain}`
  }
  return val
}
