import fs from "fs/promises"
import path from "path"
import crypto from "crypto"

export interface StoredFileInfo {
  filePath: string
  fileName: string
  fileSize: number
  mimeType: string
  sha256Hash: string
  createdAt: Date
}

export class LocalStorageService {
  private basePath: string

  constructor(basePath?: string) {
    // Default to ./uploads relative to project root or configured path
    this.basePath = path.resolve(
      basePath || process.env.STORAGE_LOCAL_PATH || path.join(process.cwd(), "uploads", "documents")
    )
  }

  /**
   * Ensure directory exists before writing
   */
  private async ensureDir(dirPath: string): Promise<void> {
    await fs.mkdir(dirPath, { recursive: true })
  }

  /**
   * Save a file buffer to local disk under documentId folder
   */
  async saveFile(
    documentId: string,
    fileName: string,
    fileBuffer: Buffer,
    mimeType: string
  ): Promise<StoredFileInfo> {
    const docDir = path.join(this.basePath, documentId)
    await this.ensureDir(docDir)

    // Sanitize filename to prevent path traversal
    const safeFileName = path.basename(fileName)
    const targetFilePath = path.join(docDir, safeFileName)

    // Compute SHA-256 hash
    const sha256Hash = crypto.createHash("sha256").update(fileBuffer).digest("hex")

    await fs.writeFile(targetFilePath, fileBuffer)

    return {
      filePath: targetFilePath,
      fileName: safeFileName,
      fileSize: fileBuffer.length,
      mimeType,
      sha256Hash,
      createdAt: new Date(),
    }
  }

  /**
   * Read file buffer from local disk
   */
  async readFile(filePath: string): Promise<Buffer> {
    const resolvedPath = path.resolve(filePath)
    return await fs.readFile(resolvedPath)
  }

  /**
   * Check if file exists
   */
  async exists(filePath: string): Promise<boolean> {
    try {
      await fs.access(path.resolve(filePath))
      return true
    } catch {
      return false
    }
  }

  /**
   * Delete file from local disk
   */
  async deleteFile(filePath: string): Promise<boolean> {
    try {
      await fs.unlink(path.resolve(filePath))
      return true
    } catch {
      return false
    }
  }

  /**
   * Get storage statistics
   */
  async getStats(): Promise<{ totalFiles: number; totalSizeBytes: number; storagePath: string }> {
    let totalFiles = 0
    let totalSizeBytes = 0

    const scanDir = async (dir: string) => {
      try {
        const entries = await fs.readdir(dir, { withFileTypes: true })
        for (const entry of entries) {
          const fullPath = path.join(dir, entry.name)
          if (entry.isDirectory()) {
            await scanDir(fullPath)
          } else if (entry.isFile()) {
            totalFiles++
            const stat = await fs.stat(fullPath)
            totalSizeBytes += stat.size
          }
        }
      } catch {
        // Directory may not exist yet
      }
    }

    await scanDir(this.basePath)

    return {
      totalFiles,
      totalSizeBytes,
      storagePath: this.basePath,
    }
  }
}

export const localStorageService = new LocalStorageService()
