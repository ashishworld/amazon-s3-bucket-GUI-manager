import React from 'react';
import { Database, MapPin, FileText, HardDrive } from 'lucide-react';
import { BucketInfo as BucketInfoType } from '../types';

interface BucketInfoProps {
  bucketInfo: BucketInfoType;
}

const BucketInfo: React.FC<BucketInfoProps> = ({ bucketInfo }) => {
  const formatSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
        <Database className="h-5 w-5 mr-2 text-primary-600" />
        Bucket Information
      </h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <Database className="h-8 w-8 mx-auto text-primary-600 mb-2" />
          <div className="text-sm text-gray-600 dark:text-gray-400">Bucket Name</div>
          <div className="font-semibold text-gray-900 dark:text-white">{bucketInfo.name}</div>
        </div>
        
        <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <MapPin className="h-8 w-8 mx-auto text-green-600 mb-2" />
          <div className="text-sm text-gray-600 dark:text-gray-400">Region</div>
          <div className="font-semibold text-gray-900 dark:text-white">{bucketInfo.region}</div>
        </div>
        
        <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <FileText className="h-8 w-8 mx-auto text-blue-600 mb-2" />
          <div className="text-sm text-gray-600 dark:text-gray-400">Objects</div>
          <div className="font-semibold text-gray-900 dark:text-white">{bucketInfo.objectCount}</div>
        </div>
        
        <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <HardDrive className="h-8 w-8 mx-auto text-purple-600 mb-2" />
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Size</div>
          <div className="font-semibold text-gray-900 dark:text-white">{formatSize(bucketInfo.totalSize)}</div>
        </div>
      </div>
    </div>
  );
};

export default BucketInfo;