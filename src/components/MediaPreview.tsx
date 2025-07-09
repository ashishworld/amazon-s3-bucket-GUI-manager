import React, { useState, useEffect } from 'react';
import { X, Download } from 'lucide-react';

interface MediaPreviewProps {
  fileKey: string;
  fileName: string;
  onClose: () => void;
  onDownload: (key: string) => void;
  getDownloadUrl: (key: string) => Promise<string | null>;
}

const MediaPreview: React.FC<MediaPreviewProps> = ({ 
  fileKey, 
  fileName, 
  onClose, 
  onDownload,
  getDownloadUrl 
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPreview = async () => {
      try {
        const url = await getDownloadUrl(fileKey);
        setPreviewUrl(url);
      } catch (error) {
        console.error('Failed to load preview:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPreview();
  }, [fileKey, getDownloadUrl]);

  const getFileType = (fileName: string): string => {
    const extension = fileName.split('.').pop()?.toLowerCase() || '';
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension)) {
      return 'image';
    }
    if (['mp4', 'webm', 'ogg', 'mov'].includes(extension)) {
      return 'video';
    }
    if (['mp3', 'wav', 'ogg', 'aac'].includes(extension)) {
      return 'audio';
    }
    if (['pdf'].includes(extension)) {
      return 'pdf';
    }
    return 'unknown';
  };

  const fileType = getFileType(fileName);

  const renderPreview = () => {
    if (loading) {
      return <div className="flex items-center justify-center h-64">Loading...</div>;
    }

    if (!previewUrl) {
      return <div className="flex items-center justify-center h-64">Failed to load preview</div>;
    }

    switch (fileType) {
      case 'image':
        return (
          <img 
            src={previewUrl} 
            alt={fileName}
            className="max-w-full max-h-96 object-contain mx-auto"
          />
        );
      case 'video':
        return (
          <video 
            src={previewUrl} 
            controls 
            className="max-w-full max-h-96 mx-auto"
          >
            Your browser does not support video playback.
          </video>
        );
      case 'audio':
        return (
          <audio 
            src={previewUrl} 
            controls 
            className="w-full"
          >
            Your browser does not support audio playback.
          </audio>
        );
      case 'pdf':
        return (
          <iframe 
            src={previewUrl} 
            className="w-full h-96"
            title={fileName}
          />
        );
      default:
        return (
          <div className="flex items-center justify-center h-64 text-gray-500">
            Preview not available for this file type
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl max-h-full overflow-auto">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold truncate">{fileName}</h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onDownload(fileKey)}
              className="p-2 text-gray-600 hover:text-gray-800 rounded"
            >
              <Download className="h-5 w-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-600 hover:text-gray-800 rounded"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="p-4">
          {renderPreview()}
        </div>
      </div>
    </div>
  );
};

export default MediaPreview;