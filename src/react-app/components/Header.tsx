
function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-sm transition-all duration-300">
    <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <svg
            className="h-8 w-8 text-purple-600"
            viewBox="0 0 32 32"
            fill="url(#rd-gradient)"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="rd-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#D97706', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#7C3AED', stopOpacity: 1 }} />
              </linearGradient>
            </defs>
            <path d="M10 6H16C18.2091 6 20 7.79086 20 10V16H14V10C14 9.44772 14.4477 9 15 9C15.5523 9 16 9.44772 16 10V22C16 24.2091 14.2091 26 12 26H6C3.79086 26 2 24.2091 2 22V16H8V22C8 22.5523 8.44772 23 9 23C9.55228 23 10 22.5523 10 22V6Z" />
            <path d="M22 6H28C30.2091 6 32 7.79086 32 10V22C32 24.2091 30.2091 26 28 26H22V16H28V10C28 9.44772 27.5523 9 27 9C26.4477 9 26 9.44772 26 10V22C26 22.5523 26.4477 23 27 23C27.5523 23 28 22.5523 28 22V6Z" />
          </svg>
          <h1 className="text-2xl font-extrabold bg-gradient-to-r from-yellow-400 to-pink-500 bg-clip-text text-transparent">
            Ronald Ding
          </h1>
        </div>
        <nav>
        <ul className="flex space-x-6">
            <li><a href="/" className="text-white hover:text-yellow-300 transition-colors duration-300">Home</a></li>
            <li><a href="https://llm.ronaldding.com" className="text-white hover:text-yellow-300 transition-colors duration-300" target="_blank" rel="noopener noreferrer">LLM</a></li>
            <li><a href="/404" className="text-white hover:text-yellow-300 transition-colors duration-300">404</a></li>
        </ul>
        </nav>
    </div>
    </header>
  );
}

export default Header;  