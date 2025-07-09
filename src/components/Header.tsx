import React from 'react';
import { Database, LogOut, Sun, Moon } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

interface HeaderProps {
  isConnected?: boolean;
  onDisconnect?: () => void;
}

const Header: React.FC<HeaderProps> = ({ isConnected, onDisconnect }) => {
  const { isDark, toggleTheme } = useTheme();
  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4 sm:py-6 w-full">
          <div className="flex-1"></div>
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <img 
              src="https://kwebmaker.com/_next/image/?url=%2Fimages%2Fkwebmaker_Logo_GIF.webp&w=256&q=75" 
              alt="KWebMaker Logo" 
              className="h-16 sm:h-20 md:h-24 w-auto"
            />
            <div className="flex items-center space-x-2 text-center sm:text-left">
              <Database className="h-6 sm:h-8 w-6 sm:w-8 text-primary-600" />
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                S3 Storage Manager
              </h1>
            </div>
          </div>
          <div className="flex-1 flex justify-end items-center space-x-3">
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            {isConnected && (
              <button
                onClick={onDisconnect}
                className="flex items-center space-x-2 px-4 py-2 text-sm bg-red-100 hover:bg-red-200 dark:bg-red-900 dark:hover:bg-red-800 text-red-700 dark:text-red-300 rounded-md transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Disconnect</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;