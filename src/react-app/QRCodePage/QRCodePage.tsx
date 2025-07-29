import React, { useState, useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';  // 生成 QR 码的 canvas 组件
import { saveAs } from 'file-saver';         // 下载功能
import Header from '../components/Header';

function QRCodePage() {
  // 状态管理：输入内容、样式配置
  const [content, setContent] = useState('https://your-blog.com');  // 默认内容
  const [qrConfig, setQrConfig] = useState({
    size: 200,               // 尺寸
    fgColor: '#000000',      // 前景色（二维码颜色）
    bgColor: '#FFFFFF',      // 背景色
    logo: null,              // Logo 图片（可选）
  });
  const canvasRef = useRef<HTMLCanvasElement>(null);  // 用于获取 QR 码 canvas 元素

  // 处理样式配置变化（比如颜色选择器、尺寸输入框）
  const handleConfigChange = (key: string, value: string | number) => {
    setQrConfig(prev => ({ ...prev, [key]: value }));
  };

  // 下载 QR 码（转为 PNG）
  const downloadQRCode = () => {
    if (canvasRef.current) {
      canvasRef.current.toBlob((blob: Blob | null) => {
        if (blob) {
          saveAs(blob, 'my-qr-code.png');  // 保存为 PNG 文件
        }
      });
    }
  };

  return (
    <div>
        <Header />
      <h1 className="text-2xl font-bold mb-6">QR Code Generator</h1>

      {/* 1. 输入区 */}
      <div className="mb-6">
        <label className="block mb-2">输入内容（网址/文本）：</label>
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="例如：https://your-website.com"
        />
      </div>

      {/* 2. 配置区 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* 尺寸设置 */}
        <div>
          <label className="block mb-2">尺寸：{qrConfig.size}px</label>
          <input
            type="range"
            min="100"
            max="500"
            value={qrConfig.size}
            onChange={(e) => handleConfigChange('size', Number(e.target.value))}
            className="w-full"
          />
        </div>

        {/* 前景色（二维码颜色） */}
        <div>
          <label className="block mb-2">二维码颜色：</label>
          <input
            type="color"
            value={qrConfig.fgColor}
            onChange={(e) => handleConfigChange('fgColor', e.target.value)}
          />
        </div>

        {/* 背景色 */}
        <div>
          <label className="block mb-2">背景颜色：</label>
          <input
            type="color"
            value={qrConfig.bgColor}
            onChange={(e) => handleConfigChange('bgColor', e.target.value)}
          />
        </div>
      </div>

      {/* 3. 预览与下载区 */}
      <div className="text-center mb-6">
        <div 
          style={{ 
            display: 'inline-block', 
            padding: '20px', 
            backgroundColor: '#f0f0f0',  // 预览区背景
            borderRadius: '8px'
          }}
        >
          {/* 生成 QR 码（核心组件） */}
          <QRCodeCanvas
            ref={canvasRef}
            value={content}          // 内容
            size={qrConfig.size}     // 尺寸
            fgColor={qrConfig.fgColor}  // 前景色
            bgColor={qrConfig.bgColor}  // 背景色
            level="H"                // 容错级别（H 最高，可容错30%）
          />
        </div>
        <button
          onClick={downloadQRCode}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          下载 QR 码
        </button>
      </div>
    </div>
  );
};

export default QRCodePage;