import { Injectable, InternalServerErrorException } from '@nestjs/common';
// import { fileTypeFromBuffer } from 'file-type';
import { lookup } from 'mime-types';
import { promises as fs } from 'fs';
import { dirname, join } from 'path';

@Injectable()
export class FilesService {
    async uploadFile(localFilePath: string, remoteFilePath: string): Promise<void> {
        const finalRemotePath = join(__dirname, '..', '..', '..', remoteFilePath);
        try {
            // ตรวจสอบและสร้าง directory ปลายทางหากไม่มีอยู่
            const destinationDir = dirname(finalRemotePath);
            await fs.mkdir(destinationDir, { recursive: true });

            // ย้ายไฟล์จาก localFilePath ไปยัง remoteFilePath
            await fs.rename(localFilePath, finalRemotePath);
            
        } catch (error) {
            throw new InternalServerErrorException(`error :  ${error}`);
        }
    }

    async deleteFile(remotePath: string): Promise<void> {
        try {
            // สร้าง path ที่สมบูรณ์ (absolute path) ไปยังไฟล์ที่ต้องการลบ
            const filePath = join(__dirname, '..', '..', '..', remotePath);
            await fs.unlink(filePath);
        } catch (error) {
            // จัดการข้อผิดพลาด เช่น ไฟล์ไม่พบ, ไม่มีสิทธิ์ลบ
            if (error.code === 'ENOENT') {
                throw new InternalServerErrorException(`Failed to delete file: File not found at ${remotePath}`)
            }
            throw new InternalServerErrorException(`Failed to delete file: ${error.message}`)
        }
    }

    async downloadFileAsBase64(remoteFilePath: string): Promise<string> {
        try {
            const filePath = join(__dirname, '..', '..', '..', remoteFilePath); 
            const fileBuffer: Buffer = await fs.readFile(filePath);
            return fileBuffer.toString('base64');
        } catch (error) {
            if (error.code === 'ENOENT') {
                throw new InternalServerErrorException(`Failed to read file: File not found at ${remoteFilePath}`);
            }
            throw new InternalServerErrorException(`Failed to read file: ${error.message}`);
        }
    }

    async downloadFileAsBase64AndType(remoteFilePath: string): Promise<string> {
        try {
            // สร้าง path ที่สมบูรณ์ (absolute path) ไปยังไฟล์ในโปรเจกต์
            const filePath = join(__dirname, '..', '..', '..', remoteFilePath);
            const fileBuffer: Buffer = await fs.readFile(filePath);
            const mimeType = lookup(filePath) || 'application/octet-stream';
            return `data:${mimeType};base64,${fileBuffer.toString('base64')}`;
        } catch (error) {
            if (error.code === 'ENOENT') {
                throw new InternalServerErrorException(`File not found: ${remoteFilePath}`);
            }
            throw new InternalServerErrorException(`Failed to read file: ${error.message}`);
        }
    }

    async downloadFileAsBuffer(remoteFilePath: string) {
        try {
            const filePath = join(__dirname, '..', '..', '..', remoteFilePath);
            const fileBuffer: Buffer = await fs.readFile(filePath);
            const mimeType = lookup(filePath) || 'application/octet-stream';
            return { fileBuffer, mimeType };

        } catch (error) {
            if (error.code === 'ENOENT') {
                throw new InternalServerErrorException(`Failed to read file: File not found at ${remoteFilePath}`);
            }
            throw new InternalServerErrorException(`Failed to read file: ${error.message}`);
        }
    }


}



// import { Injectable } from '@nestjs/common';
// import * as SftpClient from 'ssh2-sftp-client';
// // import { fileTypeFromBuffer } from 'file-type';
// import { lookup } from 'mime-types';
// import { ConfigService } from '@nestjs/config';

// @Injectable()
// export class SftpService {
//     private config: any;
//     constructor(
//         private configService: ConfigService
//     ) {
//         this.config = {
//             host: this.configService.get<string>('FTP_HOST'),
//             port: Number(this.configService.get<string>('FTP_PORT')),
//             user: this.configService.get<string>('FTP_USERNAME'),
//             password: this.configService.get<string>('FTP_PASSWORD'),
//             keepalive: true,
//             timeout: 120000,
//         };
//     }

//     async uploadFile(localFilePath: string, remoteFilePath: string): Promise<void> {
//         const sftp = new SftpClient();
//         try {
//             await sftp.connect(this.config);
//             await sftp.fastPut(localFilePath, remoteFilePath);
//         } catch (error) {
//             if (error.code === 'ECONNRESET') {
//                 console.error('Connection reset. Retrying...');
//                 await this.uploadFile(localFilePath, remoteFilePath); // ลองอัปโหลดใหม่
//             } else {
//                 console.error('Error uploading file:', error);
//             }
//             console.error('Error uploading file:', error);
//             throw error;
//         }
//     }

//     async deleteFile(remotePath: string): Promise<void> {
//         const sftp = new SftpClient();
//         try {
//             await sftp.connect(this.config);
//             await sftp.delete(remotePath);
//         } catch (error) {
//             throw new Error(`Failed to delete file: ${error.message}`);
//         }
//     }

//     async downloadFileAsBase64(remoteFilePath: string): Promise<string> {
//         const sftp = new SftpClient();
//         try {
//             await sftp.connect(this.config);
//             const fileBuffer: Buffer = await sftp.get(remoteFilePath);
//             return fileBuffer.toString('base64');
//         } catch (error) {
//             throw error;
//         }
//     }

//     async downloadFileAsBase64AndType(remoteFilePath: string): Promise<string> {
//         const sftp = new SftpClient();
//         try {
//             await sftp.connect(this.config);
//             const fileBuffer: Buffer = await sftp.get(remoteFilePath);

//             // ตรวจสอบ MIME type จากส่วนขยายไฟล์
//             const mimeType = lookup(remoteFilePath) || 'application/octet-stream';

//             // สร้าง Base64 พร้อม MIME type
//             return `data:${mimeType};base64,${fileBuffer.toString('base64')}`;
//         } catch (error) {
//             throw error
//         }
//     }

//     async downloadFileAsBuffer(remoteFilePath: string) {
//         const sftp = new SftpClient();
//         try {
//             await sftp.connect(this.config);
//             const fileBuffer: Buffer = await sftp.get(remoteFilePath);
//             const mimeType = lookup(remoteFilePath) || 'application/octet-stream';
//             return { fileBuffer, mimeType }
//         } catch (error) {
//             throw error
//         }
//     }


// }
