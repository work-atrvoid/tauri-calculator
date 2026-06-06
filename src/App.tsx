import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";

function formatNumber(num: number): string {
  if (!isFinite(num)) return "Error";

  if (Number.isInteger(num)) return num.toString();

  return parseFloat(num.toFixed(10)).toString();
}

function App() {
  const [display, setDisplay] = useState("0");
  const [history, setHistory] = useState("");

  const [firstNumber, setFirstNumber] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);

  const handleNumber = (num: string) => {
    setDisplay((prev) => (prev === "0" ? num : prev + num));
  };

  const handleOperator = (op: string) => {
    setFirstNumber(Number(display));
    setOperator(op);
    setHistory(`${display} ${op}`);
    setDisplay("0");
  };

  const handleClear = () => {
    setDisplay("0");
    setHistory("");
    setFirstNumber(null);
    setOperator(null);
  };

  const handleEquals = async () => {
    if (firstNumber === null || operator === null) return;

    try {
      const secondNumber = Number(display);

      const result = await invoke<number>("calculate", {
        a: firstNumber,
        b: secondNumber,
        operator,
      });

      setHistory(`${firstNumber} ${operator} ${secondNumber} =`);
      setDisplay(formatNumber(result));

      setFirstNumber(null);
      setOperator(null);
    } catch (e) {
      console.log("Rust error:", e);
      setDisplay(typeof e === "string" ? e : "Error");
    }
  };

  const buttons = [
    "7", "8", "9", "/",
    "4", "5", "6", "*",
    "1", "2", "3", "-",
    "0", "C", "=", "+"
  ];

  return (
    <div className="calculator">
      <div className="display">
        <div className="history">{history}</div>
        <div className="current">{display}</div>
      </div>

      <div className="buttons">
        {buttons.map((btn) => (
          <button
            key={btn}
            onClick={() => {
              if (!isNaN(Number(btn))) {
                handleNumber(btn);
              } else if (btn === "C") {
                handleClear();
              } else if (btn === "=") {
                handleEquals();
              } else {
                handleOperator(btn);
              }
            }}
          >
            {btn}
          </button>
        ))}
      </div>
    </div>
  );
}

export default App;