export interface AddToWishlistDTO {
  product_id: number;
  product_variant_id?: number;
}

// Address DTOs
export interface CreateAddressDTO {
  label?: string;
  recipient_name: string;
  phone: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  district?: string;
  subdistrict?: string;
  province: string;
  postal_code: string;
  is_default?: boolean;
}

// Profile DTOs
export interface UpdateProfileDTO {
  full_name?: string;
  phone?: string;
}

export interface ChangePasswordDTO {
  current_password: string;
  new_password: string;
}

export interface AddToCartDTO {
  product_variant_id: number;
  quantity: number;
}
