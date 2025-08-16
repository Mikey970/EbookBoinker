
import React from 'react';
import { Page } from '../types';
import { PageItem } from './PageItem';

interface PageListProps {
  pages: Page[];
  onRemovePage: (id: string) => void;
  onMovePage: (index: number, direction: 'up' | 'down') => void;
}

export const PageList: React.FC<PageListProps> = ({ pages, onRemovePage, onMovePage }) => {
  if (pages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gray-800/50 border-2 border-dashed border-gray-700 rounded-lg p-12 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600 mb-4"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
        <h3 className="text-xl font-semibold text-white">No Pages Added Yet</h3>
        <p className="text-gray-400 mt-2">Your captured pages will appear here as you add them.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
      <h3 className="text-lg font-semibold text-white px-2 pb-2 mb-2 border-b border-gray-700">Captured Pages ({pages.length})</h3>
      <ul className="space-y-3 max-h-[70vh] overflow-y-auto pr-2">
        {pages.map((page, index) => (
          <PageItem
            key={page.id}
            page={page}
            index={index}
            pageCount={pages.length}
            onRemove={() => onRemovePage(page.id)}
            onMove={onMovePage}
          />
        ))}
      </ul>
    </div>
  );
};
