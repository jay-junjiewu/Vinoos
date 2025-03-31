import express from "express"
import { supabaseClient } from "../config/config"

const router = express.Router()

// Get all equipment
router.get("/", async (req, res, next) => {
  try {
    const { data, error } = await supabaseClient.from("equipment").select("*").order("created_at", { ascending: true })

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

// Create a new equipment item
router.post("/", async (req, res, next) => {
  try {
    const { name, description, category, images } = req.body

    if (!name || !description || !category) {
      const validationError = new Error("Missing required fields") as any
      validationError.status = 400
      throw validationError
    }

    // Insert the equipment with created_at
    const { data: equipmentData, error: equipmentError } = await supabaseClient
      .from("equipment")
      .insert([
        {
          name,
          description,
          category,
          created_at: new Date().toISOString()
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

// Update an equipment item
router.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params
    const { name, description, category, images } = req.body

    const { data, error } = await supabaseClient
      .from("equipment")
      .update({
        name,
        description,
        category,
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

// Delete an equipment item
router.delete("/:id", async (req, res, next) => {
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

