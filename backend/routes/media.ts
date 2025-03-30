import express from "express"
import multer from "multer"
import { supabaseClient } from "../config/config" // Importing Supabase client from config.ts
import { authMiddleware } from "../middleware/auth"
import { randomUUID } from "crypto"

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
})

const router = express.Router()

// Upload a media file to Supabase Storage (protected)
router.post("/upload", authMiddleware, upload.single("file"), async (req, res, next) => {
  try {
    if (!req.file) {
      const error = new Error("No file uploaded") as any
      error.status = 400
      throw error
    }

    const file = req.file
    const fileExt = file.originalname.split(".").pop()
    const fileName = `${randomUUID()}.${fileExt}`
    const filePath = `uploads/${fileName}`

    // Upload to Supabase Storage
    const { data, error } = await supabaseClient.storage.from("media").upload(filePath, file.buffer, {
      contentType: file.mimetype,
      cacheControl: "3600",
    })

    if (error) throw error

    // Get the public URL
    const { data: urlData } = supabaseClient.storage.from("media").getPublicUrl(filePath)

    res.status(200).json({
      message: "File uploaded successfully",
      data: {
        path: data.path,
        url: urlData.publicUrl,
        type: file.mimetype,
        size: file.size,
      },
    })
  } catch (error) {
    next(error)
  }
})

// Get all media files (protected)
router.get("/", authMiddleware, async (req, res, next) => {
  try {
    const { data, error } = await supabaseClient.storage.from("media").list("uploads", {
      sortBy: { column: "created_at", order: "desc" },
    })

    if (error) throw error
    // Generate public URLs for each file
    const filesWithUrls = data.map((file: { name: string }) => {
      const { data: urlData } = supabaseClient.storage.from("media").getPublicUrl(`uploads/${file.name}`)

      return {
        ...file,
        url: urlData.publicUrl,
      }
    })

    res.status(200).json({ data: filesWithUrls })
  } catch (error) {
    next(error)
  }
})

// Delete a media file (protected)
router.delete("/:fileName", authMiddleware, async (req, res, next) => {
  try {
    const { fileName } = req.params
    const filePath = `uploads/${fileName}`

    const { error } = await supabaseClient.storage.from("media").remove([filePath])

    if (error) throw error

    res.status(200).json({
      message: "File deleted successfully",
    })
  } catch (error) {
    next(error)
  }
})

export default router

