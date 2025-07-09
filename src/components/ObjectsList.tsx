import React, { useState, useMemo } from 'react';
import { Download, Trash2, RefreshCw, File, Folder, Edit, Eye, List, Grid, MoreHorizontal, ChevronUp, ChevronDown } from 'lucide-react';
import { S3Object } from '../types';
import MediaPreview from './MediaPreview';

type ViewMode = 'list' | 'grid' | 'details';
type SortField = 'name' | 'size' | 'lastModified';
type SortOrder = 'asc' | 'desc';

interface ObjectsListProps {
  objects: S3Object[];
  onDelete: (key: string) => void;
  onDownload: (key: string) => void;
  onRefresh: () => void;
  onRename: (oldKey: string, newKey: string) => void;
  getDownloadUrl: (key: string) => Promise<string | null>;
  loading: boolean;
}

const ObjectsList: React.FC<ObjectsListProps> = ({ 
  objects, 
  onDelete, 
  onDownload, 
  onRefresh,
  onRename,
  getDownloadUrl,
  loading 
}) => {
  const [previewFile, setPreviewFile] = useState<{ key: string; name: string } | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('details');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 100;
  const formatSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  };

  const isFolder = (key: string): boolean => key.endsWith('/');
  
  const isPreviewable = (key: string): boolean => {
    const extension = key.split('.').pop()?.toLowerCase() || '';
    return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'mp4', 'webm', 'ogg', 'mov', 'mp3', 'wav', 'aac', 'pdf'].includes(extension);
  };

  const handleRename = (key: string) => {
    const newName = prompt('Enter new name:', key);
    if (newName && newName !== key) {
      onRename(key, newName);
    }
  };

  const handlePreview = (key: string) => {
    setPreviewFile({ key, name: key });
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const sortedObjects = useMemo(() => {
    return [...objects].sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortField) {
        case 'name':
          aValue = a.key.toLowerCase();
          bValue = b.key.toLowerCase();
          break;
        case 'size':
          aValue = a.size;
          bValue = b.size;
          break;
        case 'lastModified':
          aValue = new Date(a.lastModified).getTime();
          bValue = new Date(b.lastModified).getTime();
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [objects, sortField, sortOrder]);

  const paginatedObjects = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sortedObjects.slice(startIndex, endIndex);
  }, [sortedObjects, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(sortedObjects.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortOrder === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />;
  };

  const renderGridView = () => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 p-4">
      {paginatedObjects.map((object) => (
        <div key={object.key} className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors">
          <div className="flex flex-col items-center space-y-2">
            {isFolder(object.key) ? (
              <Folder className="h-12 w-12 text-blue-500" />
            ) : (
              <File className="h-12 w-12 text-gray-400" />
            )}
            <span className="text-xs text-center truncate w-full" title={object.key}>
              {object.key}
            </span>
            <div className="flex space-x-1">
              {!isFolder(object.key) && isPreviewable(object.key) && (
                <button onClick={() => handlePreview(object.key)} className="p-1 text-purple-600 hover:bg-purple-100 rounded">
                  <Eye className="h-3 w-3" />
                </button>
              )}
              {!isFolder(object.key) && (
                <button onClick={() => onDownload(object.key)} className="p-1 text-primary-600 hover:bg-primary-100 rounded">
                  <Download className="h-3 w-3" />
                </button>
              )}
              <button onClick={() => handleRename(object.key)} className="p-1 text-yellow-600 hover:bg-yellow-100 rounded">
                <Edit className="h-3 w-3" />
              </button>
              <button onClick={() => onDelete(object.key)} className="p-1 text-red-600 hover:bg-red-100 rounded">
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderListView = () => (
    <div className="p-4 space-y-2">
      {paginatedObjects.map((object) => (
        <div key={object.key} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
          <div className="flex items-center space-x-3 flex-1">
            {isFolder(object.key) ? (
              <Folder className="h-5 w-5 text-blue-500" />
            ) : (
              <File className="h-5 w-5 text-gray-400" />
            )}
            <span className="text-sm truncate">{object.key}</span>
          </div>
          <div className="flex items-center space-x-1">
            {!isFolder(object.key) && isPreviewable(object.key) && (
              <button onClick={() => handlePreview(object.key)} className="p-1 text-purple-600 hover:bg-purple-100 rounded">
                <Eye className="h-4 w-4" />
              </button>
            )}
            {!isFolder(object.key) && (
              <button onClick={() => onDownload(object.key)} className="p-1 text-primary-600 hover:bg-primary-100 rounded">
                <Download className="h-4 w-4" />
              </button>
            )}
            <button onClick={() => handleRename(object.key)} className="p-1 text-yellow-600 hover:bg-yellow-100 rounded">
              <Edit className="h-4 w-4" />
            </button>
            <button onClick={() => onDelete(object.key)} className="p-1 text-red-600 hover:bg-red-100 rounded">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderDetailsView = () => (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              onClick={() => handleSort('name')}
            >
              <div className="flex items-center space-x-1">
                <span>Name</span>
                <SortIcon field="name" />
              </div>
            </th>
            <th 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              onClick={() => handleSort('size')}
            >
              <div className="flex items-center space-x-1">
                <span>Size</span>
                <SortIcon field="size" />
              </div>
            </th>
            <th 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              onClick={() => handleSort('lastModified')}
            >
              <div className="flex items-center space-x-1">
                <span>Last Modified</span>
                <SortIcon field="lastModified" />
              </div>
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {paginatedObjects.map((object) => (
            <tr key={object.key} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  {isFolder(object.key) ? (
                    <Folder className="h-4 w-4 text-blue-500 mr-2" />
                  ) : (
                    <File className="h-4 w-4 text-gray-400 mr-2" />
                  )}
                  <span className="text-sm font-medium text-gray-900">
                    {object.key}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatSize(object.size)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatDate(object.lastModified)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex items-center justify-end space-x-1">
                  {!isFolder(object.key) && isPreviewable(object.key) && (
                    <button
                      onClick={() => handlePreview(object.key)}
                      className="text-purple-600 hover:text-purple-900 p-1 rounded"
                      title="Preview"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  )}
                  {!isFolder(object.key) && (
                    <button
                      onClick={() => onDownload(object.key)}
                      className="text-primary-600 hover:text-primary-900 p-1 rounded"
                      title="Download"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    onClick={() => handleRename(object.key)}
                    className="text-yellow-600 hover:text-yellow-900 p-1 rounded"
                    title="Rename"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onDelete(object.key)}
                    className="text-red-600 hover:text-red-900 p-1 rounded"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
            <File className="h-5 w-5 mr-2 text-primary-600" />
            Objects ({objects.length}) - Page {currentPage} of {totalPages}
          </h2>
          <div className="flex items-center space-x-2">
            <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-md p-1">
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-white dark:bg-gray-600 shadow' : 'hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                title="List View"
              >
                <List className="h-4 w-4 text-gray-700 dark:text-gray-300" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white dark:bg-gray-600 shadow' : 'hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                title="Grid View"
              >
                <Grid className="h-4 w-4 text-gray-700 dark:text-gray-300" />
              </button>
              <button
                onClick={() => setViewMode('details')}
                className={`p-2 rounded ${viewMode === 'details' ? 'bg-white dark:bg-gray-600 shadow' : 'hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                title="Details View"
              >
                <MoreHorizontal className="h-4 w-4 text-gray-700 dark:text-gray-300" />
              </button>
            </div>
            <button
              onClick={onRefresh}
              disabled={loading}
              className="flex items-center px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {objects.length === 0 ? (
        <div className="p-8 text-center text-gray-500 dark:text-gray-400">
          <File className="h-12 w-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
          <p>No objects found in this bucket</p>
        </div>
      ) : (
        <div>
          {viewMode === 'grid' && renderGridView()}
          {viewMode === 'list' && renderListView()}
          {viewMode === 'details' && renderDetailsView()}
          
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t">
              <div className="text-sm text-gray-500">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, objects.length)} of {objects.length} objects
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + Math.max(1, currentPage - 2);
                  if (page > totalPages) return null;
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-1 text-sm rounded ${
                        currentPage === page
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}
      
      {previewFile && (
        <MediaPreview
          fileKey={previewFile.key}
          fileName={previewFile.name}
          onClose={() => setPreviewFile(null)}
          onDownload={onDownload}
          getDownloadUrl={getDownloadUrl}
        />
      )}
    </div>
  );
};

export default ObjectsList;