import CryptoJS from 'crypto-js';

// Encryption key - in production, this should be from environment variables
const ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY || 'your-secret-encryption-key-change-in-production';

export class EncryptionService {
  private static key = CryptoJS.enc.Utf8.parse(ENCRYPTION_KEY);
  
  /**
   * Encrypt sensitive data
   */
  static encrypt(data: string): string {
    try {
      const iv = CryptoJS.lib.WordArray.random(16);
      const encrypted = CryptoJS.AES.encrypt(data, this.key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      });
      
      // Combine IV and encrypted data
      const combined = iv.concat(encrypted.ciphertext);
      return CryptoJS.enc.Base64.stringify(combined);
    } catch (error) {
      console.error('Encryption error:', error);
      throw new Error('Failed to encrypt data');
    }
  }
  
  /**
   * Decrypt sensitive data
   */
  static decrypt(encryptedData: string): string {
    try {
      const combined = CryptoJS.enc.Base64.parse(encryptedData);
      const iv = CryptoJS.lib.WordArray.create(combined.words.slice(0, 4));
      const ciphertext = CryptoJS.lib.WordArray.create(combined.words.slice(4));
      
      const decrypted = CryptoJS.AES.decrypt(
        { ciphertext: ciphertext } as any,
        this.key,
        {
          iv: iv,
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7
        }
      );
      
      return decrypted.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      console.error('Decryption error:', error);
      throw new Error('Failed to decrypt data');
    }
  }
  
  /**
   * Hash password using bcrypt-like algorithm
   */
  static hashPassword(password: string): string {
    const salt = CryptoJS.lib.WordArray.random(16);
    const hash = CryptoJS.PBKDF2(password, salt, {
      keySize: 256/32,
      iterations: 10000
    });
    
    return CryptoJS.enc.Base64.stringify(salt.concat(hash));
  }
  
  /**
   * Verify password against hash
   */
  static verifyPassword(password: string, hash: string): boolean {
    try {
      const combined = CryptoJS.enc.Base64.parse(hash);
      const salt = CryptoJS.lib.WordArray.create(combined.words.slice(0, 4));
      const originalHash = CryptoJS.lib.WordArray.create(combined.words.slice(4));
      
      const computedHash = CryptoJS.PBKDF2(password, salt, {
        keySize: 256/32,
        iterations: 10000
      });
      
      return originalHash.toString() === computedHash.toString();
    } catch (error) {
      console.error('Password verification error:', error);
      return false;
    }
  }
  
  /**
   * Generate secure random token
   */
  static generateToken(length: number = 32): string {
    return CryptoJS.lib.WordArray.random(length).toString();
  }
  
  /**
   * Generate OTP code
   */
  static generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
}