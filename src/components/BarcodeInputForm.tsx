"use client";
import { BarcodeInputFormPropsInterface } from "@/types/ComponentInterface";
import { CloseRounded } from "@mui/icons-material";
import React from "react";
import { useState, useRef, useEffect, useCallback } from "react";

export default function BarcodeInputForm({
  onChange,
  onClick,
  value,
  index,
  className,
}: BarcodeInputFormPropsInterface) {
  const [barcode, setBarcode] = useState<string>("");
  const [error, setError] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (finalBarcode: string) => {
    if (finalBarcode.trim()) {
      onChange(finalBarcode);
    } else {
      setError("Barcode cannot be empty.");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    // Only allow numbers in the input
    const cleanedInput = inputValue.replace(/[^0-9a-zA-Z]/g, "");

    setBarcode(cleanedInput.toUpperCase());

    if (timer) clearTimeout(timer);

    const newTimer = setTimeout(() => {
      if (cleanedInput) {
        handleSubmit(cleanedInput); // Submit the final barcode
        setIsDisabled(true); // Disable the input after submission
      }
    }, 300);

    setTimer(newTimer);
  };
  const handleClear = useCallback(() => {
    setBarcode("");
    setIsDisabled(false);
    onChange("");
  }, [onChange]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.ctrlKey && e.key.toLowerCase() === "j") {
      e.preventDefault();
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();

      return;
    }
    if (!/[0-9a-zA-Z]/.test(e.key) && e.key !== "Backspace") {
      e.preventDefault();
    }
  };

  useEffect(() => {
    const inputElement = inputRef.current;

    if (inputElement) {
      inputElement.focus();
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [timer]);

  return (
    <>
      <div
        className={`rounded-xl border px-4 bg-transparent flex justify-between ${
          className ? className : ""
        } ${isDisabled ? "border-primary opacity-60" : "border-primary"}`}
      >
        <input
          type="text"
          value={barcode}
          onKeyDown={handleKeyDown}
          onChange={handleInputChange}
          onClick={() => onClick?.(index)}
          placeholder="Scan barcode"
          className={`placeholder:text-primary placeholder:text-opacity-60 placeholder:text-center w-fit mx-auto text-center bg-transparent focus:outline-none py-2 shadow-sm text-xs sm:text-sm text-primary`}
          disabled={isDisabled}
          ref={inputRef}
        />
        {isDisabled && (
          <button type="button" onClick={handleClear} className={`clearBtn`}>
            <CloseRounded className="ml-2 -mr-1 h-5 w-5 text-error" />
          </button>
        )}
      </div>
      {error && (
        <div className="errorDiv text-error text-center -my-4">{error}</div>
      )}
    </>
  );
}
