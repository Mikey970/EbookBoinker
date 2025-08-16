
import React from 'react';

const BookOpenIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
    </svg>
);


export const Header: React.FC = () => {
  return (
    <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 shadow-lg">
      <div className="container mx-auto px-4 py-4 flex items-center space-x-3">
        <BookOpenIcon className="w-8 h-8 text-indigo-400" />
        <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Page Capture Pro</h1>
            <p className="text-sm text-gray-400">Compile web pages into a PDF document</p>
        </div>
      </div>
    </header>
  );
};
