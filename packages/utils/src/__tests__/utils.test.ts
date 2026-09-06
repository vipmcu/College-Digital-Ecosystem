import { describe, it } from "node:test"
import assert from "node:assert"
import {
  encryptPii,
  decryptPii,
  maskPii,
  hashSha256,
  toThaiBuddhistYear,
  hasPermission,
  STUDENT_CODE_REGEX,
  COURSE_CODE_REGEX,
} from "../index"

describe("Utils & Cryptography Suite", () => {
  it("should encrypt and decrypt PII data symmetrically", () => {
    const plain = "1103701234567" // National ID
    const encrypted = encryptPii(plain)
    assert.notStrictEqual(encrypted, plain)
    assert.match(encrypted, /^[0-9a-f]+:[0-9a-f]+:[0-9a-f]+$/)

    const decrypted = decryptPii(encrypted)
    assert.strictEqual(decrypted, plain)
  })

  it("should mask National ID correctly", () => {
    const plain = "1103701234567"
    const masked = maskPii(plain, "nationalId")
    assert.strictEqual(masked, "1XXXXXX2345XX")
  })

  it("should mask phone numbers correctly", () => {
    const plain = "0812345678"
    const masked = maskPii(plain, "phone")
    assert.strictEqual(masked, "081XXXX678")
  })

  it("should mask email addresses correctly", () => {
    const email = "somchai.s@college.ac.th"
    const masked = maskPii(email, "email")
    assert.strictEqual(masked, "s***s@college.ac.th")
  })

  it("should generate deterministic SHA-256 hashes", () => {
    const hash1 = hashSha256("test-content")
    const hash2 = hashSha256("test-content")
    assert.strictEqual(hash1, hash2)
    assert.strictEqual(hash1.length, 64)
  })

  it("should compute Thai Buddhist Era year accurately (+543)", () => {
    const d = new Date(2026, 0, 1)
    assert.strictEqual(toThaiBuddhistYear(d), 2569)
  })

  it("should validate student code regex (10 digits)", () => {
    assert.strictEqual(STUDENT_CODE_REGEX.test("6501002341"), true)
    assert.strictEqual(STUDENT_CODE_REGEX.test("650100"), false)
    assert.strictEqual(STUDENT_CODE_REGEX.test("65010023410"), false)
  })

  it("should validate course code regex", () => {
    assert.strictEqual(COURSE_CODE_REGEX.test("CPE-101-001"), true)
    assert.strictEqual(COURSE_CODE_REGEX.test("invalid"), false)
  })
})

describe("RBAC Matrix Verification Suite", () => {
  it("should permit students to read/write their own profiles and documents", () => {
    assert.strictEqual(hasPermission(["student"], "profile", "read"), true)
    assert.strictEqual(hasPermission(["student"], "profile", "write"), true)
    assert.strictEqual(hasPermission(["student"], "documents", "read"), true)
    assert.strictEqual(hasPermission(["student"], "documents", "write"), true)
  })

  it("should deny students from accessing system config or dashboard", () => {
    assert.strictEqual(hasPermission(["student"], "system_config", "read"), false)
    assert.strictEqual(hasPermission(["student"], "dashboard", "read"), false)
    assert.strictEqual(hasPermission(["student"], "audit_logs", "read"), false)
  })

  it("should permit IT admin full access to resources", () => {
    assert.strictEqual(hasPermission(["it_admin"], "system_config", "write"), true)
    assert.strictEqual(hasPermission(["it_admin"], "students", "delete"), true)
    assert.strictEqual(hasPermission(["it_admin"], "audit_logs", "read"), true)
  })

  it("should permit DPO audit access to students and audit logs", () => {
    assert.strictEqual(hasPermission(["dpo"], "students", "audit"), true)
    assert.strictEqual(hasPermission(["dpo"], "audit_logs", "audit"), true)
    assert.strictEqual(hasPermission(["dpo"], "system_config", "write"), false)
  })

  it("should permit instructors to write grades", () => {
    assert.strictEqual(hasPermission(["instructor"], "grades", "write"), true)
  })
})
