import sgMail from '@sendgrid/mail';

export async function POST({ request }) {
  console.log('API route hit');

  try {
    const rawBody = await request.text();
    console.log('Raw body:', rawBody);

    const data = JSON.parse(rawBody);
    console.log('Parsed data:', data);

    // Log the API key (remove this in production)
    console.log('SendGrid API Key:', import.meta.env.SENDGRID_API_KEY);

    sgMail.setApiKey(import.meta.env.SENDGRID_API_KEY);

    const msg = {
      to: 'coach@steppingstonelabs.com',
      from: 'coach@steppingstonelabs.com', // This must be a verified sender in your SendGrid account
      subject: `Request for Information: ${data.subject}`,
      text: `
        Name: ${data.name}
        Phone: ${data.phone}
        Email: ${data.email}
        Subject: ${data.subject}
        Description: ${data.description}
      `,
    };

    const result = await sgMail.send(msg);
    console.log('SendGrid response:', result);

    return new Response(JSON.stringify({ message: 'Email sent successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in API route:', error);
    return new Response(JSON.stringify({ message: 'Error processing request', error: error.toString() }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
