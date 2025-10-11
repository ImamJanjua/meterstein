import { Resend } from 'resend';
import { FormEmail } from '../../emails/emails/form-mail';
import { EMAIL_RECIPIENTS } from '~/lib/constants';

const resend = new Resend(process.env.RESEND_API_KEY);
const EMAIL_SENDER = 'info@codedecor.de';
const EMAIL_RECIPIENTS_DEV = ['imamofficaly7@gmail.com'];

interface SendEmailParams {
    senderName: string;
    type: string;
    data: Record<string, any>;
    imageUrls: string[];
}

export async function POST(request: Request) {
    const { senderName, type, data, imageUrls } = await request.json() as SendEmailParams;
    const result = await sendEmail({ senderName, type, data, imageUrls });
    return Response.json(result);
}

async function sendEmail({ senderName, type, data, imageUrls }: SendEmailParams) {
    try {
        const { data: emailData, error } = await resend.emails.send({
            from: EMAIL_SENDER,
            to: process.env.NODE_ENV === 'production' ? EMAIL_RECIPIENTS : EMAIL_RECIPIENTS_DEV,
            subject: ` ${type} - ${senderName}`,
            react: FormEmail({
                senderName,
                type,
                data,
            }),
            attachments: imageUrls.map((url) => ({
                path: url,
                filename: url.split('/').pop() || 'image.jpg',
            })),
        });

        if (error) {
            console.error('Error sending email:', error);
            return { success: false, error: error.message };
        }

        console.log('Email sent successfully:', emailData);
        return { success: true, data: emailData };
    } catch (error) {
        console.error('Error sending email:', error);
        return { success: false, error: 'Failed to send email' };
    }
}