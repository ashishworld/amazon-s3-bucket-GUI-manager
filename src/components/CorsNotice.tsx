import React, { useState } from 'react';
import { AlertTriangle, X, Copy, Check } from 'lucide-react';

const CorsNotice: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [copied, setCopied] = useState(false);

  const corsPolicy = `[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
    "AllowedOrigins": ["*"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3000
  }
]`;

  const handleCopy = () => {
    navigator.clipboard.writeText(corsPolicy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isVisible) return null;

  return (
    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
              Setup Required: IAM Permissions & CORS Configuration
            </h3>
            <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-3">
              <strong>Step 1:</strong> Create IAM user with S3 permissions, then <strong>Step 2:</strong> Add CORS policy to your bucket:
            </p>
            <div className="bg-gray-800 dark:bg-gray-900 rounded-md p-3 relative">
              <pre className="text-xs text-green-400 overflow-x-auto">
                <code>{corsPolicy}</code>
              </pre>
              <button
                onClick={handleCopy}
                className="absolute top-2 right-2 p-1 text-gray-400 hover:text-white rounded"
                title="Copy to clipboard"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
            <div className="text-xs text-yellow-600 dark:text-yellow-400 mt-2 space-y-1">
              <p><strong>IAM Setup:</strong> AWS Console → IAM → Users → Create user → Attach policy</p>
              <p><strong>CORS Setup:</strong> S3 Bucket → Permissions → CORS → Edit</p>
              <p><strong>Full instructions:</strong> Check README.md on GitHub</p>
            </div>
          </div>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="text-yellow-600 dark:text-yellow-400 hover:text-yellow-800 dark:hover:text-yellow-200 ml-2"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default CorsNotice;