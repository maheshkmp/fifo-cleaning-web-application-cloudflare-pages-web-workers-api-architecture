"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export interface OTPInputProps {
  length?: number;
  onComplete: (code: string) => void;
  disabled?: boolean;
  error?: boolean;
}

export function OTPInput({
  length = 6,
  onComplete,
  disabled = false,
  error = false,
}: OTPInputProps) {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Auto-focus first input on mount
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (index: number, value: string) => {
    if (disabled) return;

    // Only accept numeric input
    const numericValue = value.replace(/[^0-9]/g, "");
    
    if (numericValue.length > 1) {
      // Handle paste: split across all boxes
      const pastedData = numericValue.slice(0, length);
      const newOtp = Array(length).fill("");
      
      for (let i = 0; i < pastedData.length; i++) {
        newOtp[i] = pastedData[i];
      }
      
      setOtp(newOtp);
      
      // Focus the next empty box or the last box
      const nextIndex = Math.min(pastedData.length, length - 1);
      inputRefs.current[nextIndex]?.focus();
      
      // Check if complete
      if (pastedData.length === length) {
        onComplete(newOtp.join(""));
      }
      return;
    }

    // Single character input
    const newOtp = [...otp];
    newOtp[index] = numericValue;
    setOtp(newOtp);

    // Auto-advance to next box
    if (numericValue && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Call onComplete if all boxes are filled
    if (newOtp.every((digit) => digit !== "") && newOtp.length === length) {
      onComplete(newOtp.join(""));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;

    if (e.key === "Backspace") {
      e.preventDefault();
      
      if (otp[index]) {
        // Clear current box
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      } else if (index > 0) {
        // Move to previous box and clear it
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleFocus = (index: number) => {
    // Select all text on focus for easy replacement
    inputRefs.current[index]?.select();
  };

  // Public method to clear all inputs
  useEffect(() => {
    if (error) {
      // Clear all inputs when error is set
      setOtp(Array(length).fill(""));
      // Refocus first input
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 0);
    }
  }, [error, length]);

  return (
    <div className="flex gap-2 justify-center">
      {otp.map((digit, index) => (
        <input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onFocus={() => handleFocus(index)}
          disabled={disabled}
          className={cn(
            "w-10 h-11 text-center text-lg font-semibold font-mono",
            "border rounded-md transition-all duration-150",
            "focus:outline-none focus:ring-2 focus:ring-offset-1",
            error
              ? "border-red-400 focus:border-red-500 focus:ring-red-400/30 bg-red-50 dark:bg-red-950/20"
              : "border-gray-200 dark:border-gray-700 focus:border-violet-500 focus:ring-violet-500/20",
            disabled && "opacity-40 cursor-not-allowed bg-gray-50 dark:bg-gray-900",
            !disabled && "bg-white dark:bg-gray-950 hover:border-violet-400 dark:hover:border-violet-600",
            "text-gray-900 dark:text-gray-100 caret-violet-500"
          )}
        />
      ))}
    </div>
  );
}
