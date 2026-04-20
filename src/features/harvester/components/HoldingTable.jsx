import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleSelection, selectSelectedIds } from "../store/harvesterSlice";
import { formatCurrency } from "../../../utils/formatters";

const HoldingsTable = ({ holdings }) => {
  const dispatch = useDispatch();
  const selectedIds = useSelector(selectSelectedIds);
  const [showAll, setShowAll] = useState(false);

  const visibleHoldings = showAll ? holdings : holdings.slice(0, 8);

  const handleRowClick = (coinId) => {
    dispatch(toggleSelection(coinId));
  };

  return (
    <div className="w-full">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-slate-400 text-xs uppercase tracking-wider border-b border-slate-100">
              <th className="px-6 py-4 font-medium">Asset</th>
              <th className="px-6 py-4 font-medium text-right">Price</th>
              <th className="px-6 py-4 font-medium text-right">STCG Gain</th>
              <th className="px-6 py-4 font-medium text-right">LTCG Gain</th>
              <th className="px-6 py-4 font-medium text-center">Status</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-50">
            {visibleHoldings.map((item, index) => {
              const uniqueKey = `${item.coin}-${index}`;
              const isSelected = selectedIds.includes(uniqueKey);

              return (
                <tr
                  key={uniqueKey}
                  onClick={() => handleRowClick(uniqueKey)}
                  className={`cursor-pointer transition-all duration-200 hover:bg-slate-50 ${
                    isSelected
                      ? "bg-blue-50/50 ring-1 ring-inset ring-blue-200"
                      : ""
                  }`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.logo}
                        alt={item.coin}
                        className="w-8 h-8 rounded-full bg-slate-100"
                      />
                      <div>
                        <p className="font-bold text-slate-900">{item.coin}</p>
                        <p className="text-xs text-slate-500 truncate max-w-[150px]">
                          {item.coinName}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-right font-mono text-sm">
                    {formatCurrency(item.currentPrice)}
                  </td>

                  <td
                    className={`px-6 py-4 text-right font-medium ${
                      item.stcg.gain >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {formatCurrency(item.stcg.gain)}
                  </td>

                  <td
                    className={`px-6 py-4 text-right font-medium ${
                      item.ltcg.gain >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {formatCurrency(item.ltcg.gain)}
                  </td>

                  <td className="px-6 py-4 text-center">
                    <div
                      className={`inline-flex items-center justify-center w-6 h-6 rounded-full border-2 transition-colors ${
                        isSelected
                          ? "bg-blue-600 border-blue-600"
                          : "border-slate-200"
                      }`}
                    >
                      {isSelected && (
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
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {holdings.length > 8 && (
        <div className="p-4 border-t border-slate-100 text-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
          >
            {showAll ? "View Less" : `View All (${holdings.length})`}
          </button>
        </div>
      )}
    </div>
  );
};
export default HoldingsTable;
