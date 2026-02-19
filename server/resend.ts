import { Resend } from 'resend';

let connectionSettings: any;

async function getCredentials() {
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken) {
    throw new Error('X_REPLIT_TOKEN not found for repl/depl');
  }

  connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=resend',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    }
  ).then(res => res.json()).then(data => data.items?.[0]);

  if (!connectionSettings || (!connectionSettings.settings.api_key)) {
    throw new Error('Resend not connected');
  }
  return {apiKey: connectionSettings.settings.api_key, fromEmail: connectionSettings.settings.from_email};
}

async function getApiKey() {
  const creds = await getCredentials();
  return creds.apiKey;
}

// WARNING: Never cache this client.
// Access tokens expire, so a new client must be created each time.
// Always call this function again to get a fresh client.
export async function getUncachableResendClient() {
  const apiKey = await getApiKey();
  return {
    client: new Resend(apiKey),
    fromEmail: connectionSettings.settings.from_email
  };
}

// Generate a 6-digit verification code
export function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send verification code email
export async function sendVerificationEmail(email: string, code: string) {
  const { client, fromEmail } = await getUncachableResendClient();
  
  const { data, error } = await client.emails.send({
    from: `BowlingAlleys.io <${fromEmail}>`,
    to: email,
    subject: 'Your BowlingAlleys.io Verification Code',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Welcome to BowlingAlleys.io!</h1>
        <p style="font-size: 16px; color: #555;">Your verification code is:</p>
        <div style="background-color: #f4f4f4; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #000;">${code}</span>
        </div>
        <p style="font-size: 14px; color: #777;">This code will expire in 10 minutes.</p>
        <p style="font-size: 14px; color: #777;">If you didn't request this code, you can safely ignore this email.</p>
      </div>
    `
  });

  if (error) {
    throw new Error(`Failed to send verification email: ${error.message}`);
  }

  return data;
}

// Send custom email
export async function sendCustomEmail(to: string, subject: string, html: string) {
  const { client, fromEmail } = await getUncachableResendClient();
  
  const { data, error } = await client.emails.send({
    from: `BowlingAlleys.io <${fromEmail}>`,
    to,
    subject,
    html
  });

  if (error) {
    throw new Error(`Failed to send email: ${error.message}`);
  }

  return data;
}
