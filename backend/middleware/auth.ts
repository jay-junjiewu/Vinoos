import type { Request, Response, NextFunction } from "express"
import { supabaseClient } from "../config/config"

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      const error = new Error("Unauthorized: No token provided") as any
      error.status = 401
      throw error
    }

    const token = authHeader.split(" ")[1]

    const { data, error } = await supabaseClient.auth.getUser(token)

    if (error || !data.user) {
      const authError = new Error("Unauthorized: Invalid token") as any
      authError.status = 401
      throw authError
    }
    // Add user to request object
    ;(req as any).user = data.user

    next()
  } catch (error) {
    next(error)
  }
}

