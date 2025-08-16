import React, { useState } from 'react';

const ClipboardIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
);
const CheckIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="20 6 9 17 4 12"></polyline></svg>
);
const ImportIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 3v12m0 0l-4-4m4 4l4-4M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path></svg>
);

interface BulkImportProps {
  onAddPages: (urls: string[]) => void;
}

const SCRIPT_TO_COPY = `(async()=>{const e=Array.from(document.querySelectorAll("img.mainViewerImg")).map(e=>e?e.src:null).filter(Boolean);if(0===e.length)return void alert("No images with class 'mainViewerImg' found on this page.");const t=document.createElement("div");t.style.cssText="position:fixed;top:20px;left:50%;transform:translateX(-50%);background-color:rgba(0,0,0,0.8);color:white;padding:15px;border-radius:8px;z-index:999999;font-family:sans-serif;font-size:16px;box-shadow:0 4px 12px rgba(0,0,0,0.5);text-align:center;",document.body.appendChild(t);const o=[];for(let r=0;r<e.length;r++){const s=e[r];t.textContent=\`Processing image \${r+1} of \${e.length}...\`;try{const n=await fetch(s),a=await n.blob(),c=await new Promise((e,t)=>{const o=new FileReader;o.onloadend=()=>e(o.result),o.onerror=t,o.readAsDataURL(a)});o.push(c)}catch(e){console.error(\`Failed to process image: \${s}\`,e)}}const r=JSON.stringify(o);t.textContent="Finished processing. Attempting to copy to clipboard...";try{await navigator.clipboard.writeText(r),t.textContent="✅ Success! All page data copied to clipboard. You can now paste it into the app."}catch(e){console.error("Failed to copy to clipboard automatically:",e),t.innerHTML='⚠️ Could not copy to clipboard automatically.<br/>Right-click the output in the console below, select "Copy string contents", and then paste into the app.',console.log(r)}setTimeout(()=>{t.remove()},8e3)})();`;

export const BulkImport: React.FC<BulkImportProps> = ({ onAddPages }) => {
  const [pastedJson, setPastedJson] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(SCRIPT_TO_COPY).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }).catch(err => {
      console.error('Failed to copy text: ', err);
    });
  };

  const handleImport = () => {
    setError(null);
    if (!pastedJson.trim()) {
      return;
    }

    try {
      const parsed = JSON.parse(pastedJson);
      if (!Array.isArray(parsed) || !parsed.every(item => typeof item === 'string' && item.startsWith('data:image'))) {
        throw new Error('Pasted content is not a valid array of image data URLs.');
      }
      onAddPages(parsed);
      setPastedJson('');
    } catch (e: any) {
      console.error("Import error:", e);
      setError('Invalid format. Please paste the data copied from the console.');
    }
  };

  return (
    <div className="bg-gray-800/70 p-6 rounded-lg border border-gray-700 space-y-4">
      <div>
        <h3 className="text-lg font-medium text-white">Bulk Import Pages</h3>
        <p className="text-sm text-gray-400 mt-1">
          Fixes "Failed to fetch" errors by processing images directly on the book's website.
        </p>
      </div>
      <div className="space-y-3 text-sm">
        <p><span className="font-bold text-gray-300">1.</span> On the book website, open developer tools (<kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg shadow-sm">Ctrl+Shift+I</kbd>).</p>
        <div>
          <p className="mb-2"><span className="font-bold text-gray-300">2.</span> Copy this script and paste it into the <span className="font-semibold text-indigo-300">Console</span> tab, then press Enter.</p>
          <div className="flex bg-gray-900 rounded-md border border-gray-600">
            <pre className="flex-grow text-xs text-gray-300 p-2 overflow-x-auto"><code>{SCRIPT_TO_COPY}</code></pre>
            <button onClick={handleCopy} title="Copy script" aria-label="Copy script" className="flex-shrink-0 p-2 text-gray-400 hover:text-white bg-gray-800 rounded-r-md transition-colors">
              {copySuccess ? <CheckIcon className="w-5 h-5 text-green-400" /> : <ClipboardIcon className="w-5 h-5" />}
            </button>
          </div>
        </div>
        <p>
            <span className="font-bold text-gray-300">3.</span> 
            The script will show its progress on the book's page. When finished, it will automatically copy all page data to your clipboard.
        </p>
        <div>
          <p className="mb-2">
            <span className="font-bold text-gray-300">4.</span> 
            Come back here, paste the data into the box below, and click Import.
            <span className="text-gray-500 block text-xs">(If auto-copy fails, the script will instruct you to copy from the console manually.)</span>
          </p>
          <textarea
            value={pastedJson}
            onChange={(e) => setPastedJson(e.target.value)}
            placeholder="Paste the page data copied by the script..."
            className="w-full h-24 bg-gray-900 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            aria-label="Pasted page data"
          />
          {error && <p className="text-sm text-red-400 mt-1">{error}</p>}
        </div>
      </div>
       <button
          onClick={handleImport}
          disabled={!pastedJson.trim()}
          className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 transition-colors disabled:opacity-50"
      >
          <ImportIcon className="w-5 h-5 mr-2 -ml-1" />
          Import Pages
      </button>
    </div>
  );
};
