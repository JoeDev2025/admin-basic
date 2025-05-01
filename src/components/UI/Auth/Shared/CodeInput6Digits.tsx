import React, { useEffect, useRef, useState } from "react";

type CodeInput6DigitsProps = {
  onCodeChange: (code: string) => void; // Callback to pass the value back to the parent
};

export const CodeInput6Digits = ({ onCodeChange }: CodeInput6DigitsProps) => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]); // Array of input refs

  const handleChange = (value: string, index: number) => {
    if (value.match(/^\d$/)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      // Trigger the callback to pass the concatenated code to the parent
      onCodeChange(newCode.join(""));

      // Move focus to the next input if there is one
      if (index < inputRefs.current.length - 1) {
        inputRefs.current[index + 1]?.focus();
        inputRefs.current[index + 1]?.select();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Backspace") {
      const newCode = [...code];
      if (code[index] !== "") {
        newCode[index] = "";
        setCode(newCode);
        onCodeChange(newCode.join("")); // Trigger the callback with the updated value
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
        newCode[index - 1] = "";
        setCode(newCode);
        onCodeChange(newCode.join("")); // Trigger the callback with the updated value
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const pastedData = e.clipboardData.getData("Text").slice(0, 6);
    const newCode = [...code];

    pastedData.split("").forEach((char, index) => {
      if (index < 6 && char.match(/^\d$/)) {
        newCode[index] = char;
      }
    });

    setCode(newCode);
    onCodeChange(newCode.join("")); // Trigger the callback with the updated value
    inputRefs.current[Math.min(pastedData.length, 5)]?.focus();
  };

  const handleSelect = (e: React.FocusEvent) => {
    const target = e.target as HTMLInputElement;
    if (target.value) {
      target.select();
    }
  };

  // Focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.select();
  }, []);

  return (
    <div onPaste={handlePaste} className="flex justify-center space-x-2">
      {code.map((value, index) => (
        <input
          key={index}
          ref={(el: HTMLInputElement | null) => {
            inputRefs.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value}
          onChange={(e) => handleChange(e.target.value, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onFocus={(e) => handleSelect(e)}
          className="w-12 h-16 text-center border border-gray-300 text-black dark:text-gray-200 dark:bg-gray-950 font-bold rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-3xl font-mono"
        />
      ))}
    </div>
  );
};
