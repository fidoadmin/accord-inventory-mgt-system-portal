"use client";

import { useState, useMemo } from "react";
import { Check, X, Eye, EyeOff } from "lucide-react";
import { VisibilityOffRounded, VisibilityRounded } from "@mui/icons-material";

interface PasswordStrengthFieldProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  visible: boolean;
  onToggleVisibility: () => void;
}

export default function PasswordStrengthField({
  value,
  onChange,
  visible,
  onToggleVisibility,
}: PasswordStrengthFieldProps) {
  const checkStrength = (pass: string) => {
    const requirements = [
      { regex: /.{8,}/, text: "At least 8 characters" },
      { regex: /[0-9]/, text: "At least 1 number" },
      { regex: /[a-z]/, text: "At least 1 lowercase letter" },
      { regex: /[A-Z]/, text: "At least 1 uppercase letter" },
      { regex: /[^A-Za-z0-9]/, text: "At least 1 special character" },
    ];

    return requirements.map((req) => ({
      met: req.regex.test(pass),
      text: req.text,
    }));
  };

  const strength = checkStrength(value);

  const strengthScore = useMemo(() => {
    return strength.filter((req) => req.met).length;
  }, [strength]);

  const getStrengthColor = (score: number) => {
    if (score === 0) return "bg-gray-200";
    if (score <= 2) return "bg-red-500";
    if (score <= 4) return "bg-amber-500";
    return "bg-emerald-500";
  };

  const getStrengthText = (score: number) => {
    if (score === 0) return "Enter a password";
    if (score <= 2) return "Weak password";
    if (score <= 4) return "Medium password";
    return "Strong password";
  };

  return (
    <div className="max-w-md">
      <div className="relative mb-3">
        <input
          id="password"
          type={visible ? "text" : "password"}
          className="w-full text-sm text-slate-600 bg-white border border-slate-300 appearance-none rounded-lg ps-3.5 pe-10 py-2.5 outline-none focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
          placeholder="Enter your password..."
          value={value}
          onChange={onChange}
          aria-label="Password"
          aria-invalid={strengthScore < 5}
          aria-describedby="password-strength"
          required
        />
        <button
          className="absolute inset-y-0 end-0 flex items-center z-20 px-2.5 cursor-pointer text-gray-400 rounded-e-md focus:outline-none focus-visible:text-indigo-500 hover:text-indigo-500 transition-colors"
          type="button"
          onClick={onToggleVisibility}
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
          aria-controls="password"
        >
          {visible ? <VisibilityRounded /> : <VisibilityOffRounded />}
        </button>
      </div>

      <div
        className="h-1 w-full bg-gray-200 rounded-full overflow-hidden mb-4"
        role="progressbar"
        aria-valuenow={strengthScore}
        aria-valuemin={0}
        aria-valuemax={5}
        aria-label="Password strength"
      >
        <div
          className={`h-full ${getStrengthColor(
            strengthScore
          )} transition-all duration-500 ease-out`}
          style={{ width: `${(strengthScore / 5) * 100}%` }}
        ></div>
      </div>

      <p
        id="password-strength"
        className="text-sm font-medium text-gray-700 mb-2"
      >
        {getStrengthText(strengthScore)}. Must contain:
      </p>

      <ul className="space-y-1" aria-label="Password requirements">
        {strength.map((req, index) => (
          <li key={index} className="flex items-center space-x-2">
            {req.met ? (
              <Check
                size={16}
                className="text-emerald-500"
                aria-hidden="true"
              />
            ) : (
              <X size={16} className="text-gray-400" aria-hidden="true" />
            )}
            <span
              className={`text-xs ${
                req.met ? "text-emerald-600" : "text-gray-500"
              }`}
            >
              {req.text}
              <span className="sr-only">
                {req.met ? " - Requirement met" : " - Requirement not met"}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
