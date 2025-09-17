import { S3Client, ListObjectsV2Command, DeleteObjectCommand, GetObjectCommand, PutObjectCommand, CopyObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { S3Credentials, S3Object, BucketInfo } from '../types';

class S3Service {
  private client: S3Client | null = null;
  private credentials: S3Credentials | null = null;

  configure(credentials: S3Credentials): void {
    this.credentials = credentials;
    this.client = new S3Client({
      region: credentials.region,
      credentials: {
        accessKeyId: credentials.accessKeyId,
        secretAccessKey: credentials.secretAccessKey,
      }
    });
  }

  async listObjects(): Promise<S3Object[]> {
    if (!this.client || !this.credentials) {
      throw new Error('S3 client not configured');
    }

    const command = new ListObjectsV2Command({
      Bucket: this.credentials.bucketName,
    });

    const response = await this.client.send(command);
    
    return (response.Contents || []).map(obj => ({
      key: obj.Key || '',
      size: obj.Size || 0,
      lastModified: obj.LastModified || new Date(),
      etag: obj.ETag || '',
    }));
  }

  async deleteObject(key: string): Promise<void> {
    if (!this.client || !this.credentials) {
      throw new Error('S3 client not configured');
    }

    const command = new DeleteObjectCommand({
      Bucket: this.credentials.bucketName,
      Key: key,
    });

    await this.client.send(command);
  }

  async getDownloadUrl(key: string): Promise<string> {
    if (!this.client || !this.credentials) {
      throw new Error('S3 client not configured');
    }

    try {
      const command = new GetObjectCommand({
        Bucket: this.credentials.bucketName,
        Key: key,
      });

      const url = await getSignedUrl(this.client, command, { 
        expiresIn: 3600,
      });
      
      console.log('Generated pre-signed URL:', url);
      return url;
    } catch (error) {
      console.error('Error generating pre-signed URL:', error);
      throw error;
    }
  }

  async testConnection(): Promise<boolean> {
    if (!this.client || !this.credentials) {
      throw new Error('S3 client not configured');
    }

    try {
      const command = new ListObjectsV2Command({
        Bucket: this.credentials.bucketName,
        MaxKeys: 1,
      });
      await this.client.send(command);
      return true;
    } catch (error) {
      throw error;
    }
  }

  async uploadFile(file: File, key: string): Promise<void> {
    if (!this.client || !this.credentials) {
      throw new Error('S3 client not configured');
    }

    const command = new PutObjectCommand({
      Bucket: this.credentials.bucketName,
      Key: key,
      Body: file,
      ContentType: file.type,
    });

    await this.client.send(command);
  }

  async createFolder(folderName: string): Promise<void> {
    if (!this.client || !this.credentials) {
      throw new Error('S3 client not configured');
    }

    const command = new PutObjectCommand({
      Bucket: this.credentials.bucketName,
      Key: folderName.endsWith('/') ? folderName : folderName + '/',
      Body: '',
    });

    await this.client.send(command);
  }

  async renameObject(oldKey: string, newKey: string): Promise<void> {
    if (!this.client || !this.credentials) {
      throw new Error('S3 client not configured');
    }

    const copyCommand = new CopyObjectCommand({
      Bucket: this.credentials.bucketName,
      CopySource: `${this.credentials.bucketName}/${oldKey}`,
      Key: newKey,
    });

    await this.client.send(copyCommand);
    await this.deleteObject(oldKey);
  }

  async getBucketInfo(): Promise<BucketInfo> {
    const objects = await this.listObjects();
    const totalSize = objects.reduce((sum, obj) => sum + obj.size, 0);

    return {
      name: this.credentials?.bucketName || '',
      region: this.credentials?.region || '',
      objectCount: objects.length,
      totalSize,
    };
  }
}

export const s3Service = new S3Service();