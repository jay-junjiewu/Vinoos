import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import projectsRouter from "./routes/projects"
import equipmentRouter from "./routes/equipment"
import mediaRouter from "./routes/media"
import { PORT, supabaseClient } from "./config/config" // Importing Supabase client from config.ts

// Load environment variables
dotenv.config()

// Initialize Express app
const app = express()

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Health check route
app.get("/api", (req, res) => {
  res.status(200).json({ status: "ok", message: "Server is running" })
})

// Routes
app.use("/api/projects", projectsRouter)
app.use("/api/equipment", equipmentRouter)
app.use("/api/media", mediaRouter)

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

export default app

