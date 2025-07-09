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
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
      <div className="flex flex-wrap gap-4">
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={loading}
          className="flex items-center space-x-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-md disabled:opacity-50"
        >
          <Upload className="h-4 w-4" />
          <span>Upload Files</span>
        </button>

        <button
          onClick={handleFolderCreate}
          disabled={loading}
          className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md disabled:opacity-50"
        >
          <FolderPlus className="h-4 w-4" />
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