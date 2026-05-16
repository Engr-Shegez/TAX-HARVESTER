import React from "react";
import { formatCurrency } from "../../../utils/formatters";

const SavingsAlert = ({ preGain, postGain }) => {
  const savings = preGain - postGain;

  // Only show if pre-harvesting realized capital gains > post-harvesting
  if (preGain <= postGain || savings <= 0) return null;

  return (
    <div className="mt-4 flex items-center gap-3 rounded-md border border-green-500/20 bg-green-500/10 p-4 animate-in fade-in slide-in-from-top-2">
      <div className="bg-green-500 rounded-full p-1">
        <svg
          className="w-4 h-4 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={3}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
      <p className="text-sm font-bold text-green-400">
        Tax Strategy Active: You're going to save{" "}
        <span className="text-white">{formatCurrency(savings)}</span> in taxable
        gains.
      </p>
    </div>
  );
};

export default SavingsAlert;
