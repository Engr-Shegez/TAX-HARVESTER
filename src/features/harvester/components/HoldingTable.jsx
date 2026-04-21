import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectSelectedIds,
  setSelectedIds,
  toggleSelection,
} from "../store/harvesterSlice";
import { formatCurrency } from "../../../utils/formatters";

const SORTABLE_COLUMNS = {
  asset: {
    label: "Asset",
    getValue: (item) => `${item.coin} ${item.coinName}`.toLowerCase(),
  },
  averageBuyPrice: {
    label: "Holding Avg Buy Price",
    getValue: (item) => Number(item.averageBuyPrice) || 0,
  },
  currentPrice: {
    label: "Current Price",
    getValue: (item) => Number(item.currentPrice) || 0,
  },
  stGain: {
    label: "Short Term Gain",
    getValue: (item) => Number(item.stcg?.gain) || 0,
  },
  ltGain: {
    label: "Long Term Gain",
    getValue: (item) => Number(item.ltcg?.gain) || 0,
  },
  amountToSell: {
    label: "Amount to Sell",
    getValue: (item) => Number(item.totalHolding) || 0,
  },
};

const formatAmount = (value) => {
  const amount = Number(value);

  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 6,
  }).format(Number.isFinite(amount) ? amount : 0);
};

const ValuePair = ({
  primary,
  secondary,
  primaryClassName = "text-slate-200",
  secondaryClassName = "text-slate-400",
}) => {
  return (
    <div className="space-y-1 text-right">
      <p className={`font-mono text-sm ${primaryClassName}`}>{primary}</p>
      <p className={`font-mono text-xs ${secondaryClassName}`}>{secondary}</p>
    </div>
  );
};

const SortButton = ({ columnKey, label, sortConfig, onSort, align = "left" }) => {
  const isActive = sortConfig.key === columnKey;
  const direction = isActive ? sortConfig.direction : null;
  const iconClassName =
    align === "right"
      ? "inline-flex items-center justify-end gap-2 w-full"
      : "inline-flex items-center gap-2";

  return (
    <button
      type="button"
      onClick={() => onSort(columnKey)}
      className={`${iconClassName} font-medium transition-colors hover:text-white`}
    >
      <span>{label}</span>
      <span
        className={`text-[10px] ${isActive ? "text-blue-400" : "text-slate-500"}`}
        aria-hidden="true"
      >
        {direction === "asc" ? "^" : direction === "desc" ? "v" : "-"}
      </span>
    </button>
  );
};

const HoldingsTable = ({ holdings }) => {
  const dispatch = useDispatch();
  const selectedIds = useSelector(selectSelectedIds);
  const [showAll, setShowAll] = useState(false);
  const [sortConfig, setSortConfig] = useState({
    key: "asset",
    direction: "asc",
  });
  const selectAllRef = useRef(null);

  const sortedHoldings = [...holdings].sort((left, right) => {
    const column = SORTABLE_COLUMNS[sortConfig.key];

    if (!column) {
      return 0;
    }

    const leftValue = column.getValue(left);
    const rightValue = column.getValue(right);

    if (leftValue < rightValue) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }

    if (leftValue > rightValue) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }

    return 0;
  });

  const visibleHoldings = showAll ? sortedHoldings : sortedHoldings.slice(0, 4);
  const allHoldingIds = sortedHoldings.map((item) => item.id);
  const allSelected =
    holdings.length > 0 && allHoldingIds.every((id) => selectedIds.includes(id));
  const partiallySelected =
    selectedIds.length > 0 && allHoldingIds.some((id) => selectedIds.includes(id)) && !allSelected;

  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate = partiallySelected;
    }
  }, [partiallySelected]);

  const handleRowClick = (holdingId) => {
    dispatch(toggleSelection(holdingId));
  };

  const handleSort = (columnKey) => {
    setSortConfig((currentSort) => ({
      key: columnKey,
      direction:
        currentSort.key === columnKey && currentSort.direction === "asc"
          ? "desc"
          : "asc",
    }));
  };

  const handleSelectAllChange = () => {
    dispatch(setSelectedIds(allSelected ? [] : allHoldingIds));
  };

  return (
    <div className="w-full">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-slate-200 text-xs uppercase tracking-wider border-b border-slate-700">
              <th className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <input
                    ref={selectAllRef}
                    type="checkbox"
                    checked={allSelected}
                    onChange={handleSelectAllChange}
                    className="h-4 w-4 rounded border-slate-500 bg-slate-900 text-blue-500 accent-blue-500"
                    aria-label={
                      allSelected ? "Deselect all holdings" : "Select all holdings"
                    }
                  />
                  <SortButton
                    columnKey="asset"
                    label={SORTABLE_COLUMNS.asset.label}
                    sortConfig={sortConfig}
                    onSort={handleSort}
                  />
                </div>
              </th>
              <th className="px-6 py-4 text-right">
                <SortButton
                  columnKey="averageBuyPrice"
                  label={SORTABLE_COLUMNS.averageBuyPrice.label}
                  sortConfig={sortConfig}
                  onSort={handleSort}
                  align="right"
                />
              </th>
              <th className="px-6 py-4 text-right">
                <SortButton
                  columnKey="currentPrice"
                  label={SORTABLE_COLUMNS.currentPrice.label}
                  sortConfig={sortConfig}
                  onSort={handleSort}
                  align="right"
                />
              </th>
              <th className="px-6 py-4 text-right">
                <SortButton
                  columnKey="stGain"
                  label={SORTABLE_COLUMNS.stGain.label}
                  sortConfig={sortConfig}
                  onSort={handleSort}
                  align="right"
                />
              </th>
              <th className="px-6 py-4 text-right">
                <SortButton
                  columnKey="ltGain"
                  label={SORTABLE_COLUMNS.ltGain.label}
                  sortConfig={sortConfig}
                  onSort={handleSort}
                  align="right"
                />
              </th>
              <th className="px-6 py-4 text-right">
                <SortButton
                  columnKey="amountToSell"
                  label={SORTABLE_COLUMNS.amountToSell.label}
                  sortConfig={sortConfig}
                  onSort={handleSort}
                  align="right"
                />
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-800">
            {visibleHoldings.map((item) => {
              const isSelected = selectedIds.includes(item.id);

              return (
                <tr
                  key={item.id}
                  onClick={() => handleRowClick(item.id)}
                  className={`cursor-pointer transition-all duration-200 hover:bg-slate-800/80 ${
                    isSelected ? "bg-blue-950/40 ring-1 ring-inset ring-blue-500/40" : ""
                  }`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onClick={(event) => event.stopPropagation()}
                        onChange={() => handleRowClick(item.id)}
                        className="mt-0.5 h-4 w-4 rounded border-slate-500 bg-slate-900 text-blue-500 accent-blue-500"
                        aria-label={`Select ${item.coin}`}
                      />
                      <img
                        src={item.logo}
                        alt={item.coin}
                        className="w-8 h-8 rounded-full bg-slate-100"
                      />
                      <div>
                        <p className="font-bold text-slate-200">{item.coin}</p>
                        <p className="text-xs text-slate-400 truncate max-w-52">
                          {item.coinName}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-right font-mono text-slate-200 text-sm">
                    <ValuePair
                      primary={formatAmount(item.totalHolding)}
                      secondary={`${formatCurrency(item.averageBuyPrice)} ${item.coin}`}
                      secondaryClassName="text-slate-500"
                    />
                  </td>

                  <td className="px-6 py-4 text-right font-mono text-slate-200 text-sm">
                    {formatCurrency(item.currentPrice)}
                  </td>

                  <td className="px-6 py-4">
                    <ValuePair
                      primary={formatCurrency(item.stcg.gain)}
                      secondary={`${formatAmount(item.stcg.balance)} ${item.coin}`}
                      primaryClassName={
                        item.stcg.gain >= 0 ? "text-green-400" : "text-red-400"
                      }
                      secondaryClassName="text-slate-500"
                    />
                  </td>

                  <td className="px-6 py-4">
                    <ValuePair
                      primary={formatCurrency(item.ltcg.gain)}
                      secondary={`${formatAmount(item.ltcg.balance)} ${item.coin}`}
                      primaryClassName={
                        item.ltcg.gain >= 0 ? "text-green-400" : "text-red-400"
                      }
                      secondaryClassName="text-slate-500"
                    />
                  </td>

                  <td className="px-6 py-4 text-right font-mono text-slate-200 text-sm">
                    {isSelected ? (
                      formatAmount(item.totalHolding)
                    ) : (
                      <span className="text-slate-500">--</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {holdings.length > 4 && (
        <div className="p-4 border-t border-slate-800 text-center">
          <button
            type="button"
            onClick={() => setShowAll(!showAll)}
            className="text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors"
          >
            {showAll ? "View Less" : `View All (${holdings.length})`}
          </button>
        </div>
      )}
    </div>
  );
};

export default HoldingsTable;
