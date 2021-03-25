import crypto from 'crypto';

const ENCRYPT_ALGORITHM = 'aes-256-ctr';

class SecretsHelper {
  private static instance: SecretsHelper;

  private readonly key: string;

  private constructor() {
    SecretsHelper.instance = this;

    this.key = crypto
      .createHash('sha256')
      .update(String(process.env.SECRETS_KEY))
      .digest('base64')
      .substr(0, 32);
  }

  public static get() {
    return SecretsHelper.instance ?? new SecretsHelper();
  }

  public encrypt(string: string) {
    // Create an initialization vector
    const iv = crypto.randomBytes(16);
    // Create a new cipher using the algorithm, key, and iv
    const cipher = crypto.createCipheriv(ENCRYPT_ALGORITHM, this.key, iv);
    // Create the new (encrypted) buffer
    return Buffer.concat([
      iv,
      cipher.update(Buffer.from(string)),
      cipher.final(),
    ]);
  }

  public decrypt(encrypted: Buffer) {
    // Get the iv: the first 16 bytes
    const iv = encrypted.slice(0, 16);
    // Get the rest
    encrypted = encrypted.slice(16);
    // Create a decipher
    const decipher = crypto.createDecipheriv(ENCRYPT_ALGORITHM, this.key, iv);
    // Actually decrypt it
    return Buffer.concat([
      decipher.update(encrypted),
      decipher.final(),
    ]).toString();
  }
}

export default SecretsHelper;
