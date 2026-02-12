import apiClient, { ApiResponse, getErrorMessage } from "@/lib/api";

export interface Address {
  id: number;
  recipient_name: string;
  phone: string;
  address_line: string;
  city: string;
  city_id?: string | number;
  province: string;
  province_id?: string | number;
  postal_code: string;
  is_default: boolean;
}

export interface CreateAddressData {
  recipient_name: string;
  phone: string;
  address_line: string;
  city: string;
  city_id?: string | number;
  province: string;
  province_id?: string | number;
  postal_code: string;
  is_default?: boolean;
}

export const addressService = {
  async getAddresses(): Promise<Address[]> {
    try {
      const response =
        await apiClient.get<ApiResponse<Address[]>>("/addresses");
      return response.data.data || [];
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  async createAddress(data: CreateAddressData): Promise<Address> {
    try {
      const response = await apiClient.post<ApiResponse<Address>>(
        "/addresses",
        data,
      );
      return response.data.data!;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  async updateAddress(
    id: number,
    data: Partial<CreateAddressData>,
  ): Promise<Address> {
    try {
      const response = await apiClient.put<ApiResponse<Address>>(
        `/addresses/${id}`,
        data,
      );
      return response.data.data!;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  async deleteAddress(id: number): Promise<void> {
    try {
      await apiClient.delete(`/addresses/${id}`);
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },
};
