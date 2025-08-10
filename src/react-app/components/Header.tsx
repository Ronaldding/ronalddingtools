function Header() {
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
          <nav>
            <ul className="flex space-x-6">
              <li><a href="https://llm.ronaldding.com" className="text-black" target="_blank" rel="noopener noreferrer">LLM</a></li>
              <li><a href="https://tv.ronaldding.com" className="text-black" target="_blank" rel="noopener noreferrer">TV</a></li>
            </ul>
          </nav>
        </div>
      </header>
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