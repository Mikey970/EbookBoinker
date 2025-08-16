
import React, { useState, useRef, useCallback } from 'react';

const VideoIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>
);

const StopCircleIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"></circle><rect x="9" y="9" width="6" height="6"></rect></svg>
);

const CameraIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
);

interface ScreenCaptureProps {
  onAddPage: (url: string) => void;
}

export const ScreenCapture: React.FC<ScreenCaptureProps> = ({ onAddPage }) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const stopCapture = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setStream(null);
  }, [stream]);

  const startCapture = async () => {
    setError(null);
    try {
      const mediaStream = await navigator.mediaDevices.getDisplayMedia({
        video: { cursor: 'always' } as any,
        audio: false,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }
      mediaStream.getVideoTracks()[0].addEventListener('ended', stopCapture);
      setStream(mediaStream);
    } catch (err) {
      console.error("Error starting screen capture:", err);
      setError("Could not start screen capture. Please grant permission and try again.");
      setStream(null);
    }
  };

  const captureFrame = () => {
    if (!videoRef.current || videoRef.current.paused || videoRef.current.ended) {
        setError("Capture stream is not active.");
        return;
    }

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/png');
      onAddPage(dataUrl);
    } else {
        setError("Could not capture frame from video.");
    }
  };

  return (
    <div className="bg-gray-800/70 p-6 rounded-lg border border-gray-700 space-y-4">
        <div>
            <h3 className="text-lg font-medium text-white">Capture from Screen</h3>
            <p className="text-sm text-gray-400 mt-1">For private sites, capture pages directly from your screen.</p>
        </div>

        {stream ? (
            <div className="space-y-4">
                <div className="bg-black rounded-md overflow-hidden border border-gray-600">
                    <video ref={videoRef} muted className="w-full" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <button onClick={captureFrame} className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 transition-colors">
                        <CameraIcon className="w-5 h-5 mr-2 -ml-1" />
                        Capture Page
                    </button>
                    <button onClick={stopCapture} className="inline-flex items-center justify-center px-4 py-2 border border-gray-600 text-sm font-medium rounded-md shadow-sm text-white bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-gray-500 transition-colors">
                        <StopCircleIcon className="w-5 h-5 mr-2 -ml-1" />
                        Stop Capture
                    </button>
                </div>
            </div>
        ) : (
            <div>
                 <button onClick={startCapture} className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 transition-colors">
                    <VideoIcon className="w-5 h-5 mr-2 -ml-1" />
                    Start Screen Capture
                </button>
                <p className="text-xs text-center text-gray-500 mt-3">Select the browser tab containing your book pages.</p>
            </div>
        )}
        
        {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  );
};
