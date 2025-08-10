import { useState, useEffect, SetStateAction } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function CalculatorPage() {
  // 计算器状态管理
  const [input, setInput] = useState("");
  const [result, setResult] = useState("0");
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // 监听系统深色模式
  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(prefersDark);
  }, []);
  
  // 处理数字和运算符输入
  const handleButtonClick = (value: SetStateAction<string>) => {
    // 防止连续输入多个小数点
    if (value === "." && input.includes(".")) return;
    // 防止连续输入运算符
    if (
      ["+", "-", "*", "/"].includes(value as string) &&
      ["+", "-", "*", "/"].includes(input.slice(-1))
    ) {
      setInput(input.slice(0, -1) + value);
      return;
    }
    
    // 如果当前是结果状态，输入新内容时重置
    if (result !== "0" && !input) {
      setInput(value);
    } else {
      setInput(input + value);
    }
  };
  
  // 计算结果
  const calculateResult = () => {
    if (!input) return;
    
    try {
      // 替换符号以便正确计算
      const expression = input.replace('×', '*').replace('÷', '/');
      const evalResult = eval(expression);
      // 处理大数和小数显示
      const formattedResult = Number.isInteger(evalResult) 
        ? evalResult.toString()
        : evalResult.toFixed(6).replace(/\.?0+$/, "");
      
      setResult(formattedResult);
      setInput("");
    } catch (error) {
      setResult("Error");
    }
  };
  
  // 清空输入
  const clearInput = () => {
    setInput("");
    setResult("0");
  };
  
  // 删除最后一个字符
  const deleteLastChar = () => {
    if (input) {
      setInput(input.slice(0, -1));
    } else {
      setResult("0");
    }
  };
  
  // 计算百分比
  const calculatePercentage = () => {
    if (!input && result === "0") return;
    
    const value = input || result;
    const percentageValue = (parseFloat(value) / 100).toString();
    setInput(percentageValue);
    setResult("0");
  };

  return (
    <div className={`min-h-screen flex flex-col bg-gradient-to-b from-blue-50/90 via-blue-100/80 to-gray-50`}>
      <Header />
      
      <main className="flex-grow flex items-center justify-center p-4 md:p-8">
        {/* 计算器容器 - 居中布局 */}
        <div className="w-full max-w-xs">
          
          {/* 计算器主体 - Apple风格 */}
          <div className={`text-white rounded-3xl shadow-2xl overflow-hidden ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'} p-1`}>
            {/* 显示区域 */}
            <div className="p-6 pb-2 text-right">
              <div className="text-5xl font-light min-h-16 tracking-tight overflow-x-auto">
                {input || result}
              </div>
            </div>
            
            {/* 按钮区域 - 紧凑布局 */}
            <div className="p-2 grid grid-cols-4 gap-2">
              {/* 第一行 */}
              <button
                onClick={clearInput}
                className="bg-gray-500 hover:bg-gray-600 text-white py-4 px-1 rounded-full text-lg font-medium transition-all duration-150 active:scale-95"
                style={{ fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' }}
              >
                C
              </button>
              <button
                onClick={deleteLastChar}
                className="bg-gray-500 hover:bg-gray-600 text-white py-4 px-1 rounded-full text-lg font-medium transition-all duration-150 active:scale-95"
                style={{ fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' }}
              >
                ⌫
              </button>
              <button
                onClick={calculatePercentage}
                className="bg-gray-500 hover:bg-gray-600 text-white py-4 px-1 rounded-full text-lg font-medium transition-all duration-150 active:scale-95"
                style={{ fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' }}
              >
                %
              </button>
              <button
                onClick={() => handleButtonClick("÷")}
                className="bg-orange-500 hover:bg-orange-600 text-white py-4 px-1 rounded-full text-lg font-medium transition-all duration-150 active:scale-95"
                style={{ fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' }}
              >
                ÷
              </button>
              
              {/* 第二行 */}
              <button
                onClick={() => handleButtonClick("7")}
                className={`py-4 px-1 rounded-full text-lg font-medium transition-all duration-150 active:scale-95 ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-200'}`}
                style={{ fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' }}
              >
                7
              </button>
              <button
                onClick={() => handleButtonClick("8")}
                className={`py-4 px-1 rounded-full text-lg font-medium transition-all duration-150 active:scale-95 ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-200'}`}
                style={{ fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' }}
              >
                8
              </button>
              <button
                onClick={() => handleButtonClick("9")}
                className={`py-4 px-1 rounded-full text-lg font-medium transition-all duration-150 active:scale-95 ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-200'}`}
                style={{ fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' }}
              >
                9
              </button>
              <button
                onClick={() => handleButtonClick("×")}
                className="bg-orange-500 hover:bg-orange-600 text-white py-4 px-1 rounded-full text-lg font-medium transition-all duration-150 active:scale-95"
                style={{ fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' }}
              >
                ×
              </button>
              
              {/* 第三行 */}
              <button
                onClick={() => handleButtonClick("4")}
                className={`py-4 px-1 rounded-full text-lg font-medium transition-all duration-150 active:scale-95 ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-200'}`}
                style={{ fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' }}
              >
                4
              </button>
              <button
                onClick={() => handleButtonClick("5")}
                className={`py-4 px-1 rounded-full text-lg font-medium transition-all duration-150 active:scale-95 ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-200'}`}
                style={{ fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' }}
              >
                5
              </button>
              <button
                onClick={() => handleButtonClick("6")}
                className={`py-4 px-1 rounded-full text-lg font-medium transition-all duration-150 active:scale-95 ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-200'}`}
                style={{ fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' }}
              >
                6
              </button>
              <button
                onClick={() => handleButtonClick("-")}
                className="bg-orange-500 hover:bg-orange-600 text-white py-4 px-1 rounded-full text-lg font-medium transition-all duration-150 active:scale-95"
                style={{ fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' }}
              >
                −
              </button>
              
              {/* 第四行 */}
              <button
                onClick={() => handleButtonClick("1")}
                className={`py-4 px-1 rounded-full text-lg font-medium transition-all duration-150 active:scale-95 ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-200'}`}
                style={{ fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' }}
              >
                1
              </button>
              <button
                onClick={() => handleButtonClick("2")}
                className={`py-4 px-1 rounded-full text-lg font-medium transition-all duration-150 active:scale-95 ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-200'}`}
                style={{ fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' }}
              >
                2
              </button>
              <button
                onClick={() => handleButtonClick("3")}
                className={`py-4 px-1 rounded-full text-lg font-medium transition-all duration-150 active:scale-95 ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-200'}`}
                style={{ fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' }}
              >
                3
              </button>
              <button
                onClick={() => handleButtonClick("+")}
                className="bg-orange-500 hover:bg-orange-600 text-white py-4 px-1 rounded-full text-lg font-medium transition-all duration-150 active:scale-95"
                style={{ fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' }}
              >
                +
              </button>
              
              {/* 第五行 */}
              <button
                onClick={() => handleButtonClick("0")}
                className={`py-4 px-1 rounded-full text-lg font-medium transition-all duration-150 active:scale-95 col-span-2 flex items-center justify-start pl-6 ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-200'}`}
                style={{ fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' }}
              >
                0
              </button>
              <button
                onClick={() => handleButtonClick(".")}
                className={`py-4 px-1 rounded-full text-lg font-medium transition-all duration-150 active:scale-95 ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-200'}`}
                style={{ fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' }}
              >
                .
              </button>
              <button
                onClick={calculateResult}
                className="bg-orange-500 hover:bg-orange-600 text-white py-4 px-1 rounded-full text-lg font-medium transition-all duration-150 active:scale-95"
                style={{ fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' }}
              >
                =
              </button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
    