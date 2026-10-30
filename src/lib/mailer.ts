import nodemailer from 'nodemailer';

interface SendOtpEmailParams {
  to: string;
  otp: string;
  fullName?: string;
}

export async function sendOtpEmail({ to, otp, fullName }: SendOtpEmailParams) {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const user = process.env.SMTP_USER?.trim();
  const rawPass = process.env.SMTP_PASS?.trim();
  const pass = rawPass?.replace(/\s+/g, '');
  const from = process.env.SMTP_FROM || (user ? `"DigiTube Backstage" <${user}>` : '"DigiTube Network" <no-reply@digitubenetwork.com>');

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #0f172a; }
          .container { max-width: 480px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; padding: 32px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
          .logo { font-size: 20px; font-weight: 800; color: #1d4ed8; margin-bottom: 20px; letter-spacing: -0.5px; }
          .code-box { background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 20px; text-align: center; margin: 24px 0; }
          .code { font-family: -apple-system, BlinkMacSystemFont, 'SF Mono', monospace; font-size: 34px; font-weight: 800; letter-spacing: 8px; color: #1d4ed8; }
          .footer { font-size: 11px; color: #64748b; margin-top: 32px; border-top: 1px solid #f1f5f9; padding-top: 16px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">DigiTube Backstage</div>
          <p style="font-size: 15px; margin: 0 0 12px 0;">Hello${fullName ? ` ${fullName}` : ''},</p>
          <p style="font-size: 14px; color: #334155; line-height: 1.5; margin: 0 0 16px 0;">
            Use the following 6-digit verification code to complete your registration for DigiTube Backstage:
          </p>
          <div class="code-box">
            <div class="code">${otp}</div>
          </div>
          <p style="font-size: 13px; color: #64748b; line-height: 1.5;">
            This verification code is valid for <strong>10 minutes</strong>. If you did not request this verification code, please ignore this email.
          </p>
          <div class="footer">
            DigiTube Network • Enterprise Music Distribution & Royalties
          </div>
        </div>
      </body>
    </html>
  `;

  // If real SMTP credentials are provided in .env
  if (user && pass) {
    try {
      const isGmail = user.toLowerCase().includes('@gmail.com') || (host && host.includes('gmail'));
      
      const transportConfig: any = isGmail
        ? {
            service: 'gmail',
            auth: { user, pass },
          }
        : {
            host: host || 'smtp.gmail.com',
            port,
            secure: port === 465,
            auth: { user, pass },
          };

      const transporter = nodemailer.createTransport(transportConfig);

      const info = await transporter.sendMail({
        from,
        to,
        subject: `${otp} is your DigiTube Backstage verification code`,
        text: `Your DigiTube Backstage verification code is: ${otp}. It expires in 10 minutes.`,
        html: htmlContent,
      });

      console.log(`[DigiTube Email] ✅ Real email dispatched via SMTP to ${to} (Message ID: ${info.messageId})`);
      return { success: true, messageId: info.messageId, deliveredVia: 'SMTP' };
    } catch (smtpError: any) {
      console.error('[DigiTube Email] ❌ SMTP send failed:', smtpError.message);
      // Fall through to log fallback so registration is never broken
      return {
        success: false,
        error: smtpError.message,
        deliveredVia: 'FAILED',
        fallbackLogged: true,
      };
    }
  }

  // When SMTP credentials are not configured in .env:
  console.log(`\n======================================================`);
  console.log(`[DigiTube Email] ⚠️ Real email not sent because SMTP is not configured in .env`);
  console.log(`[DigiTube Email] 📧 TARGET EMAIL: ${to}`);
  console.log(`[DigiTube Email] 🔑 GENERATED OTP: ${otp}`);
  console.log(`[DigiTube Email] ℹ️ Enter SMTP_USER and SMTP_PASS in .env to deliver real emails to inboxes.`);
  console.log(`======================================================\n`);

  return {
    success: false,
    deliveredVia: 'UNCONFIGURED',
    error: 'SMTP credentials missing. Please set SMTP_USER and SMTP_PASS in .env to deliver real emails to inboxes.',
  };
}
