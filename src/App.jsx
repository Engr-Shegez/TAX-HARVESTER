import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setError,
  setHoldings,
  setLoading,
} from "./features/harvester/store/harvesterSlice";

const App = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.harvester);

  useEffect(() => {
    const loadData = async () => {
      dispatch(setLoading());
      try {
        // const data = await fetchingHoldings();
        // dispatch(setHoldings(data));
      } catch (err) {
        dispatch(setError(err.message));
      }
    };
    loadData();
  }, [dispatch]);

  if (error) return <div className="p-10 text-red-500">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <header className="mb-8 ">
        <div className="flex ">
          {" "}
          <h1 className="text-3xl font-bold text-slate-900">
            Tax Optimization
          </h1>{" "}
          <button className="pt-4 text-sm ml-5 text-blue-700 font-semibold border-b">
            How it works
          </button>
        </div>

        <p className="text-slate-500">
          Optimize Your crypto tax liability by realizing losses.
        </p>
      </header>

      <main className="max-w-7xl mx-auto space-y-8">
        {/* Step 4.2: The Two comparison cards */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* placeholder for Pre- harvesting card */}
          <div className="h-64 bg-cryptodark rounded-2xl animate-pulse"></div>
          {/* placeholder for After harvesting card */}
          <div className="h-64 bg-harvest-blue rounded-2xl animate-pulse"></div>
        </section>
        {/* Step 4.3: The holding Table */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-xl font-semibold"> Holdings</h2>
          </div>
          {loading ? (
            <div className="p-10 text-center text-slate-400">
              Loading assets...
            </div>
          ) : (
            <div className="p-10 text-center">Table will go here</div>
          )}
        </section>
      </main>
    </div>
  );
};
export default App;
