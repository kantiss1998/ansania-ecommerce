import { Request, Response, NextFunction } from "express";

import * as adminProductService from "../../services/admin/productService";

export async function getAllProducts(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const result = await adminProductService.listAdminProducts(req.query);
    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

export async function getProductDetail(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = req.params;
    const product = await adminProductService.getProductDetail(Number(id));
    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
}

export async function toggleActive(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = req.params;
    const product = await adminProductService.toggleActive(Number(id));
    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
}

export async function toggleFeatured(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = req.params;
    const product = await adminProductService.toggleFeatured(Number(id));
    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateSEO(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = req.params;
    const product = await adminProductService.updateSEO(Number(id), req.body);
    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateDescription(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = req.params;
    const { short_description } = req.body;
    const product = await adminProductService.updateDescription(
      Number(id),
      short_description,
    );
    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateProduct(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = req.params;
    const product = await adminProductService.updateProduct(
      Number(id),
      req.body,
    );
    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
}

// Image Controllers
export async function getImages(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = req.params;
    const images = await adminProductService.getProductImages(Number(id));
    res.json({
      success: true,
      data: images,
    });
  } catch (error) {
    next(error);
  }
}

export async function uploadImage(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = req.params;
    const { is_primary } = req.body;

    if (!req.file) {
      res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
      return;
    }

    // Construct the public URL
    // In production, this might be a CDN URL
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const imageUrl = `${baseUrl}/public/uploads/products/${req.file.filename}`;

    const image = await adminProductService.addProductImage(
      Number(id),
      imageUrl,
      is_primary === "true" || is_primary === true,
    );

    res.status(201).json({
      success: true,
      data: image,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteImage(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { imageId } = req.params;
    await adminProductService.deleteProductImage(Number(imageId));
    res.json({
      success: true,
      message: "Image deleted successfully",
    });
  } catch (error) {
    next(error);
  }
}

export async function setPrimaryImage(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id, imageId } = req.params;
    const image = await adminProductService.setPrimaryImage(
      Number(id),
      Number(imageId),
    );
    res.json({
      success: true,
      data: image,
    });
  } catch (error) {
    next(error);
  }
}

export async function getVariants(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = req.params;
    const variants = await adminProductService.getProductVariants(Number(id));
    res.json({
      success: true,
      data: variants,
    });
  } catch (error) {
    next(error);
  }
}

export async function getVariantDetail(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { variantId } = req.params;
    const variant = await adminProductService.getVariantDetail(
      Number(variantId),
    );
    res.json({
      success: true,
      data: variant,
    });
  } catch (error) {
    next(error);
  }
}
