import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";

function CalculatorPage() {
  const [input, setInput] = useState("0");
  const [previousValue, setPreviousValue] = useState<string | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(true);

  // Handle number input
  const handleNumber = (num: string) => {
    if (waitingForOperand) {
      setInput(num);
      setWaitingForOperand(false);
    } else {
      setInput(input === "0" ? num : input + num);
    }
  };

  // Handle decimal point
  const handleDecimal = () => {
    if (waitingForOperand) {
      setInput("0.");
      setWaitingForOperand(false);
      return;
    }

    if (!input.includes(".")) {
      setInput(input + ".");
    }
  };

  // Handle operators (+, -, ×, ÷)
  const handleOperator = (nextOperator: string) => {
    const inputNum = parseFloat(input);

    if (operator && waitingForOperand) {
      setOperator(nextOperator);
      return;
    }

    if (previousValue === null) {
      setPreviousValue(input);
    } else if (operator) {
      const prevNum = parseFloat(previousValue);
      let result: number;

      switch (operator) {
        case "+":
          result = prevNum + inputNum;
          break;
        case "-":
          result = prevNum - inputNum;
          break;
        case "×":
          result = prevNum * inputNum;
          break;
        case "÷":
          if (inputNum === 0) {
            result = 0; // Handle division by zero
          } else {
            result = prevNum / inputNum;
          }
          break;
        default:
          result = inputNum;
      }

      // Format result to remove unnecessary decimal zeros
      const formattedResult = result % 1 === 0 ? result.toFixed(0) : result.toString();
      setInput(formattedResult);
      setPreviousValue(formattedResult);
    }

    setWaitingForOperand(true);
    setOperator(nextOperator);
  };

  // Handle percentage
  const handlePercentage = () => {
    const inputNum = parseFloat(input);
    const result = inputNum / 100;
    setInput(result.toString());
    setWaitingForOperand(true);
  };

  // Handle sign change (+/-)
  const handleSignChange = () => {
    const inputNum = parseFloat(input);
    setInput((-inputNum).toString());
  };

  // Clear all
  const handleClear = () => {
    setInput("0");
    setPreviousValue(null);
    setOperator(null);
    setWaitingForOperand(true);
  };

  // Calculate result
  const handleEquals = () => {
    if (operator && previousValue !== null) {
      handleOperator("=");
      setOperator(null);
      setPreviousValue(null);
    }
  };

  // Format large numbers with commas
  useEffect(() => {
    if (waitingForOperand || !input) return;

    // Don't format if it's a decimal or scientific notation
    if (input.includes(".") || input.includes("e")) return;

    const num = parseFloat(input);
    if (!isNaN(num)) {
      setInput(num.toLocaleString());
    }
  }, [input, waitingForOperand]);

  return (
    <div>
      <Header />
        <div className="flex flex-col items-center justify-start p-4">
            <div className="mt-8 bg-gray-800 rounded-lg shadow-2xl p-6 w-72 border-4 border-gray-700">
                {/* Casio Logo */}
                <div className="text-white text-sm mb-2 ml-1">CASIO</div>
                
                {/* Display Screen */}
                <div className="bg-gray-200 rounded-md h-25 mb-6 flex flex-col items-end justify-end p-3 border-2 border-gray-600">
                <div className="text-right text-gray-500 text-sm mb-1">
                    {previousValue && operator ? `${previousValue} ${operator}` : ""}
                </div>
                <div className="text-right text-3xl font-bold text-gray-900 overflow-x-auto whitespace-nowrap">
                    {input}
                </div>
                </div>
                
                {/* Button Grid */}
                <div className="grid grid-cols-5 gap-2">
                {/* Top Row - Special Functions */}
                <button 
                    onClick={handleClear}
                    className="bg-red-500 text-white rounded-md py-3 px-1 hover:bg-red-600 active:scale-95 transition-transform"
                >
                    C
                </button>
                <button 
                    onClick={handleSignChange}
                    className="bg-gray-400 text-black rounded-md py-3 px-1 hover:bg-gray-500 active:scale-95 transition-transform"
                >
                    +/-
                </button>
                <button 
                    onClick={handlePercentage}
                    className="bg-gray-400 text-black rounded-md py-3 px-1 hover:bg-gray-500 active:scale-95 transition-transform"
                >
                    %
                </button>
                <button 
                    onClick={() => handleOperator("÷")}
                    className="bg-orange-500 text-white rounded-md py-3 px-1 hover:bg-orange-600 active:scale-95 transition-transform"
                >
                    ÷
                </button>
                <button 
                    onClick={() => handleOperator("-")}
                    className="bg-orange-500 text-white rounded-md py-3 px-1 hover:bg-orange-600 active:scale-95 transition-transform"
                >
                    -
                </button>
                
                {/* Second Row */}
                <button 
                    onClick={() => handleNumber("7")}
                    className="bg-gray-200 text-black rounded-md py-3 px-1 hover:bg-gray-300 active:scale-95 transition-transform"
                >
                    7
                </button>
                <button 
                    onClick={() => handleNumber("8")}
                    className="bg-gray-200 text-black rounded-md py-3 px-1 hover:bg-gray-300 active:scale-95 transition-transform"
                >
                    8
                </button>
                <button 
                    onClick={() => handleNumber("9")}
                    className="bg-gray-200 text-black rounded-md py-3 px-1 hover:bg-gray-300 active:scale-95 transition-transform"
                >
                    9
                </button>
                <button 
                    onClick={() => handleOperator("×")}
                    className="bg-orange-500 text-white rounded-md py-3 px-1 hover:bg-orange-600 active:scale-95 transition-transform"
                >
                    ×
                </button>
                <button 
                    onClick={() => handleOperator("+")}
                    className="bg-orange-500 text-white rounded-md py-3 px-1 hover:bg-orange-600 active:scale-95 transition-transform"
                >
                    +
                </button>
                
                {/* Third Row */}
                <button 
                    onClick={() => handleNumber("4")}
                    className="bg-gray-200 text-black rounded-md py-3 px-1 hover:bg-gray-300 active:scale-95 transition-transform"
                >
                    4
                </button>
                <button 
                    onClick={() => handleNumber("5")}
                    className="bg-gray-200 text-black rounded-md py-3 px-1 hover:bg-gray-300 active:scale-95 transition-transform"
                >
                    5
                </button>
                <button 
                    onClick={() => handleNumber("6")}
                    className="bg-gray-200 text-black rounded-md py-3 px-1 hover:bg-gray-300 active:scale-95 transition-transform"
                >
                    6
                </button>
                <button 
                    className="bg-gray-400 text-black rounded-md py-3 px-1 hover:bg-gray-500 active:scale-95 transition-transform"
                >
                    (
                </button>
                <button 
                    className="bg-gray-400 text-black rounded-md py-3 px-1 hover:bg-gray-500 active:scale-95 transition-transform"
                >
                    )
                </button>
                
                {/* Fourth Row */}
                <button 
                    onClick={() => handleNumber("1")}
                    className="bg-gray-200 text-black rounded-md py-3 px-1 hover:bg-gray-300 active:scale-95 transition-transform"
                >
                    1
                </button>
                <button 
                    onClick={() => handleNumber("2")}
                    className="bg-gray-200 text-black rounded-md py-3 px-1 hover:bg-gray-300 active:scale-95 transition-transform"
                >
                    2
                </button>
                <button 
                    onClick={() => handleNumber("3")}
                    className="bg-gray-200 text-black rounded-md py-3 px-1 hover:bg-gray-300 active:scale-95 transition-transform"
                >
                    3
                </button>
                <button 
                    className="bg-gray-400 text-black rounded-md py-3 px-1 hover:bg-gray-500 active:scale-95 transition-transform"
                >
                    x²
                </button>
                <button 
                    className="bg-gray-400 text-black rounded-md py-3 px-1 hover:bg-gray-500 active:scale-95 transition-transform"
                >
                    √
                </button>
                
                {/* Fifth Row */}
                <button 
                    onClick={() => handleNumber("0")}
                    className="bg-gray-200 text-black rounded-md py-3 px-1 col-span-2 hover:bg-gray-300 active:scale-95 transition-transform"
                >
                    0
                </button>
                <button 
                    onClick={handleDecimal}
                    className="bg-gray-200 text-black rounded-md py-3 px-1 hover:bg-gray-300 active:scale-95 transition-transform"
                >
                    .
                </button>
                <button 
                    onClick={handleEquals}
                    className="bg-orange-500 text-white rounded-md py-3 px-1 hover:bg-orange-600 active:scale-95 transition-transform col-span-2"
                >
                    =
                </button>
                </div>
            </div>
        </div>
    </div>
  );
}

export default CalculatorPage;