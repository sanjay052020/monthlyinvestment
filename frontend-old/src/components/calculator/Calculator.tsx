import React, { useState, useEffect } from "react";
import "./Calculator.css";

const Calculator: React.FC = () => {
  const [queue, setQueue] = useState<string[]>([]);
  const [display, setDisplay] = useState("0");

  const handleClick = (value: string) => {
    setQueue((prev) => [...prev, value]);
    setDisplay((prev) =>
      prev === "0" && value !== "." && value !== "00"
        ? value
        : prev + value
    );
  };

  const handleClear = () => {
    setQueue([]);
    setDisplay("0");
  };

  const handleDelete = () => {
    setQueue((prev) => prev.slice(0, -1));
    setDisplay((prev) =>
      prev.length > 1 ? prev.slice(0, -1) : "0"
    );
  };

  const handleEquals = () => {
    try {
      const expression = queue.join("");
      const result = eval(expression); // demo only
      setDisplay(String(result));
      setQueue([String(result)]);
    } catch {
      setDisplay("Error");
      setQueue([]);
    }
  };

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isNaN(Number(e.key))) {
        handleClick(e.key);
      } else if (["+", "-", "*", "/"].includes(e.key)) {
        handleClick(e.key);
      } else if (e.key === "Enter") {
        handleEquals();
      } else if (e.key === "Escape") {
        handleClear();
      } else if (e.key === ".") {
        handleClick(".");
      } else if (e.key === "Backspace") {
        handleDelete();
      } else if (e.shiftKey && e.key === "0") {
        handleClick("00");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="calculator">
      <div className="display">{display}</div>

      <div className="calbuttons">
        <button onClick={handleClear} className="clear">C</button>
        <button onClick={handleDelete} className="delete">⌫</button>
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
        <button onClick={() => handleClick("00")} className="double-zero">00</button>
        <button onClick={() => handleClick(".")}>.</button>
      </div>
    </div>
  );
};

export default Calculator;