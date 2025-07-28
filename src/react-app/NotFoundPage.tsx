import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import cloudflareLogo from "./assets/Cloudflare_Logo.svg";
import honoLogo from "./assets/hono.svg";
import "./NotFoundPage.css";

const NotFoundPage = () => {
  // 状态管理
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0);
  const [bounceCount, setBounceCount] = useState(0);

  // 监听窗口大小变化
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    
    // 初始化深色模式
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(prefersDark);
    document.documentElement.classList.toggle('dark', prefersDark);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 处理深色模式切换
  const handleDarkModeToggle = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    document.documentElement.classList.toggle('dark', newMode);
  };

  // 数字跳动动画效果
  useEffect(() => {
    const interval = setInterval(() => {
      setBounceCount(prev => (prev + 1) % 4);
    }, 200);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800'}`}>
      {/* 导航栏 */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-sm transition-all duration-300">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <img src={viteLogo} className="h-8 w-8" alt="Vite logo" />
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">Vite + React</h1>
          </div>
          <nav>
            <ul className="flex space-x-6">
              <li>
                <Link to="/" className="hover:text-blue-500 transition-colors">首页</Link>
              </li>
              <li>
                <Link to="/docs" className="hover:text-blue-500 transition-colors">文档</Link>
              </li>
              <li>
                <Link to="/api" className="hover:text-blue-500 transition-colors">API</Link>
              </li>
              <li>
                <button 
                  onClick={handleDarkModeToggle} 
                  className="flex items-center space-x-1 hover:text-blue-500 transition-colors"
                >
                  <i className="fa fa-moon-o"></i>
                  <span className="hidden sm:inline">深色模式</span>
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* 主要内容 */}
      <main className="flex-grow container mx-auto px-4 py-16 flex flex-col items-center justify-center text-center">
        {/* 404 标题区域 */}
        <div className="mb-12 relative">
          <h1 className="text-[clamp(5rem,15vw,10rem)] font-extrabold tracking-tight mb-4">
            <span className={`inline-block transition-transform duration-300 ${bounceCount === 0 ? 'translate-y-0' : 'translate-y-[-10px]'}`}>4</span>
            <span className={`inline-block transition-transform duration-300 ${bounceCount === 1 ? 'translate-y-0' : 'translate-y-[-10px]'}`}>0</span>
            <span className={`inline-block transition-transform duration-300 ${bounceCount === 2 ? 'translate-y-0' : 'translate-y-[-10px]'}`}>4</span>
          </h1>
          <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 w-full max-w-md h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full blur-lg opacity-70"></div>
          <h2 className="text-[clamp(1.5rem,3vw,2.5rem)] font-bold text-gray-700 dark:text-gray-200">页面未找到</h2>
          <p className="text-[clamp(1rem,2vw,1.25rem)] text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mt-4">
            抱歉，您访问的页面不存在或已被移动。请检查网址是否正确，或返回首页继续浏览。
          </p>
        </div>

        {/* 技术栈图标装饰 */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-16 max-w-2xl w-full">
          <div className="flex flex-col items-center">
            <img src={viteLogo} className="h-16 w-16 opacity-70 hover:opacity-100 transition-opacity duration-300" alt="Vite logo" />
          </div>
          <div className="flex flex-col items-center">
            <img src={reactLogo} className="h-16 w-16 opacity-70 hover:opacity-100 transition-opacity duration-300" alt="React logo" />
          </div>
          <div className="flex flex-col items-center">
            <img src={honoLogo} className="h-16 w-16 opacity-70 hover:opacity-100 transition-opacity duration-300" alt="Hono logo" />
          </div>
          <div className="flex flex-col items-center">
            <img src={cloudflareLogo} className="h-16 w-16 opacity-70 hover:opacity-100 transition-opacity duration-300" alt="Cloudflare logo" />
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
          <Link 
            to="/" 
            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-8 py-4 rounded-lg shadow-md hover:shadow-lg transform transition-all duration-300 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 flex items-center justify-center text-lg"
          >
            <i className="fa fa-home mr-2"></i> 返回首页
          </Link>
          <button 
            onClick={() => window.history.back()}
            className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white border border-gray-200 dark:border-gray-700 px-8 py-4 rounded-lg shadow-md hover:shadow-lg transform transition-all duration-300 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600 focus:ring-opacity-50 flex items-center justify-center text-lg"
          >
            <i className="fa fa-arrow-left mr-2"></i> 返回上一页
          </button>
        </div>

        {/* 响应式信息 */}
        <div className="mt-16 bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 max-w-md w-full">
          <h3 className="text-xl font-bold mb-2">响应式状态</h3>
          <p className="text-gray-600 dark:text-gray-300">
            当前窗口宽度: <span className="font-bold">{windowWidth}px</span>
          </p>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            {windowWidth < 640 ? '移动设备视图' : 
             windowWidth < 768 ? '平板视图' : '桌面视图'}
          </p>
        </div>
      </main>

      {/* 页脚 */}
      <footer className="bg-white dark:bg-gray-800 shadow-inner py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center space-x-2">
                <img src={viteLogo} className="h-6 w-6" alt="Vite logo" />
                <span className="font-bold text-lg">Vite + React</span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                现代化Web开发体验
              </p>
            </div>
            
            <div className="flex space-x-6">
              <a href="#" className="text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">
                <i className="fa fa-github text-xl"></i>
              </a>
              <a href="#" className="text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">
                <i className="fa fa-twitter text-xl"></i>
              </a>
              <a href="#" className="text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">
                <i className="fa fa-linkedin text-xl"></i>
              </a>
            </div>
          </div>
          
          <div className="border-t border-gray-200 dark:border-gray-700 mt-8 pt-8 text-center text-sm text-gray-500 dark:text-gray-400">
            © 2025 Vite + React + Hono + Cloudflare 示例应用. 保留所有权利.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default NotFoundPage;
