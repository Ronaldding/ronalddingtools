import { useEffect, useRef, useState } from 'react';
import Header from '../components/Header';

function RacingGame() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Set the document title when component mounts
    document.title = '3D Racing Game | Ronald Ding Tools';
    
    return () => {
      // Reset title when component unmounts
      document.title = 'Ronald Ding Tools';
      // Release all pressed keys on unmount
      pressedKeys.forEach(key => {
        sendKeyEvent(key, 'keyup');
      });
    };
  }, []);

  // Cleanup effect for pressed keys
  useEffect(() => {
    return () => {
      // Release all pressed keys when component unmounts
      pressedKeys.forEach(key => {
        sendKeyEvent(key, 'keyup');
      });
    };
  }, [pressedKeys]);

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

  // Send keyboard events to iframe
  const sendKeyEvent = (key: string, type: 'keydown' | 'keyup') => {
    const iframe = iframeRef.current;
    if (iframe && iframe.contentWindow) {
      const event = new KeyboardEvent(type, {
        key: key,
        code: getKeyCode(key),
        bubbles: true,
        cancelable: true
      });
      iframe.contentWindow.document.dispatchEvent(event);
    }
  };

  // Map keys to their codes
  const getKeyCode = (key: string): string => {
    const keyMap: { [key: string]: string } = {
      'w': 'KeyW',
      'a': 'KeyA', 
      's': 'KeyS',
      'd': 'KeyD',
      ' ': 'Space'
    };
    return keyMap[key] || key;
  };

  // Handle virtual button press
  const handleButtonDown = (key: string) => {
    if (!pressedKeys.has(key)) {
      setPressedKeys(prev => new Set(prev).add(key));
      sendKeyEvent(key, 'keydown');
    }
  };

  // Handle virtual button release
  const handleButtonUp = (key: string) => {
    if (pressedKeys.has(key)) {
      setPressedKeys(prev => {
        const newSet = new Set(prev);
        newSet.delete(key);
        return newSet;
      });
      sendKeyEvent(key, 'keyup');
    }
  };

  // Prevent default touch behaviors
  const handleTouchStart = (e: React.TouchEvent, key: string) => {
    e.preventDefault();
    handleButtonDown(key);
  };

  const handleTouchEnd = (e: React.TouchEvent, key: string) => {
    e.preventDefault();
    handleButtonUp(key);
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

        {/* Virtual Controls for Mobile */}
        <div className="block sm:hidden mt-4">
          <div className="flex flex-col items-center space-y-4">
            {/* Movement Controls */}
            <div className="relative">
              {/* Forward (W) */}
              <button
                onTouchStart={(e) => handleTouchStart(e, 'w')}
                onTouchEnd={(e) => handleTouchEnd(e, 'w')}
                onMouseDown={() => handleButtonDown('w')}
                onMouseUp={() => handleButtonUp('w')}
                onMouseLeave={() => handleButtonUp('w')}
                className={`absolute -top-16 left-1/2 transform -translate-x-1/2 w-14 h-14 rounded-lg font-bold text-lg select-none ${
                  pressedKeys.has('w') 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                } transition-colors duration-150 touch-manipulation`}
              >
                W
              </button>
              
              {/* Left (A) */}
              <button
                onTouchStart={(e) => handleTouchStart(e, 'a')}
                onTouchEnd={(e) => handleTouchEnd(e, 'a')}
                onMouseDown={() => handleButtonDown('a')}
                onMouseUp={() => handleButtonUp('a')}
                onMouseLeave={() => handleButtonUp('a')}
                className={`absolute top-0 -left-16 w-14 h-14 rounded-lg font-bold text-lg select-none ${
                  pressedKeys.has('a') 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                } transition-colors duration-150 touch-manipulation`}
              >
                A
              </button>
              
              {/* Center Reference */}
              <div className="w-14 h-14 rounded-lg bg-gray-800 border-2 border-gray-600"></div>
              
              {/* Right (D) */}
              <button
                onTouchStart={(e) => handleTouchStart(e, 'd')}
                onTouchEnd={(e) => handleTouchEnd(e, 'd')}
                onMouseDown={() => handleButtonDown('d')}
                onMouseUp={() => handleButtonUp('d')}
                onMouseLeave={() => handleButtonUp('d')}
                className={`absolute top-0 -right-16 w-14 h-14 rounded-lg font-bold text-lg select-none ${
                  pressedKeys.has('d') 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                } transition-colors duration-150 touch-manipulation`}
              >
                D
              </button>
              
              {/* Backward (S) */}
              <button
                onTouchStart={(e) => handleTouchStart(e, 's')}
                onTouchEnd={(e) => handleTouchEnd(e, 's')}
                onMouseDown={() => handleButtonDown('s')}
                onMouseUp={() => handleButtonUp('s')}
                onMouseLeave={() => handleButtonUp('s')}
                className={`absolute top-16 left-1/2 transform -translate-x-1/2 w-14 h-14 rounded-lg font-bold text-lg select-none ${
                  pressedKeys.has('s') 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                } transition-colors duration-150 touch-manipulation`}
              >
                S
              </button>
            </div>
            
            {/* Nitro Button (Space) */}
            <button
              onTouchStart={(e) => handleTouchStart(e, ' ')}
              onTouchEnd={(e) => handleTouchEnd(e, ' ')}
              onMouseDown={() => handleButtonDown(' ')}
              onMouseUp={() => handleButtonUp(' ')}
              onMouseLeave={() => handleButtonUp(' ')}
              className={`w-24 h-14 rounded-lg font-bold text-lg select-none ${
                pressedKeys.has(' ') 
                  ? 'bg-orange-600 text-white' 
                  : 'bg-orange-700 text-orange-100 hover:bg-orange-600'
              } transition-colors duration-150 touch-manipulation`}
            >
              NITRO
            </button>
          </div>
          
          <div className="text-center text-gray-500 text-xs mt-2">
            Use virtual controls for mobile gameplay
          </div>
        </div>
      </div>
    </div>
  );
}

export default RacingGame; 