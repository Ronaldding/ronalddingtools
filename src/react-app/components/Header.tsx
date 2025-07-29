import viteLogo from "/vite.svg";

function Header() {
  return (
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
        </ul>
        </nav>
    </div>
    </header>
  );
}

export default Header;  