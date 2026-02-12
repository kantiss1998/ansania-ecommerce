import { ActivityLog } from "@repo/database";

export async function logActivity(
  action: string,
  data: {
    userId?: number | null;
    entityType?: string;
    entityId?: number;
    ipAddress?: string;
    userAgent?: string;
    metadata?: Record<string, unknown>;
  },
) {
  try {
    await ActivityLog.create({
      user_id: data.userId || null,
      action,
      entity_type: data.entityType || null,
      entity_id: data.entityId || null,
      ip_address: data.ipAddress || null,
      user_agent: data.userAgent || null,
      metadata: data.metadata || null,
    });
  } catch (error) {
    console.error("Failed to log activity:", error);
    // Do not throw, logging failure shouldn't kill request
  }
}
