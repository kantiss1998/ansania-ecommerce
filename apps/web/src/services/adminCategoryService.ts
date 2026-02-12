import { Category } from "@repo/shared";

import apiClient, { ApiResponse, getErrorMessage } from "@/lib/api";

export const adminCategoryService = {
  async createCategory(data: Partial<Category>): Promise<Category> {
    try {
      const response = await apiClient.post<ApiResponse<Category>>(
        "/admin/categories",
        data,
      );
      return response.data.data!;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  async updateCategory(id: number, data: Partial<Category>): Promise<Category> {
    try {
      const response = await apiClient.put<ApiResponse<Category>>(
        `/admin/categories/${id}`,
        data,
      );
      return response.data.data!;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  async deleteCategory(id: number): Promise<void> {
    try {
      await apiClient.delete(`/admin/categories/${id}`);
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  async uploadCategoryImage(id: number, file: File): Promise<string> {
    try {
      const formData = new FormData();
      formData.append("image", file);
      const response = await apiClient.post<ApiResponse<{ image_url: string }>>(
        `/admin/categories/${id}/image`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      return response.data.data!.image_url;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },
};
