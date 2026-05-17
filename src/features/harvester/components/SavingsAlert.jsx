import React from "react";
import { formatCurrency } from "../../../utils/formatters";

const SavingsAlert = ({ preGain, postGain }) => {
  const savings = preGain - postGain;

  // Only show if pre-harvesting realized capital gains > post-harvesting
  if (preGain <= postGain || savings <= 0) return null;

  return (
    <div className="mt-4 flex min-w-0 items-start gap-3 rounded-md border border-emerald-200 bg-emerald-50 p-4 animate-in fade-in slide-in-from-top-2 dark:border-green-500/20 dark:bg-green-500/10">
      <div className="shrink-0 rounded-full bg-emerald-600 p-1">
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
      <p className="min-w-0 break-words text-sm font-bold text-emerald-800 dark:text-green-400">
        Tax Strategy Active: You're going to save{" "}
        <span className="text-emerald-950 dark:text-white">{formatCurrency(savings)}</span> in taxable
        gains.
      </p>
    </div>
  );
};

export default SavingsAlert;
