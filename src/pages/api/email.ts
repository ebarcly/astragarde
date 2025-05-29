import type { APIRoute } from 'astro';
import { sendContactEmail, type ContactFormData } from '$/utils/resend';

export const POST: APIRoute = async ({ request }) => {
  try {
    // Parse form data
    const formData = await request.formData();
    
    const contactData: ContactFormData = {
      name: formData.get('name')?.toString().trim() || '',
      email: formData.get('email')?.toString().trim() || '',
      message: formData.get('message')?.toString().trim() || '',
    };

    // Validate required fields
    if (!contactData.name || !contactData.email || !contactData.message) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'All fields are required' 
        }),
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contactData.email)) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Please enter a valid email address' 
        }),
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // Basic sanitization
    contactData.name = contactData.name.substring(0, 100);
    contactData.email = contactData.email.substring(0, 254);
    contactData.message = contactData.message.substring(0, 2000);

    // Send email
    const result = await sendContactEmail(contactData);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Thank you for your message! We\'ll get back to you soon.',
        id: result.id
      }),
      { 
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

  } catch (error) {
    console.error('Contact form error:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Sorry, there was an error sending your message. Please try again later.' 
      }),
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
};