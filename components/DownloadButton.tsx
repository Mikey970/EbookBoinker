
import React from 'react';

const DownloadIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="7 10 12 15 17 10"></polyline>
        <line x1="12" y1="15" x2="12" y2="3"></line>
    </svg>
);

interface DownloadButtonProps {
  onGeneratePdf: () => void;
  isGenerating: boolean;
  progress: number;
  pageCount: number;
}

export const DownloadButton: React.FC<DownloadButtonProps> = ({ onGeneratePdf, isGenerating, progress, pageCount }) => {
  return (
    <div className="bg-gray-800/70 p-6 rounded-lg border border-gray-700">
        <button
            onClick={onGeneratePdf}
            disabled={isGenerating || pageCount === 0}
            className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {isGenerating ? (
                <span>Generating PDF...</span>
            ) : (
                <>
                  <DownloadIcon className="w-5 h-5 mr-3 -ml-1" />
                  Generate PDF ({pageCount} Pages)
                </>
            )}
        </button>
        {isGenerating && (
            <div className="mt-4">
                <div className="w-full bg-gray-700 rounded-full h-2.5">
                    <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${progress}%`, transition: 'width 0.3s ease-in-out' }}></div>
                </div>
                <p className="text-center text-sm text-gray-300 mt-2">{Math.round(progress)}% Complete</p>
            </div>
        )}
        {pageCount === 0 && (
          <p className="text-center text-sm text-gray-500 mt-3">Add at least one page to enable PDF generation.</p>
        )}
    </div>
  );
};
