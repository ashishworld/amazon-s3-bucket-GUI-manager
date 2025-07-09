import React, { useState } from 'react';
import { Key, Globe, Database, Eye, EyeOff } from 'lucide-react';
import { S3Credentials } from '../types';

interface CredentialsFormProps {
  onConnect: (credentials: S3Credentials) => void;
  loading: boolean;
  error: string | null;
}

const CredentialsForm: React.FC<CredentialsFormProps> = ({ onConnect, loading, error }) => {
  const [credentials, setCredentials] = useState<S3Credentials>({
    accessKeyId: '',
    secretAccessKey: '',
    region: 'us-east-1',
    bucketName: '',
  });
  
  const [showSecret, setShowSecret] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConnect(credentials);
  };

  const handleChange = (field: keyof S3Credentials, value: string) => {
    setCredentials(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 max-w-md mx-auto">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 text-center">
        Connect to S3 Bucket
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <Key className="inline h-4 w-4 mr-1" />
            Access Key ID
          </label>
          <input
            type="text"
            value={credentials.accessKeyId}
            onChange={(e) => handleChange('accessKeyId', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="AKIA..."
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <Key className="inline h-4 w-4 mr-1" />
            Secret Access Key
          </label>
          <div className="relative">
            <input
              type={showSecret ? 'text' : 'password'}
              value={credentials.secretAccessKey}
              onChange={(e) => handleChange('secretAccessKey', e.target.value)}
              className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Enter secret key"
              required
            />
            <button
              type="button"
              onClick={() => setShowSecret(!showSecret)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 dark:text-gray-300"
            >
              {showSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <Globe className="inline h-4 w-4 mr-1" />
            Region
          </label>
          <select
            value={credentials.region}
            onChange={(e) => handleChange('region', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="us-east-1">US East (N. Virginia)</option>
            <option value="us-east-2">US East (Ohio)</option>
            <option value="us-west-1">US West (N. California)</option>
            <option value="us-west-2">US West (Oregon)</option>
            <option value="af-south-1">Africa (Cape Town)</option>
            <option value="ap-east-1">Asia Pacific (Hong Kong)</option>
            <option value="ap-south-1">Asia Pacific (Mumbai)</option>
            <option value="ap-south-2">Asia Pacific (Hyderabad)</option>
            <option value="ap-southeast-1">Asia Pacific (Singapore)</option>
            <option value="ap-southeast-2">Asia Pacific (Sydney)</option>
            <option value="ap-southeast-3">Asia Pacific (Jakarta)</option>
            <option value="ap-southeast-4">Asia Pacific (Melbourne)</option>
            <option value="ap-northeast-1">Asia Pacific (Tokyo)</option>
            <option value="ap-northeast-2">Asia Pacific (Seoul)</option>
            <option value="ap-northeast-3">Asia Pacific (Osaka)</option>
            <option value="ca-central-1">Canada (Central)</option>
            <option value="ca-west-1">Canada (Calgary)</option>
            <option value="eu-central-1">Europe (Frankfurt)</option>
            <option value="eu-central-2">Europe (Zurich)</option>
            <option value="eu-west-1">Europe (Ireland)</option>
            <option value="eu-west-2">Europe (London)</option>
            <option value="eu-west-3">Europe (Paris)</option>
            <option value="eu-north-1">Europe (Stockholm)</option>
            <option value="eu-south-1">Europe (Milan)</option>
            <option value="eu-south-2">Europe (Spain)</option>
            <option value="il-central-1">Israel (Tel Aviv)</option>
            <option value="me-south-1">Middle East (Bahrain)</option>
            <option value="me-central-1">Middle East (UAE)</option>
            <option value="sa-east-1">South America (São Paulo)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <Database className="inline h-4 w-4 mr-1" />
            Bucket Name
          </label>
          <input
            type="text"
            value={credentials.bucketName}
            onChange={(e) => handleChange('bucketName', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="my-bucket-name"
            required
          />
        </div>

        {error && (
          <div className="text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-md">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Connecting...' : 'Connect to Bucket'}
        </button>
      </form>
    </div>
  );
};

export default CredentialsForm;