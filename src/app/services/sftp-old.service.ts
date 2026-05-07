import { Injectable } from '@nestjs/common';
import * as SftpClient from 'ssh2-sftp-client';
// import { fileTypeFromBuffer } from 'file-type';
import { lookup } from 'mime-types';

@Injectable()
export class SftpService {
    private readonly host = process.env.FTP_HOST;
    private readonly port = Number(process.env.FTP_PORT);
    private readonly user = process.env.FTP_USERNAME;
    private readonly password = process.env.FTP_PASSWORD;
    private config = {
        host: this.host,
        port: this.port,
        user: this.user,
        password: this.password,
        keepalive: true,
        timeout: 120000 // 2 นาที
    }

    async uploadFile(localFilePath: string, remoteFilePath: string): Promise<void> {
        const sftp = new SftpClient();
        try {
            await sftp.connect(this.config);
            await sftp.fastPut(localFilePath, remoteFilePath);
        } catch (error) {
            if (error.code === 'ECONNRESET') {
                console.error('Connection reset. Retrying...');
                await this.uploadFile(localFilePath, remoteFilePath); // ลองอัปโหลดใหม่
            } else {
                console.error('Error uploading file:', error);
            }
            console.error('Error uploading file:', error);
            throw error;
        }
    }

    async deleteFile(remotePath: string): Promise<void> {
        const sftp = new SftpClient();
        try {
            await sftp.connect(this.config);
            const exists = await sftp.exists(remotePath);
            if (exists) {
                await sftp.delete(remotePath);
                // throw new Error(`File does not exist: ${remotePath}`);
            }
            
        } catch (error) {
            throw new Error(`Failed to delete file: ${error.message}`);
        }
    }

    async downloadFileAsBase64(remoteFilePath: string): Promise<string> {
        const sftp = new SftpClient();
        try {
            await sftp.connect(this.config);
            const fileBuffer: Buffer = await sftp.get(remoteFilePath);
            return fileBuffer.toString('base64');
        } catch (error) {
            throw error;
        }
    }

    async downloadFileAsBase64AndType(remoteFilePath: string): Promise<string> {
        const sftp = new SftpClient();
        try {
            await sftp.connect(this.config);
            const fileBuffer: Buffer = await sftp.get(remoteFilePath);

            // ตรวจสอบ MIME type จากส่วนขยายไฟล์
            const mimeType = lookup(remoteFilePath) || 'application/octet-stream';

            // สร้าง Base64 พร้อม MIME type
            return `data:${mimeType};base64,${fileBuffer.toString('base64')}`;
        } catch (error) {
            throw error
        }
        // const sftp = new SftpClient();
        // try {
        //   await sftp.connect(this.config);
        //   const fileBuffer: Buffer = await sftp.get(remoteFilePath);

        //   const fileType = await fileTypeFromBuffer(fileBuffer);

        //     if (!fileType) {
        //     throw new Error('Could not determine file type');
        //     }
        //     return `data:${fileType.mime};base64,${fileBuffer.toString('base64')}`;
        // //   return fileBuffer.toString('base64');
        // } catch (error) {
        //   throw error;
        // }
    }


}
