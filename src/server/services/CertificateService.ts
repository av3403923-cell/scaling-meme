import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import { spawn } from 'child_process';
import logger from '../utils/logger';

interface CertificateInfo {
  id: string;
  domain: string;
  certPath: string;
  keyPath: string;
  expiresAt: Date;
  createdAt: Date;
  fingerprint: string;
}

export class CertificateService {
  private certDir: string;
  private certificates: Map<string, CertificateInfo> = new Map();

  constructor() {
    this.certDir = path.join(process.cwd(), 'certs');
    this.ensureCertDir();
  }

  private ensureCertDir() {
    if (!fs.existsSync(this.certDir)) {
      fs.mkdirSync(this.certDir, { recursive: true });
    }
  }

  async generateCertificate(domain: string): Promise<CertificateInfo> {
    return new Promise((resolve, reject) => {
      const certName = domain.replace(/\*/g, 'wildcard');
      const keyPath = path.join(this.certDir, `${certName}.key`);
      const certPath = path.join(this.certDir, `${certName}.crt`);

      const openssl = spawn('openssl', [
        'req',
        '-x509',
        '-newkey',
        'rsa:2048',
        '-keyout',
        keyPath,
        '-out',
        certPath,
        '-days',
        '365',
        '-nodes',
        '-subj',
        `/CN=${domain}`,
      ]);

      openssl.on('close', (code) => {
        if (code === 0) {
          const certInfo: CertificateInfo = {
            id: crypto.randomUUID(),
            domain,
            certPath,
            keyPath,
            expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
            createdAt: new Date(),
            fingerprint: this.generateFingerprint(domain),
          };
          this.certificates.set(domain, certInfo);
          logger.info(`Certificate generated for ${domain}`);
          resolve(certInfo);
        } else {
          reject(new Error('Failed to generate certificate'));
        }
      });
    });
  }

  private generateFingerprint(domain: string): string {
    return crypto.createHash('sha256').update(domain).digest('hex');
  }

  getCertificate(domain: string): CertificateInfo | null {
    return this.certificates.get(domain) || null;
  }

  getAllCertificates(): CertificateInfo[] {
    return Array.from(this.certificates.values());
  }

  deleteCertificate(domain: string): boolean {
    const cert = this.certificates.get(domain);
    if (cert) {
      if (fs.existsSync(cert.certPath)) fs.unlinkSync(cert.certPath);
      if (fs.existsSync(cert.keyPath)) fs.unlinkSync(cert.keyPath);
      this.certificates.delete(domain);
      logger.info(`Certificate deleted for ${domain}`);
      return true;
    }
    return false;
  }
}

export const certificateService = new CertificateService();