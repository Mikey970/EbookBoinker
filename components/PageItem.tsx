
import React, { useState, useEffect } from 'react';
import { Page } from '../types';

interface PageItemProps {
  page: Page;
  index: number;
  pageCount: number;
  onRemove: () => void;
  onMove: (index: number, direction: 'up' | 'down') => void;
}

const LoadingSpinner: React.FC = () => (
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-400"></div>
);

const AlertTriangleIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
        <line x1="12" y1="9" x2="12" y2="13"></line>
        <line x1="12" y1="17" x2="12.01" y2="17"></line>
    </svg>
);

const ChevronUpIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m18 15-6-6-6 6"/></svg>
);

const ChevronDownIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m6 9 6 6 6-6"/></svg>
);

const XIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);


export const PageItem: React.FC<PageItemProps> = ({ page, index, pageCount, onRemove, onMove }) => {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>('loading');
  const isDataUrl = page.url.startsWith('data:image');

  useEffect(() => {
    setStatus('loading');
    const img = new Image();
    img.src = page.url;
    img.onload = () => setStatus('loaded');
    img.onerror = () => setStatus('error');
  }, [page.url]);

  return (
    <li className="flex items-center space-x-4 bg-gray-900/50 p-3 rounded-lg border border-gray-700 hover:border-indigo-500 transition-all">
      <div className="flex-shrink-0 w-24 h-24 bg-gray-800 rounded-md flex items-center justify-center overflow-hidden border border-gray-600">
        {status === 'loading' && <LoadingSpinner />}
        {status === 'loaded' && <img src={page.url} alt={`Page ${index + 1}`} className="object-contain h-full w-full" />}
        {status === 'error' && (
          <div className="text-center p-2">
            <AlertTriangleIcon className="w-8 h-8 text-red-500 mx-auto" />
            <p className="text-xs text-red-400 mt-1">Load failed</p>
          </div>
        )}
      </div>
      <div className="flex-grow min-w-0">
        <p className="text-lg font-bold text-white">Page {index + 1}</p>
        <p className="text-xs text-gray-400 truncate" title={isDataUrl ? 'Captured from screen' : page.url}>
          {isDataUrl ? 'Captured from screen' : page.url}
        </p>
      </div>
      <div className="flex items-center space-x-1">
        <div className="flex flex-col">
            <button onClick={() => onMove(index, 'up')} disabled={index === 0} className="p-1 text-gray-400 hover:text-white disabled:opacity-30 disabled:hover:text-gray-400 transition">
              <ChevronUpIcon className="w-5 h-5" />
            </button>
            <button onClick={() => onMove(index, 'down')} disabled={index === pageCount - 1} className="p-1 text-gray-400 hover:text-white disabled:opacity-30 disabled:hover:text-gray-400 transition">
              <ChevronDownIcon className="w-5 h-5" />
            </button>
        </div>
        <button onClick={onRemove} className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-full transition">
          <XIcon className="w-5 h-5" />
        </button>
      </div>
    </li>
  );
};
