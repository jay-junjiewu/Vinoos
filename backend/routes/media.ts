import express from "express"
import multer from "multer"
import { supabaseClient } from "../config/config" // Importing Supabase client from config.ts
import { randomUUID } from "crypto"

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
})

const router = express.Router()

// Upload a media file to Supabase Storage
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' })
    }

    const file = req.file
    console.log('Uploading file:', file.originalname, 
      'Size:', file.size,
      'Buffer length:', file.buffer.length
    );

    // Safely get file extension, default to 'bin' if not found
    const fileExt = file.originalname.split('.').pop() || 'bin'; 
    const fileName = `${randomUUID()}.${fileExt}`
    const filePath = `uploads/${fileName}`

    const { error: uploadError } = await supabaseClient.storage
      .from('media')
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        cacheControl: '3600'
      })

    if (uploadError) {
      console.error('Supabase upload error:', uploadError);
      throw new Error(`Error uploading image: ${uploadError.message}`)
    }

    // Get the public URL
    const { data: urlData } = supabaseClient.storage.from('media').getPublicUrl(filePath)

    // Check if urlData or publicUrl is missing
    if (!urlData || !urlData.publicUrl) {
      console.error('Failed to get public URL for:', filePath);
      throw new Error(`Error getting public URL for the uploaded file.`)
    }

    res.status(200).json({
      message: 'Image uploaded successfully',
      fileName,
      filePath,
      publicUrl: urlData.publicUrl,
      fileSize: file.size,
      mimeType: file.mimetype
    })
  } catch (error: unknown) {
    console.error('Error in /upload route:', error);
    if (error instanceof Error) {
      res.status(500).json({ error: error.message })
    } else {
      res.status(500).json({ error: 'An unknown error occurred during upload' })
    }
  }
})

// Get a specific media file by name
router.get("/:fileName", async (req, res, next) => {
  try {
    const { fileName } = req.params
    const filePath = `uploads/${fileName}`

    const { data, error } = await supabaseClient.storage.from("media").download(filePath)

    if (error) {
      console.error(`Error downloading file ${fileName}:`, error);
      // Check if the error is specifically a 'Not found' error
      if (error.message.includes('Object not found')) {
           const notFoundError = new Error("File not found") as any
           notFoundError.status = 404
           return next(notFoundError); // Pass error to Express error handler
      }
      // For other errors, pass them along
      return next(error);
    }

    // Check if data is null or blob size is 0 (might indicate an issue)
    if (!data) {
        const notFoundError = new Error("File data is empty or invalid") as any
        notFoundError.status = 404
        return next(notFoundError);
    }

    // Get the public URL
    const { data: urlData } = supabaseClient.storage.from("media").getPublicUrl(filePath);

    // Check if urlData or publicUrl is missing
    if (!urlData || !urlData.publicUrl) {
      console.error('Failed to get public URL for:', filePath);
      throw new Error(`Error getting public URL for the uploaded file.`);
    }

    // Return the public URL, name, and creation date
    res.status(200).json({
      publicUrl: urlData.publicUrl,
      fileName: fileName,
    });

  } catch (error) {
     console.error('Error in GET /:fileName route:', error);
    next(error) // Pass errors to Express error handler
  }
})

// Get all media files
router.get("/", async (req, res, next) => {
  try {
    const { data, error } = await supabaseClient.storage.from("media").list("uploads", {
      sortBy: { column: "name", order: "asc" },
    })

    if (error) {
        console.error('Error listing media files:', error);
        throw error // Re-throw to be caught by the outer catch block
    }
    
    if (!data) {
        // Handle case where data is null or undefined unexpectedly
        return res.status(200).json({ data: [] });
    }

    // Generate public URLs for each file
    const filesWithUrls = data.map((file: { name: string; id: string; updated_at: string; created_at: string; last_accessed_at: string; metadata: any; }) => {
      const { data: urlData } = supabaseClient.storage.from("media").getPublicUrl(`uploads/${file.name}`)

      return {
        ...file,
        // Ensure urlData exists before accessing publicUrl
        url: urlData ? urlData.publicUrl : null, 
      }
    })

    res.status(200).json({ data: filesWithUrls })
  } catch (error) {
    console.error('Error in GET / route:', error);
    next(error) // Pass errors to Express error handler
  }
})

// Delete a media file
router.delete("/:fileName", async (req, res, next) => {
  try {
    const { fileName } = req.params
    const filePath = `uploads/${fileName}`

    const { error } = await supabaseClient.storage.from("media").remove([filePath])

    if (error) {
        console.error(`Error deleting file ${fileName}:`, error);
        // Check if it's a 'not found' error, maybe respond differently or just pass it
        if (error.message.includes('Object not found')) {
             const notFoundError = new Error("File not found, cannot delete") as any
             notFoundError.status = 404
             return next(notFoundError);
        }
        throw error // Re-throw other errors
    }

    res.status(200).json({
      message: "File deleted successfully",
    })
  } catch (error) {
    console.error('Error in DELETE /:fileName route:', error);
    next(error) // Pass errors to Express error handler
  }
})

export default router

