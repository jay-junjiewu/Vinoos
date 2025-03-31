import express from "express"
import { supabaseClient } from "../config/config" // Adjusted import path for Supabase client

const router = express.Router()

// Get all projects
router.get("/", async (req, res, next) => {
  try {
    const { data, error } = await supabaseClient.from("projects").select("*").order("created_at", { ascending: true })

    if (error) throw error

    res.status(200).json({ data })
  } catch (error) {
    next(error)
  }
})

// Get a specific project by ID
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params

    const { data, error } = await supabaseClient
      .from("projects")
      .select(`
        *,
        project_images(*)
      `)
      .eq("id", id)
      .single()

    if (error) {
      const notFoundError = new Error("Project not found") as any
      notFoundError.status = 404
      throw notFoundError
    }

    res.status(200).json({ data })
  } catch (error) {
    next(error)
  }
})

// Create a new project (protected)
router.post("/", async (req, res, next) => {
  try {
    const { title, description, category, images } = req.body

    if (!title || !description || !category) {
      const validationError = new Error("Missing required fields") as any
      validationError.status = 400
      throw validationError
    }

    // Insert the project with created_at
    const { data: projectData, error: projectError } = await supabaseClient
      .from("projects")
      .insert([{ title, description, category, created_at: new Date().toISOString() }])
      .select()
      .single()

    if (projectError) throw projectError

    // If images are provided, insert them
    if (images && images.length > 0) {
      const projectImages = images.map((image: { url: string; alt: string }) => ({
        project_id: projectData.id,
        image_url: image.url,
        alt_text: image.alt,
      }))

      const { error: imagesError } = await supabaseClient.from("project_images").insert(projectImages)

      if (imagesError) throw imagesError
    }

    res.status(201).json({
      message: "Project created successfully",
      data: projectData,
    })
  } catch (error) {
    next(error)
  }
})

// Update a project (protected)
router.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params
    const { title, description, category } = req.body

    const { data, error } = await supabaseClient
      .from("projects")
      .update({ title, description, category })
      .eq("id", id)
      .select()
      .single()

    if (error) throw error

    res.status(200).json({
      message: "Project updated successfully",
      data,
    })
  } catch (error) {
    next(error)
  }
})

// Delete a project (protected)
router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params

    // First, delete related images
    const { error: imagesError } = await supabaseClient.from("project_images").delete().eq("project_id", id)

    if (imagesError) throw imagesError

    // Then delete the project
    const { error } = await supabaseClient.from("projects").delete().eq("id", id)

    if (error) throw error

    res.status(200).json({
      message: "Project deleted successfully",
    })
  } catch (error) {
    next(error)
  }
})

export default router

