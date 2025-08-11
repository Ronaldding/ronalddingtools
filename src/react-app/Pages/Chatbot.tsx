import { useState, useRef, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I'm Ronald Ding's AI assistant. How can I help you today?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue.trim(),
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      // Prepare conversation history for context
      const conversationHistory = messages
        .filter(msg => msg.id !== "1") // Exclude initial greeting
        .map(msg => ({
          role: msg.isUser ? "user" : "assistant",
          content: msg.text
        }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage.text,
          conversationHistory
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();
      
      if (data.success) {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: data.response,
          isUser: false,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMessage]);
      } else {
        throw new Error(data.error || "Unknown error");
      }
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: `Sorry, I encountered an error: ${error instanceof Error ? error.message : "Unknown error"}`,
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: "1",
        text: "Hello! I'm Ronald Ding's AI assistant. How can I help you today?",
        isUser: false,
        timestamp: new Date()
      }
    ]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/90 via-blue-100/80 to-gray-50">
      <Header />
      
      <main className="flex-1 pt-20">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 py-12">
          {/* Hero Section */}
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold tracking-tight text-gray-900 mb-4">
              AI Chatbot
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Your intelligent AI assistant powered by Cloudflare AI. Ask me anything!
            </p>
          </div>

          {/* Chat Container */}
          <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-xl overflow-hidden">
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6v-2h12v2zm0-3H6V6h12v2z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold">Ronald Ding AI Assistant</h3>
                    <p className="text-sm text-blue-100">Powered by Cloudflare AI</p>
                  </div>
                </div>
                <button
                  onClick={clearChat}
                  className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded-lg text-sm transition-colors"
                >
                  Clear Chat
                </button>
              </div>
            </div>

            {/* Messages */}
            <div ref={messagesContainerRef} className="h-96 overflow-y-auto p-6 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                      message.isUser
                        ? "bg-blue-600 text-white rounded-br-md"
                        : "bg-gray-100 text-gray-800 rounded-bl-md"
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.text}</p>
                    <p className={`text-xs mt-2 ${
                      message.isUser ? "text-blue-100" : "text-gray-500"
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-800 rounded-2xl rounded-bl-md px-4 py-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <div className="border-t border-gray-200 p-6">
              <form onSubmit={handleSubmit} className="flex space-x-4">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e as any);
                    }
                  }}
                  placeholder="Type your message here... (Press Enter to send)"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isLoading}
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  {isLoading ? "Sending..." : "Send"}
                </button>
              </form>
            </div>
          </div>

          {/* Features Info */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-200">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Fast & Responsive</h3>
              <p className="text-sm text-gray-600">Powered by Cloudflare's edge AI for quick responses</p>
            </div>
            
            <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-200">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Smart & Helpful</h3>
              <p className="text-sm text-gray-600">AI-powered responses for all your questions and tasks</p>
            </div>
            
            <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-200">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Secure & Private</h3>
              <p className="text-sm text-gray-600">Your conversations are processed securely on Cloudflare's edge</p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 