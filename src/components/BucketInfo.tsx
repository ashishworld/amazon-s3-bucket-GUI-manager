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
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-xl shadow-lg p-6 mb-6 border border-blue-100 dark:border-gray-600">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
        <Database className="h-6 w-6 mr-3 text-primary-600" />
        Bucket Dashboard
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="text-center p-5 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100 dark:border-gray-600">
          <div className="bg-blue-100 dark:bg-blue-900 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
            <Database className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Bucket Name</div>
          <div className="font-bold text-gray-900 dark:text-white text-sm truncate">{bucketInfo.name}</div>
        </div>
        
        <div className="text-center p-5 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100 dark:border-gray-600">
          <div className="bg-green-100 dark:bg-green-900 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
            <MapPin className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Region</div>
          <div className="font-bold text-gray-900 dark:text-white text-sm">{bucketInfo.region}</div>
        </div>
        
        <div className="text-center p-5 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100 dark:border-gray-600">
          <div className="bg-purple-100 dark:bg-purple-900 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
            <FileText className="h-8 w-8 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Total Objects</div>
          <div className="font-bold text-gray-900 dark:text-white text-lg">{bucketInfo.objectCount.toLocaleString()}</div>
        </div>
        
        <div className="text-center p-5 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100 dark:border-gray-600">
          <div className="bg-orange-100 dark:bg-orange-900 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
            <HardDrive className="h-8 w-8 text-orange-600 dark:text-orange-400" />
          </div>
          <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Storage Used</div>
          <div className="font-bold text-gray-900 dark:text-white text-lg">{formatSize(bucketInfo.totalSize)}</div>
        </div>
      </div>
    </div>
  );
};

export default BucketInfo;