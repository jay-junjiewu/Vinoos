import type { Request, Response, NextFunction } from "express"

interface ErrorWithStatus extends Error {
  status?: number
}

export const errorHandler = (err: ErrorWithStatus, req: Request, res: Response, next: NextFunction) => {
  console.error("Error:", err.message)

  const statusCode = err.status || 500
  const message = statusCode === 500 ? "Internal Server Error" : err.message

  res.status(statusCode).json({
    error: {
      message,
      status: statusCode,
    },
  })
}

