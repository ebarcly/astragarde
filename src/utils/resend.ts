import { Resend } from 'resend';

if (!import.meta.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY environment variable is required');
}

export const resend = new Resend(import.meta.env.RESEND_API_KEY);

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export async function sendContactEmail(data: ContactFormData) {
  try {
    const { data: emailData, error } = await resend.emails.send({
      from: 'Astragarde Support <noreply@astragarde.com>', // Replace with your verified domain
      to: ['support@astragarde.com'], // Replace with your email
      subject: `New Contact Form Submission from ${data.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #333; padding-bottom: 10px;">
            New Contact Form Submission
          </h2>
          
          <div style="margin: 20px 0;">
            <h3 style="color: #555; margin-bottom: 5px;">From:</h3>
            <p style="margin: 0; font-size: 16px;"><strong>${data.name}</strong></p>
            <p style="margin: 0; color: #666;">${data.email}</p>
          </div>
          
          <div style="margin: 20px 0;">
            <h3 style="color: #555; margin-bottom: 10px;">Message:</h3>
            <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; border-left: 4px solid #333;">
              <p style="margin: 0; line-height: 1.6; white-space: pre-wrap;">${data.message}</p>
            </div>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #888; font-size: 12px;">
            <p>This email was sent from your website's contact form.</p>
          </div>
        </div>
      `,
      text: `
        New Contact Form Submission
        
        From: ${data.name}
        Email: ${data.email}
        
        Message:
        ${data.message}
        
        ---
        This email was sent from your website's contact form.
      `
    });

    if (error) {
      console.error('Resend error:', error);
      throw new Error('Failed to send email');
    }

    return { success: true, id: emailData?.id };
  } catch (error) {
    console.error('Email sending error:', error);
    throw error;
  }
}