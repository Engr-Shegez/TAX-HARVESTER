import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCapitalGains,
  fetchHoldings,
  fetchSettings,
  fetchTransactions,
} from "./api/holdingsApi";
import {
  clearSelections,
  selectAllHoldings,
  selectHarvestOpportunities,
  selectPortfolioMetrics,
  selectPostHarvestTotals,
  selectReportRows,
  selectSelectedLots,
  selectSettings,
  selectTransactions,
  selectedPreHarvestTotals,
  selectRecommendedLots,
  setCapitalGains,
  setError,
  setHoldings,
  setLoading,
  setSettings,
  setTransactions,
  toggleSelection,
  updateFilters,
  updateSettings,
} from "./features/harvester/store/harvesterSlice";
import SummaryCard from "./features/harvester/components/SummaryCard";
import HoldingsTable from "./features/harvester/components/HoldingTable";
import SavingsAlert from "./features/harvester/components/SavingsAlert";
import {
  formatCurrency,
  formatDate,
  formatNumber,
  formatPercent,
} from "./utils/formatters";

const MetricCard = ({ label, value, detail, tone = "neutral" }) => {
  const toneClass =
    tone === "good"
      ? "text-emerald-700 dark:text-green-400"
      : tone === "warn"
        ? "text-amber-700 dark:text-amber-300"
        : tone === "bad"
          ? "text-red-700 dark:text-red-400"
          : "text-stone-950 dark:text-slate-100";

  return (
    <div className="min-w-0 border border-stone-200 bg-[#fffaf0] p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <p className="text-xs font-semibold uppercase tracking-wide text-stone-500 dark:text-slate-500">
        {label}
      </p>
      <p className={`mt-2 break-words font-mono text-xl font-bold ${toneClass}`}>{value}</p>
      <p className="mt-1 text-xs text-stone-500 dark:text-slate-500">{detail}</p>
    </div>
  );
};

const Field = ({ label, children }) => (
  <label className="space-y-1 text-sm">
    <span className="block text-xs font-semibold uppercase tracking-wide text-stone-500 dark:text-slate-500">
      {label}
    </span>
    {children}
  </label>
);

const selectClassName =
  "h-10 min-w-0 w-full border border-stone-300 bg-[#fffdf7] px-3 text-sm text-stone-900 outline-none transition focus:border-stone-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-blue-400";

const SunIcon = () => (
  <svg
    className="h-4 w-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
  </svg>
);

const MoonIcon = () => (
  <svg
    className="h-4 w-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
    aria-hidden="true"
  >
    <path d="M21 12.8A8.5 8.5 0 1 1 11.2 3a6.8 6.8 0 0 0 9.8 9.8Z" />
  </svg>
);

const OpportunityPanel = () => {
  const dispatch = useDispatch();
  const opportunities = useSelector(selectHarvestOpportunities).slice(0, 5);
  const selectedLots = useSelector(selectSelectedLots);

  return (
    <section className="min-w-0 border border-stone-200 bg-[#fffaf0] shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div className="flex flex-col gap-3 border-b border-stone-200 p-4 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-base font-bold text-stone-950 dark:text-slate-100">Harvest Opportunities</h2>
          <p className="break-words text-sm text-stone-500 dark:text-slate-500">
            Ranked by realized loss, holding period, and selected accounting method.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={() => dispatch(selectRecommendedLots())}
            className="min-h-9 w-full bg-stone-900 px-3 py-2 text-sm font-semibold text-[#fffaf0] transition hover:bg-stone-700 dark:bg-blue-600 dark:text-white dark:hover:bg-blue-500 sm:w-auto"
          >
            Auto-select best lots
          </button>
          <button
            type="button"
            onClick={() => dispatch(clearSelections())}
            className="min-h-9 w-full border border-stone-300 px-3 py-2 text-sm font-semibold text-stone-700 transition hover:border-stone-700 dark:border-slate-700 dark:text-slate-200 dark:hover:border-slate-500 sm:w-auto"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="divide-y divide-stone-200 dark:divide-slate-900">
        {opportunities.map((lot) => {
          const isSelected = selectedLots.some((selected) => selected.id === lot.id);

          return (
            <button
              key={lot.id}
              type="button"
              onClick={() => dispatch(toggleSelection(lot.id))}
              className={`grid w-full gap-3 p-4 text-left transition hover:bg-[#f4eadb] dark:hover:bg-slate-900 md:grid-cols-[1.2fr_1fr_1fr_auto] md:items-center ${
                isSelected ? "bg-[#eadcc6] dark:bg-blue-950/40" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <img
                  src={lot.logo}
                  alt={lot.coin}
                  className="h-8 w-8 rounded-full bg-stone-100 dark:bg-slate-100"
                />
                <div>
                  <p className="font-semibold text-stone-950 dark:text-slate-100">{lot.coin}</p>
                  <p className="text-xs text-stone-500 dark:text-slate-500">
                    {formatDate(lot.acquiredAt)} - {lot.holdingPeriod}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-xs text-stone-500 dark:text-slate-500">Potential loss</p>
                <p className="font-mono font-bold text-red-700 dark:text-red-400">
                  {formatCurrency(lot.unrealizedGain)}
                </p>
              </div>
              <div>
                <p className="text-xs text-stone-500 dark:text-slate-500">Drawdown</p>
                <p className="font-mono font-semibold text-stone-900 dark:text-slate-100">
                  {formatPercent(lot.lossPercent)}
                </p>
              </div>
              <span className="justify-self-start border border-stone-300 bg-[#fffdf7] px-2 py-1 text-xs font-semibold text-stone-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300 md:justify-self-end">
                {isSelected ? "Selected" : "Add"}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
};

const FiltersAndSettings = () => {
  const dispatch = useDispatch();
  const settings = useSelector(selectSettings);
  const holdings = useSelector(selectAllHoldings);
  const chains = ["all", ...new Set(holdings.map((holding) => holding.chain))];

  return (
    <section className="grid min-w-0 gap-4 border border-stone-200 bg-[#fffaf0] p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950 md:grid-cols-2 lg:grid-cols-5">
      <Field label="Search">
        <input
          type="search"
          placeholder="ETH, SOL, Chainlink..."
          onChange={(event) => dispatch(updateFilters({ search: event.target.value }))}
          className={selectClassName}
        />
      </Field>
      <Field label="Chain">
        <select
          onChange={(event) => dispatch(updateFilters({ chain: event.target.value }))}
          className={selectClassName}
        >
          {chains.map((chain) => (
            <option key={chain} value={chain}>
              {chain === "all" ? "All chains" : chain}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Tax Term">
        <select
          onChange={(event) =>
            dispatch(updateFilters({ holdingPeriod: event.target.value }))
          }
          className={selectClassName}
        >
          <option value="all">All terms</option>
          <option value="short-term">Short-term</option>
          <option value="long-term">Long-term</option>
        </select>
      </Field>
      <Field label="Accounting">
        <select
          value={settings.accountingMethod}
          onChange={(event) =>
            dispatch(updateSettings({ accountingMethod: event.target.value }))
          }
          className={selectClassName}
        >
          <option value="HIFO">HIFO</option>
          <option value="FIFO">FIFO</option>
          <option value="LIFO">LIFO</option>
        </select>
      </Field>
      <Field label="Max Sale Value">
        <input
          type="number"
          min="0"
          value={settings.maxSaleValue}
          onChange={(event) =>
            dispatch(updateSettings({ maxSaleValue: Number(event.target.value) }))
          }
          className={selectClassName}
        />
      </Field>
      <label className="flex items-center gap-2 text-sm font-semibold text-stone-700 dark:text-slate-300">
        <input
          type="checkbox"
          checked={settings.lossOnly}
          onChange={(event) =>
            dispatch(updateSettings({ lossOnly: event.target.checked }))
          }
          className="h-4 w-4 accent-stone-900 dark:accent-blue-500"
        />
        Show loss lots only
      </label>
      <label className="flex items-center gap-2 text-sm font-semibold text-stone-700 dark:text-slate-300">
        <input
          type="checkbox"
          checked={settings.hideDust}
          onChange={(event) =>
            dispatch(updateSettings({ hideDust: event.target.checked }))
          }
          className="h-4 w-4 accent-stone-900 dark:accent-blue-500"
        />
        Hide dust balances
      </label>
    </section>
  );
};

const ReportPreview = () => {
  const rows = useSelector(selectReportRows);

  return (
    <section className="min-w-0 border border-stone-200 bg-[#fffaf0] shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div className="border-b border-stone-200 p-4 dark:border-slate-800">
        <h2 className="text-base font-bold text-stone-950 dark:text-slate-100">Report Preview</h2>
        <p className="break-words text-sm text-stone-500 dark:text-slate-500">
          A client-side export preview for an accountant or tax report handoff.
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left">
          <thead className="bg-[#f1e6d4] text-xs uppercase text-stone-600 dark:bg-slate-900/80 dark:text-slate-500">
            <tr>
              <th className="px-4 py-3">Asset</th>
              <th className="px-4 py-3">Acquired</th>
              <th className="px-4 py-3 text-right">Quantity</th>
              <th className="px-4 py-3 text-right">Proceeds</th>
              <th className="px-4 py-3 text-right">Cost Basis</th>
              <th className="px-4 py-3 text-right">Gain / Loss</th>
              <th className="px-4 py-3">Term</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200 dark:divide-slate-900">
            {rows.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-4 py-8 text-center text-sm text-stone-500 dark:text-slate-500">
                  Select lots to build a harvest report.
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={`${row.asset}-${row.acquiredAt}`} className="text-sm">
                  <td className="px-4 py-3 font-semibold text-stone-950 dark:text-slate-100">{row.asset}</td>
                  <td className="px-4 py-3 text-stone-600 dark:text-slate-400">{formatDate(row.acquiredAt)}</td>
                  <td className="px-4 py-3 text-right font-mono text-stone-700 dark:text-slate-300">
                    {formatNumber(row.quantity)}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-stone-700 dark:text-slate-300">
                    {formatCurrency(row.proceeds)}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-stone-700 dark:text-slate-300">
                    {formatCurrency(row.costBasis)}
                  </td>
                  <td
                    className={`px-4 py-3 text-right font-mono font-semibold ${
                      row.gainLoss < 0 ? "text-red-700 dark:text-red-400" : "text-emerald-700 dark:text-green-400"
                    }`}
                  >
                    {formatCurrency(row.gainLoss)}
                  </td>
                  <td className="px-4 py-3 capitalize text-stone-600 dark:text-slate-400">{row.term}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

const TransactionsPanel = () => {
  const transactions = useSelector(selectTransactions);

  return (
    <section className="min-w-0 border border-stone-200 bg-[#fffaf0] shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div className="border-b border-stone-200 p-4 dark:border-slate-800">
        <h2 className="text-base font-bold text-stone-950 dark:text-slate-100">Recent Transactions</h2>
        <p className="break-words text-sm text-stone-500 dark:text-slate-500">
          Mocked activity used to explain where lots and cost basis came from.
        </p>
      </div>
      <div className="divide-y divide-stone-200 dark:divide-slate-900">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className="grid gap-3 p-4 text-sm md:grid-cols-[1fr_1fr_1fr_auto] md:items-center"
          >
            <div>
              <p className="font-semibold uppercase text-stone-950 dark:text-slate-100">{transaction.type}</p>
              <p className="text-xs text-stone-500 dark:text-slate-500">{formatDate(transaction.date)}</p>
            </div>
            <p className="font-mono text-stone-700 dark:text-slate-300">
              {formatNumber(transaction.quantity)} {transaction.asset}
            </p>
            <p className="font-mono text-stone-700 dark:text-slate-300">
              {formatCurrency(transaction.value)} fee {formatCurrency(transaction.fee)}
            </p>
            <span
              className={`justify-self-start border px-2 py-1 text-xs font-semibold uppercase ${
                transaction.status === "matched"
                  ? "border-emerald-600/40 bg-emerald-50 text-emerald-700 dark:border-green-500/40 dark:bg-transparent dark:text-green-400"
                  : "border-amber-600/40 bg-amber-50 text-amber-700 dark:border-amber-400/40 dark:bg-transparent dark:text-amber-300"
              }`}
            >
              {transaction.status}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

const App = () => {
  const dispatch = useDispatch();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const preTotals = useSelector(selectedPreHarvestTotals);
  const postTotals = useSelector(selectPostHarvestTotals);
  const metrics = useSelector(selectPortfolioMetrics);
  const settings = useSelector(selectSettings);
  const { loading, error } = useSelector((state) => state.harvester);

  useEffect(() => {
    const loadData = async () => {
      dispatch(setLoading());
      try {
        const [holdingsData, capitalGainsData, transactionsData, settingsData] =
          await Promise.all([
            fetchHoldings(),
            fetchCapitalGains(),
            fetchTransactions(),
            fetchSettings(),
          ]);

        dispatch(setHoldings(holdingsData));
        dispatch(setCapitalGains(capitalGainsData));
        dispatch(setTransactions(transactionsData));
        dispatch(setSettings(settingsData));
      } catch (err) {
        dispatch(setError(err.message));
      }
    };

    loadData();
  }, [dispatch]);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f6efe3] p-6">
        <p className="border border-red-300 bg-red-50 p-4 font-medium text-red-700">
          Error: {error}
        </p>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen overflow-x-hidden bg-[#f6efe3] p-4 text-stone-900 transition-colors dark:bg-slate-950 dark:text-slate-100 md:p-8 ${
        isDarkMode ? "dark" : ""
      }`}
    >
      <header className="mx-auto mb-6 max-w-7xl">
        <div className="flex min-w-0 flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-stone-600 dark:text-blue-300">
              {settings.taxYear} {settings.jurisdiction} mock strategy
            </p>
            <h1 className="mt-2 break-words text-3xl font-bold tracking-tight text-stone-950 dark:text-white">
              Tax Loss Harvester
            </h1>
            <p className="mt-2 max-w-2xl break-words text-sm text-stone-600 dark:text-slate-400">
              Simulate lot-level crypto harvesting, compare tax impact, and prepare
              a reviewable plan before any real trade is made.
            </p>
          </div>
          <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={() => setIsDarkMode((current) => !current)}
              className="inline-flex h-10 w-10 items-center justify-center border border-stone-300 bg-[#fffaf0] text-stone-800 transition hover:border-stone-700 hover:text-stone-950 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-blue-400 dark:hover:text-white"
              aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
              title={isDarkMode ? "Light mode" : "Dark mode"}
            >
              {isDarkMode ? <SunIcon /> : <MoonIcon />}
            </button>
            <div className="max-w-full break-words border border-amber-300 bg-[#fff4d8] p-3 text-sm text-amber-900 dark:border-amber-400/30 dark:bg-amber-400/10 dark:text-amber-100">
              Educational simulation only. Real tax treatment depends on jurisdiction,
              transaction history, and professional review.
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl space-y-6">
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label="Portfolio Value"
            value={formatCurrency(metrics.portfolioValue)}
            detail={`${metrics.lotCount} tracked lots`}
          />
          <MetricCard
            label="Unrealized P/L"
            value={formatCurrency(metrics.unrealizedGain)}
            detail={`Cost basis ${formatCurrency(metrics.totalCostBasis)}`}
            tone={metrics.unrealizedGain < 0 ? "bad" : "good"}
          />
          <MetricCard
            label="Harvestable Losses"
            value={formatCurrency(metrics.harvestableLosses)}
            detail="Loss lots currently available"
            tone="warn"
          />
          <MetricCard
            label="Selected Sale Value"
            value={formatCurrency(metrics.selectedSaleValue)}
            detail={`${metrics.selectedLotCount} lots selected`}
          />
        </section>

        <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <SummaryCard title="Pre-Harvesting" totals={preTotals} isDark />
          <SummaryCard title="After Harvesting" totals={postTotals}>
            <SavingsAlert
              preGain={preTotals.realizedGain}
              postGain={postTotals.realizedGain}
            />
          </SummaryCard>
        </section>

        <FiltersAndSettings />

        {loading ? (
          <div className="border border-stone-200 bg-[#fffaf0] p-16 text-center shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-stone-900 border-t-transparent dark:border-blue-600 dark:border-t-transparent" />
            <p className="text-sm font-medium text-stone-600 dark:text-slate-400">
              Loading mocked portfolio data...
            </p>
          </div>
        ) : (
          <>
            <OpportunityPanel />
            <HoldingsTable />
            <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
              <ReportPreview />
              <TransactionsPanel />
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default App;
