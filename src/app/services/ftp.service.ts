import { Injectable } from '@nestjs/common';
import * as ftp from 'basic-ftp';

@Injectable()
export class FtpService {
  private readonly host = process.env.FTP_HOST;
  private readonly port = Number(process.env.FTP_PORT);
  private readonly user = process.env.FTP_USERNAME;
  private readonly password = process.env.FTP_PASSWORD;

  async uploadFile(localFilePath: string, remoteFilePath: string): Promise<void> {
    const client = new ftp.Client();
    client.ftp.verbose = true;

    try {
      await client.access({
        host: this.host,
        port: this.port,
        user: this.user,
        password: this.password,
        secure: true,
        secureOptions: { rejectUnauthorized: false }
      });
      await client.uploadFrom(localFilePath, remoteFilePath);
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    } finally {
      client.close();
    }
  }

  
}
