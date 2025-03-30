import express from "express"
import { supabaseClient } from "../config/config"
import { authMiddleware } from "../middleware/auth"

const router = express.Router()

// Get all equipment
router.get("/", async (req, res, next) => {
  try {
    const { data, error } = await supabaseClient.from("equipment").select("*").order("created_at", { ascending: false })

    if (error) throw error

    res.status(200).json({ data })
  } catch (error) {
    next(error)
  }
})

// Get a specific equipment item by ID
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params

    const { data, error } = await supabaseClient
      .from("equipment")
      .select(`
        *,
        equipment_images(*)
      `)
      .eq("id", id)
      .single()

    if (error) {
      const notFoundError = new Error("Equipment not found") as any
      notFoundError.status = 404
      throw notFoundError
    }

    res.status(200).json({ data })
  } catch (error) {
    next(error)
  }
})

// Create a new equipment item (protected)
router.post("/", authMiddleware, async (req, res, next) => {
  try {
    const { title, brand, shortDescription, specifications, images } = req.body

    if (!title || !brand || !shortDescription) {
      const validationError = new Error("Missing required fields") as any
      validationError.status = 400
      throw validationError
    }

    // Insert the equipment
    const { data: equipmentData, error: equipmentError } = await supabaseClient
      .from("equipment")
      .insert([
        {
          title,
          brand,
          short_description: shortDescription,
          specifications: specifications || [],
        },
      ])
      .select()
      .single()

    if (equipmentError) throw equipmentError

    // If images are provided, insert them
    if (images && images.length > 0) {
      const equipmentImages = images.map((image: { url: string; alt: string }) => ({
        equipment_id: equipmentData.id,
        image_url: image.url,
        alt_text: image.alt,
      }))

      const { error: imagesError } = await supabaseClient.from("equipment_images").insert(equipmentImages)

      if (imagesError) throw imagesError
    }

    res.status(201).json({
      message: "Equipment created successfully",
      data: equipmentData,
    })
  } catch (error) {
    next(error)
  }
})

// Update an equipment item (protected)
router.put("/:id", authMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params
    const { title, brand, shortDescription, specifications } = req.body

    const { data, error } = await supabaseClient
      .from("equipment")
      .update({
        title,
        brand,
        short_description: shortDescription,
        specifications: specifications || [],
      })
      .eq("id", id)
      .select()
      .single()

    if (error) throw error

    res.status(200).json({
      message: "Equipment updated successfully",
      data,
    })
  } catch (error) {
    next(error)
  }
})

// Delete an equipment item (protected)
router.delete("/:id", authMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params

    // First, delete related images
    const { error: imagesError } = await supabaseClient.from("equipment_images").delete().eq("equipment_id", id)

    if (imagesError) throw imagesError

    // Then delete the equipment
    const { error } = await supabaseClient.from("equipment").delete().eq("id", id)

    if (error) throw error

    res.status(200).json({
      message: "Equipment deleted successfully",
    })
  } catch (error) {
    next(error)
  }
})

export default router

