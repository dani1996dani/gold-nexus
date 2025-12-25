import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// Environment variables for recipients
const ADMIN_EMAIL = process.env.ADMIN_NOTIFICATION_EMAIL || 'bbaron.daniel@gmail.com';
const PARTNER_EMAIL = process.env.PARTNER_LEAD_EMAIL || 'bbaron.daniel@gmail.com';

// From address (Resend requires a verified domain in production, but lets you use 'onboarding@resend.dev' for testing)
const FROM_EMAIL = 'Gold Nexus <onboarding@resend.dev>';

/**
 * Notifies the Admin about a new successful (Paid) order.
 */
export async function sendOrderNotificationEmail(order: any) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [ADMIN_EMAIL],
      subject: `🔔 New Order Received: #${order.displayId}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #eee; border-top: 4px solid #D4AF37;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="margin: 0; font-family: serif; color: #1a202c; letter-spacing: 1px;">GOLD NEXUS</h1>
            <p style="margin: 5px 0 0; font-size: 12px; text-transform: uppercase; color: #D4AF37; font-weight: bold;">Institutional Trading Platform</p>
          </div>

          <h2 style="color: #1a202c; font-size: 20px; font-weight: 500; margin-bottom: 20px;">New Order Notification</h2>
          <p style="color: #4a5568; line-height: 1.6;">
            A new order has been paid and is ready for fulfillment. 
            <br/>Please review the details below:
          </p>
          
          <div style="background: #fdfcf7; padding: 20px; border-radius: 8px; margin: 25px 0; border: 1px solid #f3efd9;">
            <h3 style="margin-top: 0; font-size: 14px; text-transform: uppercase; color: #D4AF37; letter-spacing: 0.5px;">Order Information</h3>
            <ul style="list-style: none; padding: 0; font-size: 15px; color: #1a202c; line-height: 1.8;">
              <li><strong>Order ID:</strong> #${order.displayId}</li>
              <li><strong>Customer:</strong> ${order.user?.fullName}</li>
              <li><strong>Email:</strong> ${order.user?.email}</li>
              <li><strong>Total Amount:</strong> $${Number(order.totalAmount).toFixed(2)} USD</li>
            </ul>
          </div>

          <div style="padding: 0 5px;">
            <h3 style="margin-top: 0; font-size: 14px; text-transform: uppercase; color: #D4AF37; letter-spacing: 0.5px;">Shipping Address</h3>
            <div style="margin-top: 10px; font-size: 15px; color: #1a202c; line-height: 1.6;">
              <p style="margin: 0;">${order.shippingAddressJson.fullName}</p>
              <p style="margin: 0;">${order.shippingAddressJson.address}${order.shippingAddressJson.apartment ? ', ' + order.shippingAddressJson.apartment : ''}</p>
              <p style="margin: 0;">${order.shippingAddressJson.city}, ${order.shippingAddressJson.state} ${order.shippingAddressJson.postalCode}</p>
              <p style="margin: 0;">${order.shippingAddressJson.country}</p>
            </div>
          </div>

          <p style="margin-top: 35px; text-align: center;">
            <a href="${process.env.NEXT_PUBLIC_BASE_URL}/admin/orders/${order.id}" 
               style="background: #000; color: #fff; padding: 14px 30px; text-decoration: none; border-radius: 4px; font-weight: bold; font-size: 14px;">
               View Order in Admin Panel
            </a>
          </p>

          <div style="margin-top: 40px; pt: 20px; border-top: 1px solid #eee; text-align: center; color: #a0aec0; font-size: 12px;">
            <p>© 2025 Gold Nexus LLC. All Rights Reserved.</p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error('Error sending order notification email:', error);
    }
  } catch (err) {
    console.error('Unexpected error in sendOrderNotificationEmail:', err);
  }
}

/**
 * Forwards a "Sell Your Gold" lead to the designated partner.
 */
export async function sendLeadForwardingEmail(lead: any) {
  try {
    const photosHtml =
      lead.photoUrls && Array.isArray(lead.photoUrls) && lead.photoUrls.length > 0
        ? `
        <div style="margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px;">
          <h3 style="font-size: 16px; color: #1a202c; margin-bottom: 15px;">Submitted Photos:</h3>
          <div style="display: flex; flex-wrap: wrap; gap: 10px;">
            ${lead.photoUrls
              .map(
                (url: string) => `
              <div style="margin-bottom: 15px; margin-right: 10px;">
                <img src="${url}" alt="Gold item" style="width: 180px; height: 180px; object-fit: cover; border-radius: 4px; border: 1px solid #ddd;" />
              </div>
            `
              )
              .join('')}
          </div>
        </div>
      `
        : '';

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [PARTNER_EMAIL],
      subject: `New Gold Acquisition Opportunity: ${lead.fullName}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #eee; border-top: 4px solid #D4AF37;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="margin: 0; font-family: serif; color: #1a202c; letter-spacing: 1px;">GOLD NEXUS</h1>
            <p style="margin: 5px 0 0; font-size: 12px; text-transform: uppercase; color: #D4AF37; font-weight: bold;">Institutional Trading Platform</p>
          </div>

          <h2 style="color: #1a202c; font-size: 20px; font-weight: 500; margin-bottom: 20px;">New Seller Acquisition</h2>
          <p style="color: #4a5568; line-height: 1.6;">
            A new client has reached out to Gold Nexus regarding the sale of their assets. 
            <br/>Please review the details below:
          </p>
          
          <div style="background: #fdfcf7; padding: 20px; border-radius: 8px; margin: 25px 0; border: 1px solid #f3efd9;">
            <h3 style="margin-top: 0; font-size: 14px; text-transform: uppercase; color: #D4AF37; letter-spacing: 0.5px;">Client Information</h3>
            <ul style="list-style: none; padding: 0; font-size: 15px; color: #1a202c; line-height: 1.8;">
              <li><strong>Name:</strong> ${lead.fullName}</li>
              <li><strong>Email:</strong> ${lead.email}</li>
              <li><strong>Phone:</strong> ${lead.phoneNumber}</li>
              <li><strong>Location:</strong> ${lead.city}, ${lead.country}</li>
            </ul>
          </div>

          <div style="padding: 0 5px;">
            <h3 style="margin-top: 0; font-size: 14px; text-transform: uppercase; color: #D4AF37; letter-spacing: 0.5px;">Asset Details</h3>
            <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #4a5568;">Item Type:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; font-weight: bold; text-align: right;">${lead.itemType}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #4a5568;">Estimated Karat:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; font-weight: bold; text-align: right;">${lead.estimatedKarat}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #4a5568;">Estimated Weight:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; font-weight: bold; text-align: right;">${lead.estimatedWeight}g</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #4a5568;">Estimated Value:</td>
                <td style="padding: 10px 0; font-weight: bold; text-align: right; color: #2d3748;">$${Number(lead.estimatedValue).toFixed(2)} USD</td>
              </tr>
            </table>
          </div>

          ${photosHtml}

          <div style="margin-top: 40px; pt: 20px; border-top: 1px solid #eee; text-align: center; color: #a0aec0; font-size: 12px;">
            <p>© 2025 Gold Nexus LLC. All Rights Reserved.</p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error('Error sending lead forwarding email:', error);
    }
  } catch (err) {
    console.error('Unexpected error in sendLeadForwardingEmail:', err);
  }
}

/**
 * Sends a secure password reset link to the user.
 */
export async function sendPasswordResetEmail(email: string, token: string) {
  try {
    const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${token}`;

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [email],
      subject: 'Secure Password Reset Request',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #eee; border-top: 4px solid #D4AF37;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="margin: 0; font-family: serif; color: #1a202c; letter-spacing: 1px;">GOLD NEXUS</h1>
            <p style="margin: 5px 0 0; font-size: 12px; text-transform: uppercase; color: #D4AF37; font-weight: bold;">Institutional Trading Platform</p>
          </div>

          <h2 style="color: #1a202c; font-size: 20px; font-weight: 500; margin-bottom: 20px;">Password Reset Request</h2>
          <p style="color: #4a5568; line-height: 1.6;">
            We received a request to reset the password associated with your Gold Nexus account. 
            <br/>Please click the button below to secure your account:
          </p>
          
          <p style="margin-top: 35px; text-align: center;">
            <a href="${resetLink}" 
               style="background: #000; color: #fff; padding: 14px 30px; text-decoration: none; border-radius: 4px; font-weight: bold; font-size: 14px;">
               Reset My Password
            </a>
          </p>

          <div style="margin-top: 35px; padding: 20px; background: #f9f9f9; border-radius: 8px; text-align: center;">
            <p style="margin: 0; font-size: 12px; color: #718096;">
              This link will expire in 1 hour. If you did not request this, please ignore this email or contact our security desk if you have concerns.
            </p>
          </div>

          <div style="margin-top: 40px; pt: 20px; border-top: 1px solid #eee; text-align: center; color: #a0aec0; font-size: 12px;">
            <p>© 2025 Gold Nexus LLC. All Rights Reserved.</p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error('Error sending password reset email:', error);
    }
  } catch (err) {
    console.error('Unexpected error in sendPasswordResetEmail:', err);
  }
}
