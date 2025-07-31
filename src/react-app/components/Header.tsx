
function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-md shadow-sm transition-all duration-300 h-[44px] flex items-center">
    <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
            <a href="/"><h1 className="text-lg font-bold text-black">RD</h1></a>
        </div>
        <nav>
        <ul className="flex space-x-6">
            <li><a href="https://llm.ronaldding.com" className="text-black" target="_blank" rel="noopener noreferrer">LLM</a></li>
            <li><a href="https://tv.ronaldding.com" className="text-black" target="_blank" rel="noopener noreferrer">TV</a></li>
        </ul>
        </nav>
    </div>
    </header>
  );
}

export default Header;  