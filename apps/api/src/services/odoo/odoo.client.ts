import {
  AppError,
  UnauthorizedError,
  ServiceUnavailableError,
  InternalServerError,
} from "@repo/shared/errors";

export interface OdooResponse<T = unknown> {
  jsonrpc: string;
  id?: number | string | null;
  result?: T;
  error?: {
    code: number;
    message: string;
    data?: unknown;
  };
}

export class OdooClient {
  private baseUrl!: string;
  private db!: string;
  private username!: string;
  private password!: string;
  private uid: number | null = null;
  private sessionId: string | null = null;
  private useMock!: boolean;

  constructor() {
    this.reloadConfig();
  }

  reloadConfig() {
    this.baseUrl = process.env.ODOO_URL || "";
    this.db = process.env.ODOO_DATABASE || "";
    this.username = process.env.ODOO_USERNAME || "";
    this.password = process.env.ODOO_PASSWORD || process.env.ODOO_API_KEY || "";

    this.useMock =
      !this.baseUrl || !this.db || !this.username || !this.password;

    if (this.useMock) {
      console.warn("[ODOO] ⚠️  Running in MOCK mode - Missing credentials");
    } else {
      console.log("[ODOO] ✅ Production mode - All credentials configured");
    }
  }

  /**
   * Refresh configuration from database settings
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async refreshFromSettings(settings: any[]) {
    const urlSetting = settings.find((s) => s.setting_key === "odoo_url");
    const dbSetting = settings.find((s) => s.setting_key === "odoo_db");
    const userSetting = settings.find((s) => s.setting_key === "odoo_username");
    const passSetting = settings.find((s) => s.setting_key === "odoo_password");

    if (urlSetting) this.baseUrl = urlSetting.setting_value;
    if (dbSetting) this.db = dbSetting.setting_value;
    if (userSetting) this.username = userSetting.setting_value;
    if (passSetting) this.password = passSetting.setting_value;

    this.useMock =
      !this.baseUrl || !this.db || !this.username || !this.password;

    // Clear authentication if config changed
    this.uid = null;
    this.sessionId = null;
  }

  async authenticate(): Promise<number> {
    if (this.useMock) {
      console.log("[ODOO MOCK] Authentication bypassed");
      this.uid = 1;
      return this.uid;
    }

    try {
      console.log("[ODOO] Authenticating...");

      // Odoo authentication via JSON-RPC
      const response = await fetch(`${this.baseUrl}/web/session/authenticate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jsonrpc: "2.0",
          params: {
            db: this.db,
            login: this.username,
            password: this.password,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Authentication failed: ${response.statusText}`);
      }

      const data = (await response.json()) as OdooResponse<{
        uid: number;
        session_id: string;
      }>;

      if (data.error) {
        throw new Error(`Odoo Auth Error: ${data.error.message}`);
      }

      this.uid = data.result?.uid ?? null;
      this.sessionId = data.result?.session_id ?? null;

      if (!this.uid) {
        throw new Error("Authentication failed: No UID returned");
      }

      // Extract session cookie from response headers
      const setCookie = response.headers.get("set-cookie");
      if (setCookie) {
        const sessionMatch = setCookie.match(/session_id=([^;]+)/);
        if (sessionMatch) {
          this.sessionId = sessionMatch[1];
        }
      }

      console.log("[ODOO] Authenticated successfully, UID:", this.uid);
      return this.uid;
    } catch (error) {
      console.error("[ODOO] Authentication error:", error);
      if (error instanceof AppError) throw error;

      // If it's an auth failure, throw UnauthorizedError, else ServiceUnavailable
      const msg = error instanceof Error ? error.message : "Unknown error";
      if (msg.includes("Authentication failed") || msg.includes("Auth Error")) {
        throw new UnauthorizedError(`Odoo: ${msg}`);
      }
      throw new ServiceUnavailableError("Odoo Authentication");
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async call(
    model: string,
    method: string,
    args: any[] = [],
    kwargs: any = {},
  ): Promise<any> {
    if (!this.uid) {
      await this.authenticate();
    }

    if (this.useMock) {
      console.log(`[ODOO MOCK] Would call: ${model}.${method}`, {
        args,
        kwargs,
      });
      return null;
    }

    try {
      // console.log(`[ODOO] Calling ${model}.${method}`);

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      // Include session cookie if available
      if (this.sessionId) {
        headers["Cookie"] = `session_id=${this.sessionId}`;
      }

      const response = await fetch(`${this.baseUrl}/web/dataset/call_kw`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
          jsonrpc: "2.0",
          method: "call",
          params: {
            model: model,
            method: method,
            args: args,
            kwargs: kwargs,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`API call failed: ${response.statusText}`);
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data = (await response.json()) as OdooResponse<any>;

      if (data.error) {
        throw new Error(`Odoo API Error: ${data.error.message}`);
      }

      return data.result;
    } catch (error) {
      console.error(`[ODOO] Error calling ${model}.${method}:`, error);
      if (error instanceof AppError) throw error;
      throw new InternalServerError(
        `Odoo API call failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  /**
   * Search and read records from Odoo
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async searchRead(
    model: string,
    domain: any[] = [],
    fields: string[] = [],
    options: any = {},
  ): Promise<any[]> {
    return this.call(model, "search_read", [domain], { fields, ...options });
  }

  /**
   * Create a record in Odoo
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async create(model: string, values: any): Promise<number> {
    return this.call(model, "create", [values]);
  }

  /**
   * Update record(s) in Odoo
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async write(model: string, ids: number[], values: any): Promise<boolean> {
    return this.call(model, "write", [ids, values]);
  }

  /**
   * Delete record(s) in Odoo
   */
  async unlink(model: string, ids: number[]): Promise<boolean> {
    return this.call(model, "unlink", [ids]);
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
  getConfig() {
    return {
      baseUrl: this.baseUrl || "NOT_SET",
      db: this.db || "NOT_SET",
      username: this.username ? "***" : "NOT_SET",
      authenticated: !!this.uid,
    };
  }
}

export const odooClient = new OdooClient();
