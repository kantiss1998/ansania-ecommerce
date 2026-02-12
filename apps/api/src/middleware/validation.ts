import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";

export function validateRequest(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated = schema.parse({
        ...req.body,
        ...req.query,
        ...req.params,
      });

      // Replace req.body with validated data (strips unknown keys if schema allows)
      // Note: We might want to be careful if we need to distinguish between body/query/params
      // But for now, adhering to the standard pattern.
      // A better approach often separates validation, but this matches the provided coding standards.

      // For simply validating, we don't strictly need to replace req.body if we don't want to lose original structure
      // But usually we want typed access.
      // Let's attach it to a specific property to avoid overwriting distinct parts if they overlap.
      // However, the standards show: req.body = validated;
      // This merges everything into body. This might be risky if we have conflicting keys in query/body.
      // Let's follow the standard pattern shown in CODING_STANDARDS.md for now.

      req.body = validated;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          success: false,
          error: "Validation failed",
          details: error.errors.map((e) => ({
            path: e.path.join("."),
            message: e.message,
          })),
          code: "VALIDATION_ERROR",
        });
        return;
      }
      next(error);
    }
  };
}
