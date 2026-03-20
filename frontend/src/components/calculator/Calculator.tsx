import React, { useState } from "react";
import "./Calculator.css";

const Calculator: React.FC = () => {
  const [display, setDisplay] = useState("0");

  const handleClick = (value: string) => {
    if (display === "0" && value !== ".") {
      setDisplay(value);
    } else {
      setDisplay(display + value);
    }
  };

  const handleClear = () => {
    setDisplay("0");
  };

  const handleEquals = () => {
    try {
      // Evaluate safely
      const result = eval(display); // For demo purposes only
      setDisplay(String(result));
    } catch {
      setDisplay("Error");
    }
  };

  return (
    <div className="calculator">
      <div className="display">{display}</div>
      <div className="buttons">
        <button onClick={handleClear} className="clear">C</button>
        <button onClick={() => handleClick("/")}>÷</button>
        <button onClick={() => handleClick("*")}>×</button>
        <button onClick={() => handleClick("-")}>−</button>

        <button onClick={() => handleClick("7")}>7</button>
        <button onClick={() => handleClick("8")}>8</button>
        <button onClick={() => handleClick("9")}>9</button>
        <button onClick={() => handleClick("+")}>+</button>

        <button onClick={() => handleClick("4")}>4</button>
        <button onClick={() => handleClick("5")}>5</button>
        <button onClick={() => handleClick("6")}>6</button>
        <button onClick={handleEquals} className="equals">=</button>

        <button onClick={() => handleClick("1")}>1</button>
        <button onClick={() => handleClick("2")}>2</button>
        <button onClick={() => handleClick("3")}>3</button>
        <button onClick={() => handleClick("0")} className="zero">0</button>
        <button onClick={() => handleClick(".")}>.</button>
      </div>
    </div>
  );
};

export default Calculator;