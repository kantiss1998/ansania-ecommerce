import fs from "fs";
import path from "path";

import multer from "multer";

// Create uploads directories if they don't exist
const baseUploadDir = path.join(process.cwd(), "public/uploads");
const productUploadDir = path.join(baseUploadDir, "products");
const categoryUploadDir = path.join(baseUploadDir, "categories");

[productUploadDir, categoryUploadDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

const storage = multer.diskStorage({
    destination: (req, _file, cb) => {
        if (req.originalUrl.includes("/categories")) {
            cb(null, categoryUploadDir);
        } else {
            cb(null, productUploadDir);
        }
    },
    filename: (_req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(
            null,
            file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname),
        );
    },
});

const fileFilter = (
    _req: Express.Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback,
) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Only images (jpeg, png, webp) are allowed"));
    }
};

const maxSize = process.env.UPLOAD_MAX_SIZE
    ? parseInt(process.env.UPLOAD_MAX_SIZE)
    : 10 * 1024 * 1024; // Default 10MB

export const upload = multer({
    storage,
    limits: {
        fileSize: maxSize,
    },
    fileFilter,
});
