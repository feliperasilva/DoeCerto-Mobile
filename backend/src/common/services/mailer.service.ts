import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import nodemailer from 'nodemailer';

@Injectable()
export class MailerService {
  private readonly logger = new Logger(MailerService.name);
  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    this.initializeTransporter();
  }

  private initializeTransporter(): void {
    const emailUser = this.configService.get<string>('EMAIL_USER');
    const emailPass = this.configService.get<string>('EMAIL_PASS');
    const emailHost = this.configService.get<string>('EMAIL_HOST') || 'smtp.gmail.com';
    const emailPort = this.configService.get<number>('EMAIL_PORT') || 587;

    if (!emailUser || !emailPass) {
      this.logger.warn(
        'Email credentials not configured. Email notifications will be logged instead.',
      );
      return;
    }

    this.transporter = nodemailer.createTransport({
      host: emailHost,
      port: emailPort,
      secure: false,
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    });
  }

  async sendPasswordResetEmail(
    email: string,
    token: string,
    userName: string,
  ): Promise<void> {
    const appUrl = this.configService.get<string>('APP_URL') || 'http://localhost:3000';
    const resetLink = `${appUrl}/reset-password?token=${token}`;

    // Log sempre o link para depuração (útil em DEV ou se SMTP falhar)
    this.logger.log(`[PASSWORD_RESET] target=${email} link=${resetLink}`);
    
    const htmlContent = `
      <html>
        <body style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h2 style="color: #333; margin-bottom: 20px;">Recuperação de Senha</h2>
            
            <p style="color: #666; font-size: 14px; margin-bottom: 20px;">
              Olá <strong>${userName}</strong>,
            </p>
            
            <p style="color: #666; font-size: 14px; margin-bottom: 20px;">
              Recebemos uma solicitação para redefinir sua senha. Clique no botão abaixo para criar uma nova senha. <strong>Este link expira em 15 minutos.</strong>
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetLink}" style="display: inline-block; background-color: #007bff; color: white; text-decoration: none; padding: 12px 30px; border-radius: 4px; font-weight: bold;">
                Redefinir Senha
              </a>
            </div>
            
            <p style="color: #666; font-size: 13px; margin-bottom: 20px;">
              Ou copie e cole este link no seu navegador:<br/>
              <code style="background-color: #f0f0f0; padding: 8px; border-radius: 4px; word-break: break-all;">${resetLink}</code>
            </p>
            
            <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;">
            
            <p style="color: #999; font-size: 12px;">
              Se você não solicitou esta recuperação de senha, ignore este email. Sua conta está segura.
            </p>
            
            <p style="color: #999; font-size: 12px; margin-top: 20px;">
              DoeCerto Team
            </p>
          </div>
        </body>
      </html>
    `;

    const mailOptions = {
      from: this.configService.get<string>('EMAIL_FROM') || 'noreply@doecerto.com',
      to: email,
      subject: 'Recuperação de Senha - DoeCerto',
      html: htmlContent,
      text: `Clique no link para recuperar sua senha: ${resetLink}\n\nEste link expira em 15 minutos.`,
    };

    try {
      if (!this.transporter) {
        this.logger.log(`[DEV MODE] Reset email para ${email}\nLink: ${resetLink}`);
        return;
      }

      await this.transporter.sendMail(mailOptions);
      this.logger.log(`Password reset email sent to ${email}`);
    } catch (error) {
      this.logger.error(`Failed to send password reset email to ${email}:`, error);
      throw error;
    }
  }

  async sendTestEmail(email: string): Promise<void> {
    const mailOptions = {
      from: this.configService.get<string>('EMAIL_FROM') || 'noreply@doecerto.com',
      to: email,
      subject: 'Email de Teste - DoeCerto',
      html: '<p>Este é um email de teste do sistema DoeCerto</p>',
    };

    try {
      if (!this.transporter) {
        this.logger.log(`[DEV MODE] Test email para ${email}`);
        return;
      }

      await this.transporter.sendMail(mailOptions);
      this.logger.log(`Test email sent to ${email}`);
    } catch (error) {
      this.logger.error(`Failed to send test email to ${email}:`, error);
      throw error;
    }
  }
}
