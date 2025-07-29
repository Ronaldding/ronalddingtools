
import { useState, useEffect } from "react";
import reactLogo from "../assets/react.svg";
import viteLogo from "/vite.svg";
import cloudflareLogo from "../assets/Cloudflare_Logo.svg";
import honoLogo from "../assets/hono.svg";
import { Link } from "react-router-dom";



function HomePage() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState("unknown");
  const [isDarkMode, toggleDarkMode] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // 监听窗口大小变化
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 模拟API请求的加载状态
  const [isLoading, setIsLoading] = useState(false);

  // 处理深色模式切换
  const handleDarkModeToggle = () => {
    toggleDarkMode(prev => !prev);
    document.documentElement.classList.toggle('dark');
  };

  // 获取API数据
  const fetchName = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/");
      if (!res.ok) throw new Error('Failed to fetch data');
      const data = await res.json() as { name: string };
      setName(data.name);
    } catch (error) {
      console.error('Error fetching name:', error);
      setName('Error');
    } finally {
      setIsLoading(false);
    }
  };

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
              <li><a href="#" className="hover:text-blue-500 transition-colors">首页</a></li>
              <li><a href="#" className="hover:text-blue-500 transition-colors">文档</a></li>
              <li><a href="#" className="hover:text-blue-500 transition-colors">API</a></li>
              <li><button onClick={handleDarkModeToggle} className="flex items-center space-x-1 hover:text-blue-500 transition-colors">
                <i className="fa fa-moon-o"></i>
                <span className="hidden sm:inline">深色模式</span>
              </button></li>
            </ul>
          </nav>
        </div>
      </header>

      {/* 主要内容 */}
      <main className="flex-grow container mx-auto px-4 py-8">
        <section className="text-center mb-12">
          <h1 className="text-[clamp(2rem,5vw,3.5rem)] font-bold mb-4 tracking-tight">
            <span className="bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">Vite</span> 
            <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">React</span> 
            <span className="bg-gradient-to-r from-pink-500 to-orange-500 bg-clip-text text-transparent">Hono</span> 
            <span className="bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">Cloudflare</span>
          </h1>
          <p className="text-[clamp(1rem,2vw,1.25rem)] text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            现代化Web开发栈，提供极速构建体验和全球部署能力
          </p>
        </section>

        {/* 技术栈展示 */}
        <section className="mb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link to="/" className="no-underline">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 card-hover transform transition-all duration-300 hover:scale-105">
                <div className="flex justify-center mb-4">
                <img src={viteLogo} className="h-16 w-16" alt="Vite logo" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-center">Vite</h3>
                <p className="text-gray-600 dark:text-gray-300 text-center">极速前端构建工具，提供即时热更新体验</p>
            </div>
            </Link>

            <Link to="/qr-code" className="no-underline">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 card-hover transform transition-all duration-300 hover:scale-105">
                <div className="flex justify-center mb-4">
                <img src={reactLogo} className="h-16 w-16" alt="React logo" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-center">React</h3>
                <p className="text-gray-600 dark:text-gray-300 text-center">用于构建用户界面的JavaScript库</p>
            </div>
            </Link>

            <Link to="/" className="no-underline">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 card-hover transform transition-all duration-300 hover:scale-105">
                <div className="flex justify-center mb-4">
                <img src={honoLogo} className="h-16 w-16" alt="Hono logo" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-center">Hono</h3>
                <p className="text-gray-600 dark:text-gray-300 text-center">轻量级Web框架，专为Cloudflare Workers优化</p>
            </div>
            </Link>

            <Link to="/not-found" className="no-underline">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 card-hover transform transition-all duration-300 hover:scale-105">
                <div className="flex justify-center mb-4">
                <img src={cloudflareLogo} className="h-16 w-16" alt="Cloudflare logo" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-center">Cloudflare</h3>
                <p className="text-gray-600 dark:text-gray-300 text-center">全球CDN和无服务器平台，提供高性能部署</p>
            </div>
            </Link>
        </div>
        </section>

        {/* 功能卡片 */}
        <section className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 dark:bg-blue-900/30 rounded-full -mr-16 -mt-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-100 dark:bg-blue-900/30 rounded-full -ml-12 -mb-12"></div>
              
              <div className="relative">
                <h2 className="text-2xl font-bold mb-4">计数器</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">点击按钮增加计数器值，体验React状态管理</p>
                
                <button
                  onClick={() => setCount(count + 1)}
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-lg shadow-md hover:shadow-lg transform transition-all duration-300 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 flex items-center justify-center"
                >
                  <i className="fa fa-plus-circle mr-2"></i>
                  计数器值: {count}
                </button>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-100 dark:bg-green-900/30 rounded-full -mr-16 -mt-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full -ml-12 -mb-12"></div>
              
              <div className="relative">
                <h2 className="text-2xl font-bold mb-4">API调用</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">点击按钮从Cloudflare Worker获取数据</p>
                
                <button
                  onClick={fetchName}
                  className="bg-gradient-to-r from-green-500 to-teal-600 text-white px-6 py-3 rounded-lg shadow-md hover:shadow-lg transform transition-all duration-300 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 flex items-center justify-center"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <i className="fa fa-spinner fa-spin mr-2"></i>
                      加载中...
                    </span>
                  ) : (
                    <span>
                      <i className="fa fa-cloud mr-2"></i>
                      API返回: {name}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 响应式演示 */}
        <section className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-6">响应式设计</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            该应用在所有设备上都能完美运行，当前窗口宽度: <span className="font-bold">{windowWidth}px</span>
          </p>
          
          <div className="flex flex-wrap justify-center gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 w-64">
              <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded mb-3 flex items-center justify-center">
                <i className="fa fa-mobile text-4xl"></i>
              </div>
              <h3 className="font-medium">移动设备</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">完美适配小屏幕</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 w-64">
              <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded mb-3 flex items-center justify-center">
                <i className="fa fa-tablet text-4xl"></i>
              </div>
              <h3 className="font-medium">平板设备</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">优化的中等屏幕体验</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 w-64">
              <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded mb-3 flex items-center justify-center">
                <i className="fa fa-desktop text-4xl"></i>
              </div>
              <h3 className="font-medium">桌面设备</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">全功能大屏幕体验</p>
            </div>
          </div>
        </section>
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
}

export default HomePage;  