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

const ValuePair = ({ primary, secondary, tone = "neutral" }) => {
  const toneClass =
    tone === "gain"
      ? "text-green-400"
      : tone === "loss"
        ? "text-red-400"
        : "text-slate-100";

  return (
    <div className="space-y-1 text-right">
      <p className={`font-mono text-sm font-semibold ${toneClass}`}>{primary}</p>
      <p className="font-mono text-xs text-slate-500">{secondary}</p>
    </div>
  );
};

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
      <div className="border border-slate-800 bg-slate-950 p-10 text-center">
        <p className="text-sm font-semibold text-slate-200">No harvestable lots match the current filters.</p>
        <p className="mt-1 text-sm text-slate-500">Try showing gains, dust balances, or another chain.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden border border-slate-800 bg-slate-950">
      <div className="flex flex-col gap-3 border-b border-slate-800 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-100">Holdings And Tax Lots</h2>
          <p className="text-sm text-slate-500">Expand each asset to choose the exact acquisition lots to harvest.</p>
        </div>
        <button
          type="button"
          onClick={handleSelectAll}
          className="h-9 border border-slate-700 px-3 text-sm font-semibold text-slate-200 transition hover:border-blue-400 hover:text-white"
        >
          {allSelected ? "Clear visible lots" : `Select visible lots (${visibleLotIds.length})`}
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1080px] border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/80 text-xs uppercase text-slate-400">
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
          <tbody className="divide-y divide-slate-900">
            {holdings.map((holding) => {
              const isExpanded = expandedIds.includes(holding.id);
              const lots = holding.taxLots;
              const selectedLots = lots.filter((lot) => selectedIds.includes(lot.id));

              return (
                <Fragment key={holding.id}>
                  <tr key={holding.id} className="bg-slate-900/45">
                    <td className="px-4 py-4">
                      <button
                        type="button"
                        onClick={() => toggleExpanded(holding.id)}
                        className="flex w-full items-center gap-3 text-left"
                      >
                        <span className="w-5 text-slate-500">{isExpanded ? "v" : ">"}</span>
                        <img
                          src={holding.logo}
                          alt={holding.coin}
                          className="h-8 w-8 rounded-full bg-slate-100"
                        />
                        <span>
                          <span className="block font-bold text-slate-100">{holding.coin}</span>
                          <span className="block max-w-64 truncate text-xs text-slate-500">
                            {holding.coinName} - {holding.chain}
                          </span>
                        </span>
                      </button>
                    </td>
                    <td className="px-4 py-4 text-right font-mono text-sm text-slate-200">
                      {formatNumber(holding.totalHolding)}
                    </td>
                    <td className="px-4 py-4 text-right font-mono text-sm text-slate-300">
                      {formatCurrency(holding.costBasis)}
                    </td>
                    <td className="px-4 py-4 text-right font-mono text-sm text-slate-300">
                      {formatCurrency(holding.currentValue)}
                    </td>
                    <td className="px-4 py-4">
                      <ValuePair
                        primary={formatCurrency(holding.unrealizedGain)}
                        secondary={`${selectedLots.length}/${lots.length} lots selected`}
                        tone={holding.unrealizedGain < 0 ? "loss" : "gain"}
                      />
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-400">{lots.length} lots</td>
                    <td className="px-4 py-4 text-sm text-slate-400">{holding.source}</td>
                    <td className="px-4 py-4 text-right text-sm text-slate-500">
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
                          className={`cursor-pointer transition hover:bg-slate-900 ${
                            isSelected ? "bg-blue-950/50 ring-1 ring-inset ring-blue-500/40" : "bg-slate-950"
                          }`}
                        >
                          <td className="px-4 py-4">
                            <div className="ml-8 flex items-center gap-3">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onClick={(event) => event.stopPropagation()}
                                onChange={() => dispatch(toggleSelection(lot.id))}
                                className="h-4 w-4 accent-blue-500"
                                aria-label={`Select ${lot.coin} lot from ${lot.acquiredAt}`}
                              />
                              <div>
                                <p className="text-sm font-semibold text-slate-200">
                                  Acquired {formatDate(lot.acquiredAt)}
                                </p>
                                <p className="text-xs text-slate-500">{lot.heldDays} days held</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-right font-mono text-sm text-slate-300">
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
                            <span className="border border-slate-700 px-2 py-1 text-xs font-semibold capitalize text-slate-300">
                              {lot.holdingPeriod}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-sm text-slate-400">{lot.source}</td>
                          <td className="px-4 py-4 text-right font-mono text-sm text-slate-300">
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
