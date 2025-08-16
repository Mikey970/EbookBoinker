
import React, { useState } from 'react';

const PlusIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
);


interface UrlInputFormProps {
  onAddPage: (url: string) => void;
}

export const UrlInputForm: React.FC<UrlInputFormProps> = ({ onAddPage }) => {
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onAddPage(url.trim());
      setUrl('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800/70 p-6 rounded-lg border border-gray-700">
        <label htmlFor="url-input" className="block text-sm font-medium text-gray-300 mb-2">Page Image URL</label>
        <div className="flex space-x-2">
            <input
                id="url-input"
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Paste image URL here..."
                className="flex-grow bg-gray-900 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            />
            <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 transition-colors disabled:opacity-50"
                disabled={!url.trim()}
            >
                <PlusIcon className="w-5 h-5 mr-2 -ml-1" />
                Add Page
            </button>
        </div>
    </form>
  );
};
