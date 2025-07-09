import React, { useState, useCallback } from 'react';
import { s3Service } from '../services/s3Service';
import { S3Credentials, S3Object, BucketInfo } from '../types';

export const useS3 = () => {
  const [objects, setObjects] = useState<S3Object[]>([]);
  const [bucketInfo, setBucketInfo] = useState<BucketInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(() => {
    return sessionStorage.getItem('s3-connected') === 'true';
  });
  const [credentials, setCredentials] = useState<S3Credentials | null>(() => {
    const saved = sessionStorage.getItem('s3-credentials');
    return saved ? JSON.parse(saved) : null;
  });

  const connect = useCallback(async (newCredentials: S3Credentials) => {
    setLoading(true);
    setError(null);
    
    try {
      s3Service.configure(newCredentials);
      await s3Service.testConnection();
      
      const [objectsList, info] = await Promise.all([
        s3Service.listObjects(),
        s3Service.getBucketInfo()
      ]);
      
      setObjects(objectsList);
      setBucketInfo(info);
      setCredentials(newCredentials);
      setIsConnected(true);
      
      sessionStorage.setItem('s3-credentials', JSON.stringify(newCredentials));
      sessionStorage.setItem('s3-connected', 'true');
    } catch (err) {
      let errorMessage = 'Failed to connect to S3';
      if (err instanceof Error) {
        if (err.message.includes('InvalidAccessKeyId')) {
          errorMessage = 'Invalid Access Key ID';
        } else if (err.message.includes('SignatureDoesNotMatch')) {
          errorMessage = 'Invalid Secret Access Key';
        } else if (err.message.includes('NoSuchBucket')) {
          errorMessage = 'Bucket not found or access denied';
        } else if (err.message.includes('NetworkingError') || err.message.includes('fetch')) {
          errorMessage = 'Network error. Check your internet connection and credentials.';
        } else {
          errorMessage = err.message;
        }
      }
      setError(errorMessage);
      setIsConnected(false);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshObjects = useCallback(async () => {
    if (!isConnected) return;
    
    setLoading(true);
    try {
      const [objectsList, info] = await Promise.all([
        s3Service.listObjects(),
        s3Service.getBucketInfo()
      ]);
      setObjects(objectsList);
      setBucketInfo(info);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh objects');
    } finally {
      setLoading(false);
    }
  }, [isConnected]);

  const deleteObject = useCallback(async (key: string) => {
    try {
      await s3Service.deleteObject(key);
      await refreshObjects();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete object');
    }
  }, [refreshObjects]);

  const getDownloadUrl = useCallback(async (key: string) => {
    try {
      return await s3Service.getDownloadUrl(key);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get download URL');
      return null;
    }
  }, []);

  const uploadFile = useCallback(async (file: File, key: string) => {
    try {
      await s3Service.uploadFile(file, key);
      await refreshObjects();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload file');
    }
  }, [refreshObjects]);

  const createFolder = useCallback(async (folderName: string) => {
    try {
      await s3Service.createFolder(folderName);
      await refreshObjects();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create folder');
    }
  }, [refreshObjects]);

  const renameObject = useCallback(async (oldKey: string, newKey: string) => {
    try {
      await s3Service.renameObject(oldKey, newKey);
      await refreshObjects();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to rename object');
    }
  }, [refreshObjects]);

  const disconnect = useCallback(() => {
    setObjects([]);
    setBucketInfo(null);
    setCredentials(null);
    setIsConnected(false);
    setError(null);
    sessionStorage.removeItem('s3-credentials');
    sessionStorage.removeItem('s3-connected');
  }, []);

  // Auto-reconnect on page load if credentials exist
  React.useEffect(() => {
    if (credentials && !isConnected) {
      connect(credentials);
    }
  }, [credentials, isConnected, connect]);

  return {
    objects,
    bucketInfo,
    loading,
    error,
    isConnected,
    connect,
    refreshObjects,
    deleteObject,
    getDownloadUrl,
    disconnect,
    uploadFile,
    createFolder,
    renameObject,
  };
};