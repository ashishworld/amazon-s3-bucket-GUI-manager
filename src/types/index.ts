export interface S3Credentials {
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
  bucketName: string;
}

export interface S3Object {
  key: string;
  size: number;
  lastModified: Date;
  etag: string;
}

export interface BucketInfo {
  name: string;
  region: string;
  objectCount: number;
  totalSize: number;
}