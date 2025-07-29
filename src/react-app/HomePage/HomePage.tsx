
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";



function HomePage() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('Click to fetch!');
  const [isLoading, setIsLoading] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Dummy API fetch function
  const fetchName = async () => {
    setIsLoading(true);
    setTimeout(() => {
      setName('Sample Data');
      setIsLoading(false);
    }, 1000);
  };

  // Update window width on resize
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-300 bg-gradient-to-br from-purple-500 via-blue-500 to-pink-500 text-white`}
    >
      {/* Full-width wrapper for sticky Header */}
      <div className="w-full sticky top-0 z-50">
        <Header />
      </div>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8">
        <section className="text-center mb-12">
          <h1 className="text-[clamp(2.5rem,6vw,4rem)] font-extrabold mb-4 tracking-tight animate-pulse">
            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              Ronald Ding's Awesome App
            </span>
          </h1>
          <p className="text-[clamp(1rem,2vw,1.25rem)] text-gray-200 max-w-2xl mx-auto">
            A modern web app with fun tools and a vibrant experience!
          </p>
        </section>

        {/* Feature Cards */}
        <section className="mb-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link to="/qr-code" className="no-underline">
              <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-lg p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                <div className="flex justify-center mb-4">
                  <svg
                    className="h-16 w-16 text-purple-600"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7zM4 4v5h5V4H4zM15 4v5h5V4h-5zM4 15v5h5v-5H4zM15 15v5h5v-5h-5zM6 6h1v1H6V6zM17 6h1v1h-1V6zM6 17h1v1H6v-1zM17 17h1v1h-1v-1z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2 text-center text-purple-900">QR Code Generator</h3>
                <p className="text-gray-600 text-center">
                  Create custom QR codes for any URL or text with style!
                </p>
              </div>
            </Link>

            <Link to="/calculator" className="no-underline">
              <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-lg p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                <div className="flex justify-center mb-4">
                  <svg
                    className="h-16 w-16 text-blue-600"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M7 2h10a2 2 0 012 2v16a2 2 0 01-2 2H7a2 2 0 01-2-2V4a2 2 0 012-2zm0 2v16h10V4H7zm2 2h6v2H9V6zm0 3h2v2H9V9zm4 0h2v2h-2V9zm-4 3h2v2H9v-2zm4 0h2v2h-2v-2zm-4 3h2v2H9v-2zm4 0h2v2h-2v-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2 text-center text-blue-900">Calculator</h3>
                <p className="text-gray-600 text-center">
                  Perform quick calculations with an interactive tool.
                </p>
              </div>
            </Link>

            <Link to="/date-count" className="no-underline">
              <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-lg p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                <div className="flex justify-center mb-4">
                  <svg
                    className="h-16 w-16 text-green-600"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M7 2v2H4a2 2 0 00-2 2v14a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2h-3V2h-2v2H9V2H7zm-3 4h16v14H4V6zm2 2v10h12V8H6zm2 2h2v2H8v-2zm4 0h2v2h-2v-2zm4 0h2v2h-2v-2zm-8 4h2v2H8v-2zm4 0h2v2h-2v-2zm4 0h2v2h-2v-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2 text-center text-green-900">Date Counter</h3>
                <p className="text-gray-600 text-center">
                  Count days between dates or track special events.
                </p>
              </div>
            </Link>
          </div>
        </section>

        {/* Interactive Cards */}
        <section className="max-w-4xl mx-auto mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg p-8 relative overflow-hidden transform hover:scale-105 transition-transform duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-200/50 rounded-full -mr-16 -mt-16 animate-spin-slow"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-yellow-200/50 rounded-full -ml-12 -mb-12 animate-spin-slow"></div>
              <div className="relative">
                <h2 className="text-2xl font-bold mb-4 text-purple-900">Counter</h2>
                <p className="text-gray-600 mb-6">
                  Click the button to increment the counter and see React in action!
                </p>
                <button
                  onClick={() => setCount(count + 1)}
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-3 rounded-lg shadow-md hover:shadow-xl transform transition-all duration-300 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-yellow-400 flex items-center justify-center"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                  Counter: {count}
                </button>
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg p-8 relative overflow-hidden transform hover:scale-105 transition-transform duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200/50 rounded-full -mr-16 -mt-16 animate-spin-slow"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-200/50 rounded-full -ml-12 -mb-12 animate-spin-slow"></div>
              <div className="relative">
                <h2 className="text-2xl font-bold mb-4 text-blue-900">API Call</h2>
                <p className="text-gray-600 mb-6">
                  Fetch sample data with a click (simulated API response).
                </p>
                <button
                  onClick={fetchName}
                  className="bg-gradient-to-r from-blue-500 to-teal-600 text-white px-6 py-3 rounded-lg shadow-md hover:shadow-xl transform transition-all duration-300 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <svg
                        className="w-5 h-5 mr-2 animate-spin"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4 12a8 8 0 0116 0 8 8 0 01-16 0"
                        />
                      </svg>
                      Loading...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                      API Response: {name}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Responsive Design Demo */}
        <section className="mt-16 text-center">
          <h2 className="text-3xl font-bold mb-6 text-white animate-bounce">Responsive Design</h2>
          <p className="text-gray-200 mb-8 max-w-2xl mx-auto">
            This app shines on all devices! Current window width:{' '}
            <span className="font-bold">{windowWidth}px</span>
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <div className="bg-white/90 backdrop-blur-md rounded-lg shadow-md p-4 w-64 transform hover:scale-105 transition-transform duration-300">
              <div className="h-40 bg-gray-200/50 rounded mb-3 flex items-center justify-center">
                <svg
                  className="h-12 w-12 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 3h14a2 2 0 012 2v16a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2zm2 16h10M9 7h6"
                  />
                </svg>
              </div>
              <h3 className="font-medium text-purple-900">Mobile</h3>
              <p className="text-sm text-gray-600">Perfect for small screens.</p>
            </div>
            <div className="bg-white/90 backdrop-blur-md rounded-lg shadow-md p-4 w-64 transform hover:scale-105 transition-transform duration-300">
              <div className="h-40 bg-gray-200/50 rounded mb-3 flex items-center justify-center">
                <svg
                  className="h-12 w-12 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="font-medium text-blue-900">Tablet</h3>
              <p className="text-sm text-gray-600">Optimized for medium screens.</p>
            </div>
            <div className="bg-white/90 backdrop-blur-md rounded-lg shadow-md p-4 w-64 transform hover:scale-105 transition-transform duration-300">
              <div className="h-40 bg-gray-200/50 rounded mb-3 flex items-center justify-center">
                <svg
                  className="h-12 w-12 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="font-medium text-green-900">Desktop</h3>
              <p className="text-sm text-gray-600">Full-featured for large screens.</p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white/90 backdrop-blur-md shadow-inner py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center space-x-2">
                <svg
                  className="h-6 w-6 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                <span className="font-bold text-lg text-purple-900">Ronald Ding's App</span>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                A fun and modern web experience built with React and Tailwind CSS.
              </p>
            </div>
            <div className="flex space-x-6">
              <a
                href="https://github.com"
                className="text-gray-600 hover:text-yellow-400 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12c0 4.41 2.87 8.14 6.84 9.49.5.09.68-.22.68-.48v-1.71c-2.78.6-3.37-1.34-3.37-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.08.63-1.33-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02A9.58 9.58 0 0112 6.8c.85 0 1.71.11 2.52.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .26.18.58.69.48A10.01 10.01 0 0022 12c0-5.52-4.48-10-10-10z" />
                </svg>
              </a>
              <a
                href="https://twitter.com"
                className="text-gray-600 hover:text-yellow-400 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M18.24 4.15a.75.75 0 011.06 0l1.56 1.56a.75.75 0 010 1.06l-1.56 1.56a.75.75 0 01-1.06 0L16.68 6.77a.75.75 0 010-1.06l1.56-1.56zM3 10.5a.5.5 0 01.5-.5h17a.5.5 0 01.5.5v3a.5.5 0 01-.5.5h-17a.5.5 0 01-.5-.5v-3zm1.5 6.5a.5.5 0 01.5-.5h14a.5.5 0 01.5.5v3a.5.5 0 01-.5.5h-14a.5.5 0 01-.5-.5v-3z" />
                </svg>
              </a>
              <a
                href="https://linkedin.com"
                className="text-gray-600 hover:text-yellow-400 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M19 3a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h14zm-9.75 3.75a2.25 2.25 0 10-4.5 0 2.25 2.25 0 004.5 0zM6.75 9.75h3v9h-3v-9zm5.25 0h3v1.5h-3v-1.5zm0 3h3v6h-3v-6z" />
                </svg>
              </a>
            </div>
          </div>
          <div className="border-t border-gray-200/50 mt-8 pt-8 text-center text-sm text-gray-200">
            © 2025 Ronald Ding's App. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;  