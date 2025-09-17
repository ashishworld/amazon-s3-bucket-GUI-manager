import React, { useRef } from 'react';
import { Upload, FolderPlus } from 'lucide-react';

interface FileUploadProps {
  onFileUpload: (file: File, key: string) => void;
  onCreateFolder: (folderName: string) => void;
  loading: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload, onCreateFolder, loading }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      Array.from(files).forEach(file => {
        onFileUpload(file, file.name);
      });
    }
  };

  const handleFolderCreate = () => {
    const folderName = prompt('Enter folder name:');
    if (folderName && folderName.trim()) {
      onCreateFolder(folderName.trim());
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6 border border-gray-100 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
        <Upload className="h-5 w-5 mr-2 text-primary-600" />
        Quick Actions
      </h3>
      <div className="flex flex-wrap gap-4">
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={loading}
          className="flex items-center space-x-3 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg shadow-md hover:shadow-lg transition-all disabled:opacity-50 font-medium"
        >
          <Upload className="h-5 w-5" />
          <span>Upload Files</span>
        </button>

        <button
          onClick={handleFolderCreate}
          disabled={loading}
          className="flex items-center space-x-3 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg shadow-md hover:shadow-lg transition-all disabled:opacity-50 font-medium"
        >
          <FolderPlus className="h-5 w-5" />
          <span>Create Folder</span>
        </button>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>
    </div>
  );
};

export default FileUpload;