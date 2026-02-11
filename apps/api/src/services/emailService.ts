
import { EmailQueue } from '@repo/database';
import { EMAIL_STATUS } from '@repo/shared/constants';

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
        status: EMAIL_STATUS.PENDING,
        attempts: 0
    });
}
