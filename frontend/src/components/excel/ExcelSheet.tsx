import React, { useState } from "react";
import "./ExcelSheet.css";

type CellProps = {
  row: number;
  col: number;
  value: string;
  onChange: (row: number, col: number, value: string) => void;
};

const Cell: React.FC<CellProps> = ({ row, col, value, onChange }) => {
  return (
    <td className="excel-td">
      <input
        className="excel-input"
        value={value}
        onChange={(e) => onChange(row, col, e.target.value)}
      />
    </td>
  );
};

type ExcelSheetProps = {
  rows?: number;
  cols?: number;
};

const ExcelSheet: React.FC<ExcelSheetProps> = ({ rows = 10, cols = 5 }) => {
  const [data, setData] = useState<string[][]>(
    Array.from({ length: rows }, () => Array(cols).fill(""))
  );

  const handleChange = (row: number, col: number, value: string) => {
    const newData = [...data];
    newData[row][col] = value;
    setData(newData);
  };

  return (
    <table className="excel-table">
      <thead>
        <tr>
          <th className="excel-row-header"></th>
          {Array.from({ length: cols }).map((_, colIndex) => (
            <th key={colIndex} className="excel-th">
              {String.fromCharCode(65 + colIndex)} {/* A, B, C... */}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <tr key={rowIndex}>
            <td className="excel-row-header">{rowIndex + 1}</td>
            {Array.from({ length: cols }).map((_, colIndex) => (
              <Cell
                key={colIndex}
                row={rowIndex}
                col={colIndex}
                value={data[rowIndex][colIndex]}
                onChange={handleChange}
              />
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ExcelSheet;