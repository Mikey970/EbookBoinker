
import React, { useState, useCallback } from 'react';
import { Page } from './types';
import { Header } from './components/Header';
import { UrlInputForm } from './components/UrlInputForm';
import { PageList } from './components/PageList';
import { DownloadButton } from './components/DownloadButton';
import { Instructions } from './components/Instructions';
import { ScreenCapture } from './components/ScreenCapture';
import { BulkImport } from './components/BulkImport';

declare global {
  interface Window {
    jspdf: any;
  }
}

const App: React.FC = () => {
  const [pages, setPages] = useState<Page[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);

  const addPage = useCallback((url: string) => {
    if (url && !pages.some(p => p.url === url)) {
      const newPage: Page = {
        id: crypto.randomUUID(),
        url,
      };
      setPages(prev => [...prev, newPage]);
    }
  }, [pages]);

  const addMultiplePages = useCallback((urls: string[]) => {
    const newPages: Page[] = [];
    const existingUrls = new Set(pages.map(p => p.url));

    for (const url of urls) {
        if (url && !existingUrls.has(url)) {
            newPages.push({ id: crypto.randomUUID(), url });
            existingUrls.add(url); // prevent duplicates within the same batch
        }
    }

    if (newPages.length > 0) {
        setPages(prev => [...prev, ...newPages]);
    }
  }, [pages]);

  const removePage = useCallback((id: string) => {
    setPages(prev => prev.filter(p => p.id !== id));
  }, []);

  const movePage = useCallback((index: number, direction: 'up' | 'down') => {
    setPages(prev => {
      const newPages = [...prev];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= newPages.length) {
        return newPages;
      }
      [newPages[index], newPages[targetIndex]] = [newPages[targetIndex], newPages[index]];
      return newPages;
    });
  }, []);
  
  const generatePdf = async () => {
    if (pages.length === 0) return;
    setIsGenerating(true);
    setGenerationProgress(0);

    const { jsPDF } = window.jspdf;
    
    // Default to portrait A4, will be adjusted per image
    const doc = new jsPDF();
    doc.deletePage(1);

    for (let i = 0; i < pages.length; i++) {
        const page = pages[i];
        setGenerationProgress(((i + 1) / pages.length) * 100);

        try {
            let dataUrl: string;

            if (page.url.startsWith('data:image')) {
                dataUrl = page.url;
            } else {
                const response = await fetch(page.url);
                if (!response.ok) {
                  throw new Error(`Failed to fetch image: ${response.statusText}`);
                }
                const blob = await response.blob();
                dataUrl = await new Promise<string>((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result as string);
                    reader.onerror = reject;
                    reader.readAsDataURL(blob);
                });
            }
            
            const img = new Image();
            img.src = dataUrl;
            await new Promise((resolve, reject) => { 
                img.onload = resolve;
                img.onerror = reject;
            });

            const imgWidth = img.width;
            const imgHeight = img.height;
            const orientation = imgWidth > imgHeight ? 'l' : 'p';

            doc.addPage([imgWidth, imgHeight], orientation);
            doc.addImage(dataUrl, 'PNG', 0, 0, imgWidth, imgHeight);

        } catch (error) {
            const pageIdentifier = page.url.startsWith('data:image') ? `captured image for Page ${i + 1}` : page.url;
            console.error(`Error processing ${pageIdentifier}:`, error);
            // Optionally add a blank page with an error message
            doc.addPage();
            doc.text(`Error loading page ${i + 1}`, 10, 10);
        }
    }

    doc.save('captured-book.pdf');
    setIsGenerating(false);
  };


  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <Instructions />
            <UrlInputForm onAddPage={addPage} />
            <ScreenCapture onAddPage={addPage} />
            <BulkImport onAddPages={addMultiplePages} />
            <DownloadButton 
              onGeneratePdf={generatePdf} 
              isGenerating={isGenerating}
              progress={generationProgress}
              pageCount={pages.length}
            />
          </div>
          <div className="lg:col-span-2">
            <PageList 
              pages={pages}
              onRemovePage={removePage}
              onMovePage={movePage}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
