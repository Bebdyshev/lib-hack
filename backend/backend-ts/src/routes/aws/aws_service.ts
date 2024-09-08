import { S3, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import mime from 'mime-types';

export class AwsService {
    private s3: S3;

    constructor() {
        this.s3 = new S3({
            region: process.env.AWS_REGION,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
            }
        });
    }

    public async uploadFile(bucketName: string, file: Buffer | Uint8Array | Blob | string, fileName: string): Promise<string> {
        const mimeType = mime.lookup(fileName) || 'application/octet-stream';

        const uniqueFilename = `/hack-the-bookshelf/${uuidv4()}_${Date.now()}_${fileName}`;

        const command = new PutObjectCommand({
            Bucket: bucketName,
            Key: uniqueFilename,
            Body: file,
            ContentType: mimeType
        });

        try {
            await this.s3.send(command);
            const fileUrl = `https://${bucketName}.s3.amazonaws.com/${uniqueFilename}`;
            return fileUrl;
        } catch (error) {
            console.error('Error uploading file:', error);
            throw error;
        }
    }
}
