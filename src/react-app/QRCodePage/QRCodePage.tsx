import { useState, useRef, useEffect } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { saveAs } from 'file-saver';
import Header from '../components/Header';

function QRCodePage() {
  const [content, setContent] = useState('https://ronaldding.com');
  const [qrConfig, setQrConfig] = useState({
    size: 200,
    fgColor: '#000000',
    bgColor: '#FFFFFF',
    logo: null,
  });
  const [maxSize, setMaxSize] = useState(Math.min(window.innerWidth, 500));
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Update maxSize on window resize
  useEffect(() => {
    const handleResize = () => {
      setMaxSize(Math.min(window.innerWidth, 500));
      // Ensure current size doesn't exceed new maxSize
      if (qrConfig.size > Math.min(window.innerWidth, 500)) {
        setQrConfig((prev) => ({ ...prev, size: Math.min(window.innerWidth, 500) }));
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [qrConfig.size]);

  const handleConfigChange = (key: string, value: string | number) => {
    setQrConfig((prev) => ({ ...prev, [key]: value }));
  };

  const downloadQRCode = () => {
    if (canvasRef.current) {
      canvasRef.current.toBlob((blob: Blob | null) => {
        if (blob) {
          saveAs(blob, 'my-qr-code.png');
        }
      });
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-blue-500 to-pink-500 flex flex-col items-center">
      <div className="w-full">
        <Header />
      </div>
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <h1 className="text-4xl font-extrabold text-white mb-8 text-center animate-bounce">
          QR Code Generator 🎉
        </h1>

        {/* Input Section */}
        <div className="mb-8 bg-white/90 backdrop-blur-md p-6 rounded-lg shadow-xl transform hover:scale-105 transition-transform duration-300">
          <label className="block mb-2 text-lg font-semibold text-purple-900">
            Enter Content (URL/Text):
          </label>
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-3 rounded-lg border-2 border-purple-300 focus:border-yellow-400 focus:outline-none bg-white/50 text-purple-900 placeholder-gray-400 transition-all duration-300"
            placeholder="e.g., https://ronaldding.com"
          />
        </div>

        {/* Configuration Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Size Slider */}
          <div className="bg-white/90 backdrop-blur-md p-6 rounded-lg shadow-xl transform hover:scale-105 transition-transform duration-300">
            <label className="block mb-2 text-lg font-semibold text-purple-900">
              Size: {qrConfig.size}px
            </label>
            <input
              type="range"
              min="100"
              max={maxSize}
              value={qrConfig.size}
              onChange={(e) => handleConfigChange('size', Number(e.target.value))}
              className="w-full accent-yellow-400"
            />
          </div>

          {/* Foreground Color */}
          <div className="bg-white/90 backdrop-blur-md p-6 rounded-lg shadow-xl transform hover:scale-105 transition-transform duration-300">
            <label className="block mb-2 text-lg font-semibold text-purple-900">
              QR Code Color:
            </label>
            <input
              type="color"
              value={qrConfig.fgColor}
              onChange={(e) => handleConfigChange('fgColor', e.target.value)}
              className="w-full h-10 rounded cursor-pointer"
            />
          </div>

          {/* Background Color */}
          <div className="bg-white/90 backdrop-blur-md p-6 rounded-lg shadow-xl transform hover:scale-105 transition-transform duration-300">
            <label className="block mb-2 text-lg font-semibold text-purple-900">
              Background Color:
            </label>
            <input
              type="color"
              value={qrConfig.bgColor}
              onChange={(e) => handleConfigChange('bgColor', e.target.value)}
              className="w-full h-10 rounded cursor-pointer"
            />
          </div>
        </div>

        {/* Preview and Download Section */}
        <div className="text-center mb-8">
          <div
            className="inline-block p-6 bg-white/90 backdrop-blur-md rounded-xl shadow-2xl"
          >
            <QRCodeCanvas
              ref={canvasRef}
              value={content}
              size={qrConfig.size}
              fgColor={qrConfig.fgColor}
              bgColor={qrConfig.bgColor}
              level="H"
            />
          </div>
          <button
            onClick={downloadQRCode}
            className="mt-6 px-8 py-3 bg-yellow-400 text-purple-900 font-bold rounded-full hover:bg-yellow-500 transition-all duration-300 transform hover:scale-110 flex items-center mx-auto"
          >
            <span className="mr-2">Download QR Code</span>
            <svg
              className="w-5 h-5 animate-bounce"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default QRCodePage;