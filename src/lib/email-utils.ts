// File: src/lib/email-utils.ts
import * as React from 'react';
import { render } from '@react-email/render';
import nodemailer from 'nodemailer';
import {
  PasswordResetEmail,
  ForgotPasswordEmail,
  PasswordChangedEmail,
  VerifyEmailEmail,
  LoginNotificationEmail
} from '@/emails/auths/index';
import { logger } from './logger';

interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: { user: string; pass: string };
  from: string;
  fromName: string;
}

const getEmailConfig = (): EmailConfig => {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
    throw new Error('SMTP configuration is missing');
  }
  return {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD },
    from: process.env.EMAIL_FROM || '<>',
    fromName: process.env.EMAIL_FROM_NAME || 'Jubilee Care',
  };
};

const transporter = nodemailer.createTransport(getEmailConfig());

export const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    const config = getEmailConfig();
    await transporter.sendMail({ 
      from: `"${config.fromName}" <${config.from}>`, 
      to, 
      subject, 
      html 
    });
    logger.info(`Email sent to ${to}`);
    return true;
  } catch (error) {
    logger.error(`Failed to send email to ${to}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return false;
  }
};

// Type definitions for email parameters
interface PasswordResetParams {
  email: string;
  name?: string;
  resetLink: string;
  expiryHours?: number;
  companyName?: string;
  supportEmail?: string;
  ipAddress?: string;
}

interface ForgotPasswordParams {
  email: string;
  name?: string;
  resetLink: string;
  expiryHours?: number;
  companyName?: string;
  supportEmail?: string;
}

interface PasswordChangedParams {
  email: string;
  name?: string;
  changeTime: string;
  companyName?: string;
  ipAddress?: string;
  deviceInfo?: string;
}

interface VerificationParams {
  email: string;
  name?: string;
  verificationLink: string;
  companyName?: string;
  expiryHours?: number;
}

interface LoginNotificationParams {
  email: string;
  name?: string;
  loginTime: string;
  deviceInfo: {
    ip?: string;
    browser?: string;
    os?: string;
    location?: string;
  };
  companyName?: string;
}

// Email sending functions
export const sendPasswordResetEmail = async (params: PasswordResetParams) => {
  const html = await render(React.createElement(PasswordResetEmail, params));
  return sendEmail(params.email, 'Password Reset Request', html);
};

export const sendForgotPasswordEmail = async (params: ForgotPasswordParams) => {
  const html = await render(React.createElement(ForgotPasswordEmail, params));
  return sendEmail(params.email, 'Password Reset Request', html);
};

export const sendPasswordChangedEmail = async (params: PasswordChangedParams) => {
  const html = await render(React.createElement(PasswordChangedEmail, params));
  return sendEmail(params.email, 'Your Password Has Been Changed', html);
};

export const sendVerificationEmail = async (params: VerificationParams) => {
  const html = await render(React.createElement(VerifyEmailEmail, params));
  return sendEmail(params.email, 'Verify Your Email Address', html);
};

export const sendLoginNotificationEmail = async (params: LoginNotificationParams) => {
  const html = await render(React.createElement(LoginNotificationEmail, params));
  return sendEmail(params.email, 'New Login Detected', html);
};

// SMTP server verification
export const verifyEmailConfig = async () => {
  try {
    await transporter.verify();
    logger.info('Email server is ready');
    return true;
  } catch (error) {
    logger.error('Email server configuration error:', error);
    return false;
  }
};