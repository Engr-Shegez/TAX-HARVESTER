import { Fragment, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectFilteredHoldings,
  selectSelectedIds,
  setSelectedIds,
  toggleSelection,
} from "../store/harvesterSlice";
import {
  formatCurrency,
  formatDate,
  formatNumber,
  formatPercent,
} from "../../../utils/formatters";

const ValuePair = ({ primary, secondary, tone = "neutral", align = "right" }) => {
  const toneClass =
    tone === "gain"
      ? "text-emerald-700 dark:text-green-400"
      : tone === "loss"
        ? "text-red-700 dark:text-red-400"
        : "text-stone-950 dark:text-slate-100";
  const alignmentClass = align === "left" ? "text-left" : "text-right";

  return (
    <div className={`min-w-0 space-y-1 ${alignmentClass}`}>
      <p className={`break-words font-mono text-sm font-semibold ${toneClass}`}>
        {primary}
      </p>
      <p className="break-words font-mono text-xs text-stone-500 dark:text-slate-500">
        {secondary}
      </p>
    </div>
  );
};

const ChevronIcon = ({ isExpanded }) => (
  <svg
    className={`h-4 w-4 transition-transform ${isExpanded ? "rotate-90" : ""}`}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
    aria-hidden="true"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="m9 18 6-6-6-6" />
  </svg>
);

const TermBadge = ({ children }) => (
  <span className="inline-flex border border-stone-300 bg-[#fffdf7] px-2 py-1 text-xs font-semibold capitalize text-stone-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300">
    {children}
  </span>
);

const MobileStat = ({ label, children, className = "" }) => (
  <div className={`min-w-0 ${className}`}>
    <p className="mb-1 text-[11px] font-semibold uppercase text-stone-500 dark:text-slate-500">
      {label}
    </p>
    {children}
  </div>
);

const MobileLotCard = ({ lot, isSelected, onToggle }) => (
  <label
    className={`block cursor-pointer p-4 transition hover:bg-[#f4eadb] dark:hover:bg-slate-900 ${
      isSelected
        ? "bg-[#eadcc6] ring-1 ring-inset ring-stone-500/40 dark:bg-blue-950/50 dark:ring-blue-500/40"
        : "bg-[#fffaf0] dark:bg-slate-950"
    }`}
  >
    <div className="flex gap-3">
      <input
        type="checkbox"
        checked={isSelected}
        onChange={onToggle}
        className="mt-1 h-4 w-4 shrink-0 accent-stone-900 dark:accent-blue-500"
        aria-label={`Select ${lot.coin} lot from ${lot.acquiredAt}`}
      />
      <div className="min-w-0 flex-1">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-stone-800 dark:text-slate-200">
              Acquired {formatDate(lot.acquiredAt)}
            </p>
            <p className="text-xs text-stone-500 dark:text-slate-500">
              {lot.heldDays} days held
            </p>
          </div>
          <TermBadge>{lot.holdingPeriod}</TermBadge>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3">
          <MobileStat label="Quantity">
            <p className="font-mono text-sm text-stone-700 dark:text-slate-300">
              {formatNumber(lot.quantity)}
            </p>
          </MobileStat>
          <MobileStat label="Gain / Loss">
            <ValuePair
              primary={formatCurrency(lot.unrealizedGain)}
              secondary={formatPercent(lot.lossPercent)}
              tone={lot.unrealizedGain < 0 ? "loss" : "gain"}
              align="left"
            />
          </MobileStat>
          <MobileStat label="Cost Basis">
            <ValuePair
              primary={formatCurrency(lot.costBasis)}
              secondary={`${formatCurrency(lot.costBasisPerUnit)} each`}
              align="left"
            />
          </MobileStat>
          <MobileStat label="Current Value">
            <ValuePair
              primary={formatCurrency(lot.currentValue)}
              secondary={`${formatCurrency(lot.currentPrice)} market`}
              align="left"
            />
          </MobileStat>
          <MobileStat label="Source">
            <p className="truncate text-sm text-stone-600 dark:text-slate-400">
              {lot.source}
            </p>
          </MobileStat>
          <MobileStat label="Harvest">
            <p className="font-mono text-sm text-stone-700 dark:text-slate-300">
              {isSelected ? formatCurrency(lot.currentValue) : "--"}
            </p>
          </MobileStat>
        </div>
      </div>
    </div>
  </label>
);

const HoldingTable = () => {
  const dispatch = useDispatch();
  const holdings = useSelector(selectFilteredHoldings);
  const selectedIds = useSelector(selectSelectedIds);
  const [expandedIds, setExpandedIds] = useState([]);

  const visibleLotIds = useMemo(
    () => holdings.flatMap((holding) => holding.taxLots.map((lot) => lot.id)),
    [holdings],
  );
  const allSelected =
    visibleLotIds.length > 0 && visibleLotIds.every((id) => selectedIds.includes(id));

  const handleSelectAll = () => {
    dispatch(setSelectedIds(allSelected ? [] : visibleLotIds));
  };

  const toggleExpanded = (holdingId) => {
    setExpandedIds((current) =>
      current.includes(holdingId)
        ? current.filter((id) => id !== holdingId)
        : [...current, holdingId],
    );
  };

  if (holdings.length === 0) {
    return (
      <div className="border border-stone-200 bg-[#fffaf0] p-10 text-center shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <p className="text-sm font-semibold text-stone-900 dark:text-slate-200">No harvestable lots match the current filters.</p>
        <p className="mt-1 text-sm text-stone-500 dark:text-slate-500">Try showing gains, dust balances, or another chain.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden border border-stone-200 bg-[#fffaf0] shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div className="flex flex-col gap-3 border-b border-stone-200 px-4 py-3 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-base font-bold text-stone-950 dark:text-slate-100">Holdings And Tax Lots</h2>
          <p className="text-sm text-stone-500 dark:text-slate-500">Expand each asset to choose the exact acquisition lots to harvest.</p>
        </div>
        <button
          type="button"
          onClick={handleSelectAll}
          className="min-h-10 w-full border border-stone-300 px-3 py-2 text-center text-sm font-semibold text-stone-700 transition hover:border-stone-700 hover:text-stone-950 dark:border-slate-700 dark:text-slate-200 dark:hover:border-blue-400 dark:hover:text-white sm:w-auto"
        >
          {allSelected ? "Clear visible lots" : `Select visible lots (${visibleLotIds.length})`}
        </button>
      </div>

      <div className="divide-y divide-stone-200 dark:divide-slate-900 lg:hidden">
        {holdings.map((holding) => {
          const isExpanded = expandedIds.includes(holding.id);
          const lots = holding.taxLots;
          const selectedLots = lots.filter((lot) => selectedIds.includes(lot.id));
          const selectedValue = selectedLots.reduce(
            (sum, lot) => sum + lot.currentValue,
            0,
          );

          return (
            <article key={holding.id}>
              <button
                type="button"
                onClick={() => toggleExpanded(holding.id)}
                className="w-full p-4 text-left transition hover:bg-[#f4eadb] dark:hover:bg-slate-900"
                aria-expanded={isExpanded}
              >
                <div className="flex items-start gap-3">
                  <span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center border border-stone-300 text-stone-500 dark:border-slate-700 dark:text-slate-400">
                    <ChevronIcon isExpanded={isExpanded} />
                  </span>
                  <img
                    src={holding.logo}
                    alt={holding.coin}
                    className="h-10 w-10 shrink-0 rounded-full bg-stone-100 dark:bg-slate-100"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-stone-950 dark:text-slate-100">
                      {holding.coin}
                    </p>
                    <p className="truncate text-xs text-stone-500 dark:text-slate-500">
                      {holding.coinName} - {holding.chain}
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3">
                  <MobileStat label="Quantity">
                    <p className="font-mono text-sm text-stone-800 dark:text-slate-200">
                      {formatNumber(holding.totalHolding)}
                    </p>
                  </MobileStat>
                  <MobileStat label="Gain / Loss">
                    <ValuePair
                      primary={formatCurrency(holding.unrealizedGain)}
                      secondary={`${selectedLots.length}/${lots.length} lots selected`}
                      tone={holding.unrealizedGain < 0 ? "loss" : "gain"}
                      align="left"
                    />
                  </MobileStat>
                  <MobileStat label="Cost Basis">
                    <p className="font-mono text-sm text-stone-700 dark:text-slate-300">
                      {formatCurrency(holding.costBasis)}
                    </p>
                  </MobileStat>
                  <MobileStat label="Current Value">
                    <p className="font-mono text-sm text-stone-700 dark:text-slate-300">
                      {formatCurrency(holding.currentValue)}
                    </p>
                  </MobileStat>
                  <MobileStat label="Source">
                    <p className="truncate text-sm text-stone-600 dark:text-slate-400">
                      {holding.source}
                    </p>
                  </MobileStat>
                  <MobileStat label="Harvest">
                    <p className="font-mono text-sm text-stone-700 dark:text-slate-300">
                      {selectedLots.length > 0 ? formatCurrency(selectedValue) : "--"}
                    </p>
                  </MobileStat>
                </div>
              </button>

              {isExpanded && (
                <div className="border-t border-stone-200 dark:border-slate-900">
                  <div className="bg-[#f8f0e3] px-4 py-2 text-xs font-semibold uppercase text-stone-500 dark:bg-slate-900/45 dark:text-slate-500">
                    {lots.length} tax {lots.length === 1 ? "lot" : "lots"}
                  </div>
                  <div className="divide-y divide-stone-200 dark:divide-slate-900">
                    {lots.map((lot) => (
                      <MobileLotCard
                        key={lot.id}
                        lot={lot}
                        isSelected={selectedIds.includes(lot.id)}
                        onToggle={() => dispatch(toggleSelection(lot.id))}
                      />
                    ))}
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>

      <div className="hidden overflow-x-auto lg:block">
        <table className="w-full min-w-[960px] border-collapse text-left">
          <thead>
            <tr className="border-b border-stone-200 bg-[#f1e6d4] text-xs uppercase text-stone-600 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-400">
              <th className="px-4 py-3">Asset / Lot</th>
              <th className="px-4 py-3 text-right">Quantity</th>
              <th className="px-4 py-3 text-right">Cost Basis</th>
              <th className="px-4 py-3 text-right">Current Value</th>
              <th className="px-4 py-3 text-right">Gain / Loss</th>
              <th className="px-4 py-3">Term</th>
              <th className="px-4 py-3">Source</th>
              <th className="px-4 py-3 text-right">Harvest</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200 dark:divide-slate-900">
            {holdings.map((holding) => {
              const isExpanded = expandedIds.includes(holding.id);
              const lots = holding.taxLots;
              const selectedLots = lots.filter((lot) => selectedIds.includes(lot.id));

              return (
                <Fragment key={holding.id}>
                  <tr key={holding.id} className="bg-[#f8f0e3] dark:bg-slate-900/45">
                    <td className="px-4 py-4">
                      <button
                        type="button"
                        onClick={() => toggleExpanded(holding.id)}
                        className="flex w-full items-center gap-3 text-left"
                        aria-expanded={isExpanded}
                      >
                        <span className="flex w-5 text-stone-500 dark:text-slate-500">
                          <ChevronIcon isExpanded={isExpanded} />
                        </span>
                        <img
                          src={holding.logo}
                          alt={holding.coin}
                          className="h-8 w-8 rounded-full bg-stone-100 dark:bg-slate-100"
                        />
                        <span>
                          <span className="block font-bold text-stone-950 dark:text-slate-100">{holding.coin}</span>
                          <span className="block max-w-64 truncate text-xs text-stone-500 dark:text-slate-500">
                            {holding.coinName} - {holding.chain}
                          </span>
                        </span>
                      </button>
                    </td>
                    <td className="px-4 py-4 text-right font-mono text-sm text-stone-800 dark:text-slate-200">
                      {formatNumber(holding.totalHolding)}
                    </td>
                    <td className="px-4 py-4 text-right font-mono text-sm text-stone-700 dark:text-slate-300">
                      {formatCurrency(holding.costBasis)}
                    </td>
                    <td className="px-4 py-4 text-right font-mono text-sm text-stone-700 dark:text-slate-300">
                      {formatCurrency(holding.currentValue)}
                    </td>
                    <td className="px-4 py-4">
                      <ValuePair
                        primary={formatCurrency(holding.unrealizedGain)}
                        secondary={`${selectedLots.length}/${lots.length} lots selected`}
                        tone={holding.unrealizedGain < 0 ? "loss" : "gain"}
                      />
                    </td>
                    <td className="px-4 py-4 text-sm text-stone-600 dark:text-slate-400">{lots.length} lots</td>
                    <td className="px-4 py-4 text-sm text-stone-600 dark:text-slate-400">{holding.source}</td>
                    <td className="px-4 py-4 text-right text-sm text-stone-500 dark:text-slate-500">
                      {selectedLots.length > 0
                        ? formatCurrency(
                            selectedLots.reduce((sum, lot) => sum + lot.currentValue, 0),
                          )
                        : "--"}
                    </td>
                  </tr>

                  {isExpanded &&
                    lots.map((lot) => {
                      const isSelected = selectedIds.includes(lot.id);

                      return (
                        <tr
                          key={lot.id}
                          onClick={() => dispatch(toggleSelection(lot.id))}
                          className={`cursor-pointer transition hover:bg-[#f4eadb] dark:hover:bg-slate-900 ${
                            isSelected ? "bg-[#eadcc6] ring-1 ring-inset ring-stone-500/40 dark:bg-blue-950/50 dark:ring-blue-500/40" : "bg-[#fffaf0] dark:bg-slate-950"
                          }`}
                        >
                          <td className="px-4 py-4">
                            <div className="ml-8 flex items-center gap-3">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onClick={(event) => event.stopPropagation()}
                                onChange={() => dispatch(toggleSelection(lot.id))}
                                className="h-4 w-4 accent-stone-900 dark:accent-blue-500"
                                aria-label={`Select ${lot.coin} lot from ${lot.acquiredAt}`}
                              />
                              <div>
                                <p className="text-sm font-semibold text-stone-800 dark:text-slate-200">
                                  Acquired {formatDate(lot.acquiredAt)}
                                </p>
                                <p className="text-xs text-stone-500 dark:text-slate-500">{lot.heldDays} days held</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-right font-mono text-sm text-stone-700 dark:text-slate-300">
                            {formatNumber(lot.quantity)}
                          </td>
                          <td className="px-4 py-4">
                            <ValuePair
                              primary={formatCurrency(lot.costBasis)}
                              secondary={`${formatCurrency(lot.costBasisPerUnit)} each`}
                            />
                          </td>
                          <td className="px-4 py-4">
                            <ValuePair
                              primary={formatCurrency(lot.currentValue)}
                              secondary={`${formatCurrency(lot.currentPrice)} market`}
                            />
                          </td>
                          <td className="px-4 py-4">
                            <ValuePair
                              primary={formatCurrency(lot.unrealizedGain)}
                              secondary={formatPercent(lot.lossPercent)}
                              tone={lot.unrealizedGain < 0 ? "loss" : "gain"}
                            />
                          </td>
                          <td className="px-4 py-4">
                            <TermBadge>{lot.holdingPeriod}</TermBadge>
                          </td>
                          <td className="px-4 py-4 text-sm text-stone-600 dark:text-slate-400">{lot.source}</td>
                          <td className="px-4 py-4 text-right font-mono text-sm text-stone-700 dark:text-slate-300">
                            {isSelected ? formatCurrency(lot.currentValue) : "--"}
                          </td>
                        </tr>
                      );
                    })}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HoldingTable;
