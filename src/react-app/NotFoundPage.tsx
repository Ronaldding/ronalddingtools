import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function NotFoundPage () {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(30);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-600 to-blue-500 flex flex-col items-center justify-center text-white p-4">
      <h1 className="text-6xl font-extrabold mb-4 animate-bounce">Oops! 404</h1>
      <p className="text-2xl mb-6 animate-pulse">Looks like you're lost in space!</p>
      <div className="relative">
        <div className="absolute inset-0 bg-white opacity-20 rounded-full blur-xl animate-spin-slow"></div>
        <p className="text-xl font-semibold">
          Redirecting to Home in{' '}
          <span className="text-yellow-300 text-3xl">{countdown}</span> seconds...
        </p>
      </div>
      <div className="mt-8 flex space-x-4">
        <button
          onClick={() => navigate('/')}
          className="px-6 py-3 bg-yellow-400 text-purple-900 rounded-full font-bold hover:bg-yellow-500 transition-all duration-300 transform hover:scale-105"
        >
          Back to Home
        </button>
      </div>
      <div className="mt-12 flex space-x-2">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="w-4 h-4 bg-white rounded-full animate-bounce"
            style={{ animationDelay: `${i * 0.2}s` }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default NotFoundPage;