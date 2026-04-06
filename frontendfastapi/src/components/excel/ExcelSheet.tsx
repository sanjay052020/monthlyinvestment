import React, { useState } from "react";
import "./ExcelSheet.css";

const ExcelSheet: React.FC<{ rows?: number; cols?: number }> = ({ rows = 10, cols = 5 }) => {
  const [data, setData] = useState<string[][]>(
    () => {
      const saved = localStorage.getItem("excelData");
      return saved ? JSON.parse(saved) : Array.from({ length: rows }, () => Array(cols).fill(""));
    }
  );

  const handleChange = (row: number, col: number, value: string) => {
    const newData = data.map((r, rowIndex) =>
      rowIndex === row
        ? r.map((c, colIndex) => (colIndex === col ? value : c))
        : [...r]
    );
    setData(newData);
    localStorage.setItem("excelData", JSON.stringify(newData));
  };

  return (
    <table className="excel-table">
      <thead>
        <tr>
          <th className="excel-row-header"></th>
          {Array.from({ length: cols }).map((_, colIndex) => (
            <th key={colIndex} className="excel-th">
              {String.fromCharCode(65 + colIndex)}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <tr key={rowIndex}>
            <td className="excel-row-header">{rowIndex + 1}</td>
            {Array.from({ length: cols }).map((_, colIndex) => (
              <td key={colIndex} className="excel-td">
                <input
                  className="excel-input"
                  value={data[rowIndex][colIndex]}
                  onChange={(e) => handleChange(rowIndex, colIndex, e.target.value)}
                />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ExcelSheet;