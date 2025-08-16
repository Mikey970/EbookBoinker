
import React from 'react';

const Step: React.FC<{ number: number; title: string; children: React.ReactNode }> = ({ number, title, children }) => (
  <li className="flex">
    <div className="flex-shrink-0">
      <span className="flex items-center justify-center w-8 h-8 bg-indigo-600 rounded-full text-white font-bold">
        {number}
      </span>
    </div>
    <div className="ml-4">
      <h4 className="text-lg font-semibold text-white">{title}</h4>
      <p className="mt-1 text-gray-400">{children}</p>
    </div>
  </li>
);

export const Instructions: React.FC = () => {
  return (
    <div className="bg-gray-800/70 p-6 rounded-lg border border-gray-700">
      <h3 className="text-xl font-bold mb-4 text-white">How to Use</h3>
      <ol className="space-y-4">
        <Step number={1} title="Find the Page Image">
          On your book's website, right-click the page you want to capture and select "Copy Image Address".
        </Step>
        <Step number={2} title="Add the Page">
          Paste the copied URL into the input box below and click "Add Page". A preview will appear on the right.
        </Step>
        <Step number={3} title="Compile and Download">
          Repeat for all pages. Once done, click "Generate PDF" to download your compiled document.
        </Step>
      </ol>
      <div className="mt-6 pt-4 border-t border-gray-700">
        <h4 className="text-lg font-semibold text-white">For Authenticated/Private Sites</h4>
        <p className="mt-1 text-gray-400">
          If copying the image address doesn't work, use the "Capture from Screen" tool. This lets you take a screenshot of any page directly from your browser.
        </p>
      </div>
    </div>
  );
};
