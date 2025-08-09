import { useEffect, useRef } from 'react';
import Header from '../components/Header';

function RacingGame() {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    // Set the document title when component mounts
    document.title = '3D Racing Game | Ronald Ding Tools';
    
    return () => {
      // Reset title when component unmounts
      document.title = 'Ronald Ding Tools';
    };
  }, []);

  // Handle fullscreen toggle
  const toggleFullscreen = () => {
    const iframe = iframeRef.current;
    if (iframe) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        iframe.requestFullscreen().catch((err) => {
          console.log(`Error attempting to enable fullscreen: ${err.message}`);
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <Header />
      
      <div className="flex-1 flex flex-col p-4">
        <div className="mb-4 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">
            3D Racing Game
          </h1>
          <p className="text-gray-300 mb-4">
            Experience high-speed 3D racing with realistic physics, multiple cars, and dynamic tracks!
          </p>
          <button
            onClick={toggleFullscreen}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors duration-200 mb-4"
          >
            Toggle Fullscreen
          </button>
        </div>
        
        <div className="flex-1 bg-black rounded-lg overflow-hidden shadow-2xl">
          <iframe
            ref={iframeRef}
            src="/RacingGame.html"
            className="w-full h-full border-0"
            title="3D Racing Game"
            allow="fullscreen"
            style={{ minHeight: '600px' }}
          />
        </div>
        
        <div className="mt-4 text-center text-gray-400 text-sm">
          <p>Controls: WASD or Arrow Keys to drive • Space for Nitro • Full immersive 3D experience</p>
        </div>
      </div>
    </div>
  );
}

export default RacingGame; 