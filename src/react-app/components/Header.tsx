import { useState } from "react";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/60 shadow-sm transition-all duration-300 h-12 flex items-center">
        <div className="container mx-auto px-4 h-full flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <a href="/" className="flex items-center">
              <RobotIcon className="h-8 w-8 text-gray-900" />
              <h1 className="text-lg font-bold text-black ml-2">RD</h1>
            </a>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:block">
            <ul className="flex space-x-6">
              <li><a href="/tools" className="text-black hover:text-gray-600 transition-colors">Tools</a></li>
              <li><a href="/games" className="text-black hover:text-gray-600 transition-colors">Games</a></li>
              <li><a href="/articles" className="text-black hover:text-gray-600 transition-colors">Articles</a></li>
              <li><a href="https://llm.ronaldding.com" className="text-black hover:text-gray-600 transition-colors" target="_blank" rel="noopener noreferrer">LLM</a></li>
              <li><a href="https://tv.ronaldding.com" className="text-black hover:text-gray-600 transition-colors" target="_blank" rel="noopener noreferrer">TV</a></li>
            </ul>
          </nav>

          {/* Mobile Hamburger Button */}
          <button
            className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm"
            onClick={closeMenu}
          />
          
          {/* Menu Panel */}
          <div className="fixed top-12 right-0 w-64 h-full bg-white shadow-xl transform transition-transform duration-300 ease-in-out">
            <nav className="p-6">
              <ul className="space-y-4">
                <li>
                  <a 
                    href="/tools" 
                    className="block py-3 px-4 text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                    onClick={closeMenu}
                  >
                    Tools
                  </a>
                </li>
                <li>
                  <a 
                    href="/games" 
                    className="block py-3 px-4 text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                    onClick={closeMenu}
                  >
                    Games
                  </a>
                </li>
                <li>
                  <a 
                    href="/articles" 
                    className="block py-3 px-4 text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                    onClick={closeMenu}
                  >
                    Articles
                  </a>
                </li>
                <li className="border-t border-gray-200 pt-4">
                  <a 
                    href="https://llm.ronaldding.com" 
                    className="block py-3 px-4 text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                    target="_blank" 
                    rel="noopener noreferrer"
                    onClick={closeMenu}
                  >
                    LLM
                  </a>
                </li>
                <li>
                  <a 
                    href="https://tv.ronaldding.com" 
                    className="block py-3 px-4 text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                    target="_blank" 
                    rel="noopener noreferrer"
                    onClick={closeMenu}
                  >
                    TV
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      )}

      {/* Spacer to offset fixed header height */}
      <div className="h-12" aria-hidden="true" />
    </>
  );
}

function RobotIcon({ className = "h-6 w-6" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="4" y="6" width="16" height="12" rx="2" fill="currentColor"/>
      <rect x="6" y="8" width="4" height="4" rx="1" fill="white"/>
      <rect x="14" y="8" width="4" height="4" rx="1" fill="white"/>
      <circle cx="8" cy="10" r="0.5" fill="currentColor"/>
      <circle cx="16" cy="10" r="0.5" fill="currentColor"/>
      <rect x="10" y="14" width="4" height="2" rx="1" fill="white"/>
      <path d="M8 4l2-2h4l2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M6 6h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

export default Header;  