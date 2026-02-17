import { AppError } from "@repo/shared/errors";
import { Request, Response, NextFunction } from "express";
import { MulterError } from "multer";

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.message,
      code: err.code,
    });
  }

  // Handle Multer Errors
  if (err instanceof MulterError) {
    let message = "File upload error";
    if (err.code === "LIMIT_FILE_SIZE") {
      message = "File too large. Maximum size is 10MB.";
    }
    return res.status(400).json({
      success: false,
      error: message,
      code: `UPLOAD_${err.code}`,
    });
  }

  // Handle SyntaxError (e.g., invalid JSON)
  if (
    err instanceof SyntaxError &&
    "status" in err &&
    err["status"] === 400 &&
    "body" in err
  ) {
    return res.status(400).json({
      success: false,
      error: "Invalid JSON format",
      code: "INVALID_JSON",
    });
  }

  // Default error
  console.error("Unhandled error:", err);
  return res.status(500).json({
    success: false,
    error: "Internal server error",
    code: "INTERNAL_ERROR",
  });
}
