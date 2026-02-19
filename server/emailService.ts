import admin from './firebase';
import { sendVerificationEmail as sendViaResend } from './resend';

// Email service interface for abstraction
export interface IEmailService {
  sendVerificationCode(email: string, code: string): Promise<void>;
}

// Mock email service for development/testing
class MockEmailService implements IEmailService {
  async sendVerificationCode(email: string, code: string): Promise<void> {
    console.log(`[MOCK EMAIL] Verification code for ${email}: ${code}`);
    console.log(`[MOCK EMAIL] In production, this would be sent via Resend`);
    // In dev mode, we just log - the code is already stored in Firestore
    return Promise.resolve();
  }
}

// Production email service using Resend
class ResendEmailService implements IEmailService {
  async sendVerificationCode(email: string, code: string): Promise<void> {
    await sendViaResend(email, code);
  }
}

// Factory function to get the appropriate email service
export function getEmailService(): IEmailService {
  const useProductionEmail = process.env.USE_PRODUCTION_EMAIL === 'true';
  
  if (useProductionEmail) {
    console.log('[EMAIL SERVICE] Using Resend (production mode)');
    return new ResendEmailService();
  } else {
    console.log('[EMAIL SERVICE] Using mock email service (development mode)');
    return new MockEmailService();
  }
}
