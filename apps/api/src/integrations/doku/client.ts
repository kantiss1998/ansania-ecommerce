/**
 * Doku Payment Gateway Integration
 * Supports both sandbox and production environments
 * Implements DOKU Checkout API with multiple payment methods
 */

import crypto from 'crypto';

import { AppError, BadRequestError, ServiceUnavailableError } from '@repo/shared/errors';

// Doku API Configuration
interface DokuConfig {
    clientId: string;
    secretKey: string;
    merchantId: string;
    environment: 'sandbox' | 'production';
    baseUrl: string;
    webhookUrl: string;
}

// Payment Request Interface
export interface PaymentRequest {
    order_number: string;
    amount: number;
    customer_email: string;
    customer_name: string;
    customer_phone?: string;
    payment_method_types?: string[]; // ['VIRTUAL_ACCOUNT', 'CREDIT_CARD', 'QRIS', etc.]
    item_details?: Array<{
        name: string;
        price: number;
        quantity: number;
    }>;
    callback_url?: string;
    return_url?: string;
}

// Payment Response Interface
export interface PaymentResponse {
    payment_url?: string;
    va_number?: string;
    qris_url?: string;
    invoice_number: string;
    transaction_id: string;
    expired_at?: string;
}

// Webhook Payload Interface
export interface DokuWebhookPayload {
    order: {
        invoice_number: string;
        amount: number;
    };
    transaction: {
        id: string;
        status: 'SUCCESS' | 'FAILED' | 'PENDING' | 'EXPIRED';
        date: string;
    };
    payment: {
        method: string;
        channel?: string;
    };
}

export class DokuClient {
    private config: DokuConfig;
    private useMock: boolean;

    constructor() {
        // Load configuration from environment variables
        this.config = {
            clientId: process.env.DOKU_CLIENT_ID || '',
            secretKey: process.env.DOKU_SECRET_KEY || '',
            merchantId: process.env.DOKU_MERCHANT_ID || '',
            environment: (process.env.DOKU_ENVIRONMENT as 'sandbox' | 'production') || 'sandbox',
            baseUrl: process.env.DOKU_API_URL || 'https://api-sandbox.doku.com',
            webhookUrl: process.env.DOKU_WEBHOOK_URL || 'http://localhost:5000/api/checkout/payment-webhook'
        };

        // Use mock if credentials not configured
        this.useMock = !this.config.clientId || !this.config.secretKey;

        if (this.useMock) {
            console.warn('[DOKU] Running in MOCK mode - No credentials configured');
        }
    }

    /**
     * Generate HMAC-SHA256 signature for Doku API requests
     */
    private generateSignature(data: string): string {
        return crypto
            .createHmac('sha256', this.config.secretKey)
            .update(data)
            .digest('hex');
    }

    /**
     * Generate request ID with timestamp
     */
    private generateRequestId(): string {
        return `REQ-${Date.now()}-${Math.random().toString(36).substring(7)}`;
    }

    /**
     * Generate payment session via Doku Checkout API
     */
    async generatePayment(request: PaymentRequest): Promise<PaymentResponse> {
        // If in mock mode, return mock response
        if (this.useMock) {
            return this.generateMockPayment(request);
        }

        try {
            // Prepare request payload
            const requestId = this.generateRequestId();
            const timestamp = new Date().toISOString();

            const payload = {
                order: {
                    invoice_number: request.order_number,
                    amount: request.amount,
                    callback_url: request.callback_url || this.config.webhookUrl,
                    line_items: request.item_details || []
                },
                payment: {
                    payment_due_date: this.calculatePaymentDueDate(),
                    payment_method_types: request.payment_method_types || [
                        'VIRTUAL_ACCOUNT',
                        'CREDIT_CARD',
                        'QRIS',
                        'WALLET'
                    ]
                },
                customer: {
                    id: request.customer_email,
                    name: request.customer_name,
                    email: request.customer_email,
                    phone: request.customer_phone || ''
                }
            };

            // Generate signature
            const stringToSign = `${this.config.clientId}:${requestId}:${timestamp}:${JSON.stringify(payload)}`;
            const signature = this.generateSignature(stringToSign);

            // Make API request to Doku
            const response = await fetch(`${this.config.baseUrl}/checkout/v1/payment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Client-Id': this.config.clientId,
                    'Request-Id': requestId,
                    'Request-Timestamp': timestamp,
                    'Signature': signature
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({})) as any;
                throw new AppError(
                    `Doku API Error: ${errorData.message || response.statusText}`,
                    response.status
                );
            }

            const data = await response.json() as any;

            return {
                invoice_number: request.order_number,
                payment_url: data.payment?.url,
                transaction_id: data.transaction?.id,
                expired_at: data.payment?.expired_at
            };

        } catch (error) {
            console.error('[DOKU] Payment generation failed:', error);
            if (error instanceof AppError) throw error;
            throw new ServiceUnavailableError('Doku Payment Service');
        }
    }

    /**
     * Generate mock payment response for testing without API credentials
     */
    private generateMockPayment(request: PaymentRequest): PaymentResponse {
        console.log('[DOKU MOCK] Generating payment for:', request.order_number);

        // Simulate different payment methods
        const mockResponse: PaymentResponse = {
            invoice_number: request.order_number,
            transaction_id: `TRX-MOCK-${Date.now()}`,
            payment_url: `https://sandbox.doku.com/checkout/${request.order_number}?mock=true`,
            expired_at: this.calculatePaymentDueDate()
        };

        // Add VA number if virtual account is requested
        if (request.payment_method_types?.includes('VIRTUAL_ACCOUNT')) {
            mockResponse.va_number = `8888${Math.floor(Math.random() * 1000000000).toString().padStart(10, '0')}`;
        }

        // Add QRIS URL if QRIS is requested
        if (request.payment_method_types?.includes('QRIS')) {
            mockResponse.qris_url = `https://sandbox.doku.com/qris/${request.order_number}`;
        }

        console.log('[DOKU MOCK] Payment generated:', mockResponse);
        return mockResponse;
    }

    /**
     * Calculate payment due date (24 hours from now)
     */
    private calculatePaymentDueDate(): string {
        const dueDate = new Date();
        dueDate.setHours(dueDate.getHours() + 24);
        return dueDate.toISOString();
    }

    /**
     * Verify webhook signature from Doku
     */
    verifySignature(headers: any, body: any): boolean {
        // Skip verification in development if flag is set
        if (process.env.SKIP_DOKU_VERIFY === 'true') {
            console.warn('[DOKU] Signature verification SKIPPED (SKIP_DOKU_VERIFY=true)');
            return true;
        }

        // If in mock mode, always return true
        if (this.useMock) {
            console.log('[DOKU MOCK] Signature verification bypassed (mock mode)');
            return true;
        }

        try {
            const signature = headers['signature'] || headers['x-doku-signature'];
            const timestamp = headers['request-timestamp'] || headers['x-doku-timestamp'];
            const requestId = headers['request-id'] || headers['x-doku-request-id'];

            if (!signature || !timestamp) {
                console.error('[DOKU] Missing signature or timestamp in headers');
                return false;
            }

            // Reconstruct the signature
            const bodyString = typeof body === 'string' ? body : JSON.stringify(body);
            const stringToSign = `${this.config.clientId}:${requestId}:${timestamp}:${bodyString}`;
            const expectedSignature = this.generateSignature(stringToSign);

            // Compare signatures
            const isValid = signature === expectedSignature;

            if (!isValid) {
                console.error('[DOKU] Signature verification failed');
                console.debug('[DOKU] Expected:', expectedSignature);
                console.debug('[DOKU] Received:', signature);
            }

            return isValid;

        } catch (error) {
            console.error('[DOKU] Signature verification error:', error);
            return false;
        }
    }

    /**
     * Parse webhook payload and validate structure
     */
    parseWebhook(body: any): DokuWebhookPayload {
        try {
            // Validate required fields
            if (!body.order || !body.transaction) {
                throw new Error('Invalid webhook payload structure');
            }

            return {
                order: {
                    invoice_number: body.order.invoice_number,
                    amount: body.order.amount
                },
                transaction: {
                    id: body.transaction.id,
                    status: body.transaction.status,
                    date: body.transaction.date || new Date().toISOString()
                },
                payment: {
                    method: body.payment?.method || 'unknown',
                    channel: body.payment?.channel
                }
            };
        } catch (error) {
            throw new BadRequestError(
                `Invalid webhook payload: ${error instanceof Error ? error.message : 'Unknown error'}`
            );
        }
    }

    /**
     * Get payment status by transaction ID (for manual checking)
     */
    async getPaymentStatus(transactionId: string): Promise<any> {
        if (this.useMock) {
            console.log('[DOKU MOCK] Getting payment status for:', transactionId);
            return {
                transaction_id: transactionId,
                status: 'SUCCESS',
                payment_date: new Date().toISOString()
            };
        }

        try {
            const requestId = this.generateRequestId();
            const timestamp = new Date().toISOString();

            const stringToSign = `${this.config.clientId}:${requestId}:${timestamp}:${transactionId}`;
            const signature = this.generateSignature(stringToSign);

            const response = await fetch(`${this.config.baseUrl}/checkout/v1/payment/${transactionId}`, {
                method: 'GET',
                headers: {
                    'Client-Id': this.config.clientId,
                    'Request-Id': requestId,
                    'Request-Timestamp': timestamp,
                    'Signature': signature
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to get payment status: ${response.statusText}`);
            }

            return await response.json();

        } catch (error) {
            console.error('[DOKU] Failed to get payment status:', error);
            if (error instanceof AppError) throw error;
            throw new ServiceUnavailableError('Doku Payment Status');
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
    getConfig(): Partial<DokuConfig> {
        return {
            environment: this.config.environment,
            baseUrl: this.config.baseUrl,
            merchantId: this.config.merchantId ? '***' : 'NOT_SET'
        };
    }
}

// Export singleton instance
export const dokuClient = new DokuClient();
