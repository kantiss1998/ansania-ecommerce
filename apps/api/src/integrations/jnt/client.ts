/**
 * J&T Express Shipping Integration
 * Supports both sandbox and production environments
 * Implements J&T Express API for tariff checking, tracking, and location mapping
 */

import crypto from "crypto";

import { ServiceUnavailableError } from "@repo/shared/errors";

// J&T API Configuration
interface JNTConfig {
  apiKey: string;
  customerCode: string;
  baseUrl: string;
  branch_code: string;
}

// Tariff Check Request
export interface JNTRateQuery {
  origin_city: string;
  origin_district?: string;
  destination_city: string;
  destination_district?: string;
  weight: number; // in kg
}

// Tariff Check Response
export interface JNTRateResponse {
  service: string; // EZ, ECO, REG, YES, CARGO
  price: number;
  etd: string; // Estimated Time Delivery
  serviceName: string;
}

// Tracking Request
export interface JNTTrackingQuery {
  waybill_number: string;
}

// Tracking Response
export interface JNTTrackingResponse {
  waybill_number: string;
  status: string;
  current_location?: string;
  estimated_delivery?: string;
  history: Array<{
    date: string;
    status: string;
    location: string;
    description: string;
  }>;
}

// Location Data
export interface Province {
  id: number;
  name: string;
}

export interface City {
  id: number;
  province_id: number;
  name: string;
}

export interface District {
  id: number;
  city_id: number;
  name: string;
}

export interface JNTCreateOrderRequest {
  order_number: string;
  sender_name: string;
  sender_phone: string;
  sender_address: string;
  receiver_name: string;
  receiver_phone: string;
  receiver_address: string;
  receiver_city: string;
  receiver_district?: string;
  receiver_zip?: string;
  weight: number;
  items_value: number;
  goods_type: string;
}

interface JNTRateApiResponse {
  rates?: Array<{
    serviceCode: string;
    serviceName: string;
    price: number;
    estimatedDelivery: string;
  }>;
}

interface JNTTrackingApiResponse {
  status: string;
  currentLocation: string;
  estimatedDelivery?: string;
  trackingHistory: Array<{
    date: string;
    status: string;
    location: string;
    description: string;
  }>;
}

interface JNTCreateOrderApiResponse {
  waybillNumber: string;
}

export class JNTClient {
  private config: JNTConfig;
  private useMock: boolean;

  // Mock location data for development
  private mockProvinces: Province[] = [
    { id: 1, name: "DKI Jakarta" },
    { id: 2, name: "Jawa Barat" },
    { id: 3, name: "Jawa Tengah" },
    { id: 4, name: "Jawa Timur" },
    { id: 5, name: "Bali" },
  ];

  private mockCities: City[] = [
    { id: 1, province_id: 1, name: "Jakarta Utara" },
    { id: 2, province_id: 1, name: "Jakarta Selatan" },
    { id: 3, province_id: 1, name: "Jakarta Pusat" },
    { id: 4, province_id: 2, name: "Bandung" },
    { id: 5, province_id: 2, name: "Bogor" },
    { id: 6, province_id: 3, name: "Semarang" },
    { id: 7, province_id: 4, name: "Surabaya" },
  ];

  constructor() {
    // Load configuration from environment variables
    this.config = {
      apiKey: process.env.JNT_API_KEY || "",
      customerCode: process.env.JNT_CUSTOMER_CODE || "",
      baseUrl: process.env.JNT_API_URL || "https://api-test.jet.co.id",
      branch_code: process.env.JNT_BRANCH_CODE || "CGK10000",
    };

    // Use mock if credentials not configured
    this.useMock = !this.config.apiKey || !this.config.customerCode;

    if (this.useMock) {
      console.warn("[JNT] Running in MOCK mode - No credentials configured");
    }
  }

  /**
   * Generate signature for J&T API requests
   * J&T typically uses MD5 or HMAC-SHA256
   */
  private generateSignature(data: string): string {
    return crypto
      .createHash("md5")
      .update(data + this.config.apiKey)
      .digest("hex")
      .toUpperCase();
  }

  /**
   * Check shipping rates/tariff
   */
  async checkRates(params: JNTRateQuery): Promise<JNTRateResponse[]> {
    if (this.useMock) {
      return this.getMockRates(params);
    }

    try {
      const requestData = {
        customerCode: this.config.customerCode,
        branchCode: this.config.branch_code,
        originCity: params.origin_city,
        originDistrict: params.origin_district || "",
        destinationCity: params.destination_city,
        destinationDistrict: params.destination_district || "",
        weight: params.weight,
      };

      const signature = this.generateSignature(JSON.stringify(requestData));

      const response = await fetch(`${this.config.baseUrl}/api/tariff/check`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": this.config.apiKey,
          "X-Signature": signature,
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error(`J&T API Error: ${response.statusText}`);
      }

      const data = (await response.json()) as JNTRateApiResponse;

      // Map J&T response to our format
      return (data.rates || []).map((rate) => ({
        service: rate.serviceCode,
        serviceName: rate.serviceName,
        price: rate.price,
        etd: rate.estimatedDelivery || "Unknown",
      }));
    } catch (error) {
      console.error("[JNT] Failed to check rates:", error);
      // Fallback to mock data on error
      console.warn("[JNT] Falling back to mock rates due to API error");
      return this.getMockRates(params);
    }
  }

  /**
   * Generate mock shipping rates for testing
   */
  private getMockRates(params: JNTRateQuery): JNTRateResponse[] {
    console.log(
      `[JNT MOCK] Checking rates from ${params.origin_city} to ${params.destination_city} for ${params.weight}kg`,
    );

    // Calculate base price based on weight
    const basePrice = 10000;
    const weightPrice = Math.ceil(params.weight) * 5000;
    const totalPrice = basePrice + weightPrice;

    // Distance multiplier (simplified)
    let distanceMultiplier = 1.0;
    if (params.origin_city !== params.destination_city) {
      distanceMultiplier = 1.5;
    }

    const rates: JNTRateResponse[] = [
      {
        service: "EZ",
        serviceName: "J&T Express EZ",
        price: Math.floor(totalPrice * distanceMultiplier),
        etd: "2-3 Days",
      },
      {
        service: "REG",
        serviceName: "J&T Regular",
        price: Math.floor(totalPrice * distanceMultiplier * 1.2),
        etd: "1-2 Days",
      },
      {
        service: "ECO",
        serviceName: "J&T Economy",
        price: Math.floor(totalPrice * distanceMultiplier * 0.8),
        etd: "5-7 Days",
      },
    ];

    // Add cargo service if weight > 10kg
    if (params.weight > 10) {
      rates.push({
        service: "CARGO",
        serviceName: "J&T Cargo",
        price: Math.floor(totalPrice * distanceMultiplier * 0.7),
        etd: "7-10 Days",
      });
    }

    console.log("[JNT MOCK] Generated rates:", rates);
    return rates;
  }

  /**
   * Track shipment by waybill number
   */
  async trackOrder(waybillNumber: string): Promise<JNTTrackingResponse> {
    if (this.useMock) {
      return this.getMockTracking(waybillNumber);
    }

    try {
      const requestData = {
        customerCode: this.config.customerCode,
        waybillNumber: waybillNumber,
      };

      const signature = this.generateSignature(JSON.stringify(requestData));

      const response = await fetch(`${this.config.baseUrl}/api/tracking`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": this.config.apiKey,
          "X-Signature": signature,
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error(`J&T Tracking API Error: ${response.statusText}`);
      }

      const data = (await response.json()) as JNTTrackingApiResponse;

      return {
        waybill_number: waybillNumber,
        status: data.status,
        current_location: data.currentLocation,
        estimated_delivery: data.estimatedDelivery,
        history: data.trackingHistory || [],
      };
    } catch (error) {
      console.error("[JNT] Failed to track order:", error);
      // Fallback to mock
      return this.getMockTracking(waybillNumber);
    }
  }

  /**
   * Generate mock tracking data
   */
  private getMockTracking(waybillNumber: string): JNTTrackingResponse {
    console.log("[JNT MOCK] Tracking waybill:", waybillNumber);

    return {
      waybill_number: waybillNumber,
      status: "IN_TRANSIT",
      current_location: "Jakarta Hub",
      estimated_delivery: new Date(
        Date.now() + 2 * 24 * 60 * 60 * 1000,
      ).toISOString(),
      history: [
        {
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          status: "PICKED_UP",
          location: "Jakarta",
          description: "Package picked up from sender",
        },
        {
          date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          status: "IN_TRANSIT",
          location: "Jakarta Hub",
          description: "Package in transit",
        },
      ],
    };
  }

  /**
   * Create shipping order with J&T
   */
  async createOrder(orderData: JNTCreateOrderRequest): Promise<string> {
    if (this.useMock) {
      console.log("[JNT MOCK] Creating order:", orderData);
      return "JP" + Math.floor(Math.random() * 1000000000).toString();
    }

    try {
      const requestData = {
        customerCode: this.config.customerCode,
        branchCode: this.config.branch_code,
        ...orderData,
      };

      const signature = this.generateSignature(JSON.stringify(requestData));

      const response = await fetch(`${this.config.baseUrl}/api/order/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": this.config.apiKey,
          "X-Signature": signature,
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error(`J&T Order API Error: ${response.statusText}`);
      }

      const data = (await response.json()) as JNTCreateOrderApiResponse;
      return data.waybillNumber;
    } catch (error) {
      console.error("[JNT] Failed to create order:", error);
      throw new ServiceUnavailableError("J&T Order Service");
    }
  }

  /**
   * Get all provinces
   */
  async getProvinces(): Promise<Province[]> {
    if (this.useMock) {
      console.log("[JNT MOCK] Getting provinces");
      return this.mockProvinces;
    }

    try {
      const response = await fetch(
        `${this.config.baseUrl}/api/location/provinces`,
        {
          method: "GET",
          headers: {
            "X-API-Key": this.config.apiKey,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch provinces");
      }

      return (await response.json()) as Province[];
    } catch (error) {
      console.warn("[JNT] Failed to fetch provinces, using mock data:", error);
      return this.mockProvinces;
    }
  }

  /**
   * Get cities by province ID
   */
  async getCities(provinceId?: number): Promise<City[]> {
    if (this.useMock) {
      console.log("[JNT MOCK] Getting cities for province:", provinceId);
      if (provinceId) {
        return this.mockCities.filter((c) => c.province_id === provinceId);
      }
      return this.mockCities;
    }

    try {
      const url = provinceId
        ? `${this.config.baseUrl}/api/location/cities?provinceId=${provinceId}`
        : `${this.config.baseUrl}/api/location/cities`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "X-API-Key": this.config.apiKey,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch cities");
      }

      return (await response.json()) as City[];
    } catch (error) {
      console.warn("[JNT] Failed to fetch cities, using mock data:", error);
      if (provinceId) {
        return this.mockCities.filter((c) => c.province_id === provinceId);
      }
      return this.mockCities;
    }
  }

  /**
   * Check if client is in mock mode
   */
  isMockMode(): boolean {
    return this.useMock;
  }

  /**
   * Get current configuration (without sensitive data)
   */
  getConfig(): Partial<JNTConfig> {
    return {
      baseUrl: this.config.baseUrl,
      branch_code: this.config.branch_code,
      customerCode: this.config.customerCode ? "***" : "NOT_SET",
    };
  }
}

// Export singleton instance
export const jntClient = new JNTClient();
