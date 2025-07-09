import React from 'react';
import Header from './components/Header';
import CredentialsForm from './components/CredentialsForm';
import BucketInfo from './components/BucketInfo';
import ObjectsList from './components/ObjectsList';
import FileUpload from './components/FileUpload';
import { useS3 } from './hooks/useS3';
import { useTheme } from './hooks/useTheme';

const App: React.FC = () => {
  useTheme();
  const {
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
  } = useS3();

  const handleDownload = async (key: string) => {
    const url = await getDownloadUrl(key);
    if (url) {
      window.open(url, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header isConnected={isConnected} onDisconnect={disconnect} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!isConnected ? (
          <div className="max-w-md mx-auto">
            <CredentialsForm
              onConnect={connect}
              loading={loading}
              error={error}
            />
          </div>
        ) : (
          <div className="space-y-6">
            {bucketInfo && <BucketInfo bucketInfo={bucketInfo} />}
            
            <FileUpload
              onFileUpload={uploadFile}
              onCreateFolder={createFolder}
              loading={loading}
            />
            
            <ObjectsList
              objects={objects}
              onDelete={deleteObject}
              onDownload={handleDownload}
              onRefresh={refreshObjects}
              onRename={renameObject}
              getDownloadUrl={getDownloadUrl}
              loading={loading}
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default App;