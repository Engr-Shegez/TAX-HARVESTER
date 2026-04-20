import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchHoldings } from "./api/holdingsApi";
import {
  setHoldings,
  setLoading,
  setError,
  selectAllHoldings,
  selectedPreHarvestTotals,
} from "./features/harvester/store/harvesterSlice";

// Our New Components
import SummaryCard from "./features/harvester/components/SummaryCard";
import HoldingsTable from "./features/harvester/components/HoldingTable";

const App = () => {
  const dispatch = useDispatch();

  // Grab state from Redux
  const holdings = useSelector(selectAllHoldings);
  const preTotals = useSelector(selectedPreHarvestTotals);
  const { loading, error } = useSelector((state) => state.harvester);

  useEffect(() => {
    const loadData = async () => {
      dispatch(setLoading());
      try {
        const data = await fetchHoldings();
        dispatch(setHoldings(data));
      } catch (err) {
        dispatch(setError(err.message));
      }
    };
    loadData();
  }, [dispatch]);

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen bg-red-50">
        <p className="text-red-600 font-medium">Error: {error}</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <header className="max-w-7xl mx-auto mb-10">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
          Tax Loss Harvester
        </h1>
        <p className="text-slate-500 mt-1">
          Select assets to simulate tax harvesting benefits.
        </p>
      </header>

      <main className="max-w-7xl mx-auto space-y-10">
        {/* Comparison Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SummaryCard
            title="Pre-Harvesting"
            totals={preTotals}
            isDark={true}
          />

          {/* Placeholder for After-Harvesting (Step 7) */}
          <div className="bg-harvest-blue/10 border-2 border-dashed border-harvest-blue/30 rounded-2xl flex items-center justify-center text-harvest-blue font-medium h-[450px]">
            After Harvesting Card will appear here
          </div>
        </section>

        {/* Assets Section */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-800">
              Available Assets
            </h2>
            <span className="text-xs font-semibold bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full uppercase">
              {holdings.length} Tokens
            </span>
          </div>

          {loading ? (
            <div className="p-20 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent mb-4"></div>
              <p className="text-slate-400 font-medium">
                Fetching on-chain data...
              </p>
            </div>
          ) : (
            <HoldingsTable holdings={holdings} />
          )}
        </section>
      </main>
    </div>
  );
};

export default App;
