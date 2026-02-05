
import { EmailQueue } from '@repo/database';

export async function queueEmail(
    recipientString: string,
    subject: string,
    body: string,
    _relatedType?: string,
    _relatedId?: number
) {
    return EmailQueue.create({
        recipient_email: recipientString,
        subject,
        body,
        status: 'pending',
        attempts: 0
    } as any);
}
