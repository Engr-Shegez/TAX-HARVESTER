import { formatCurrency } from "../../../utils/formatters";

const SummaryCard = ({ title, totals, isDark = false }) => {
  const bgColor = isDark ? "bg-crypto-dark" : "bg-harvest-blue";
  const textColor = "text-white";
  const labelColor = "text-slate-400";

  return (
    <div
      className={`${bgColor} ${textColor} rounded-2xl p-6 shadow-xl border border-white/5`}
    >
      <h3 className="text-sm font-medium uppercase tracking-wider mb-6 opacity-80">
        {title}
      </h3>

      <div className="space-y-6">
        {/* Short Term Section */}
        <div>
          <p className="text-xs font-semibold mb-2 textblue-400">SHORT TERM</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className={labelColor + "text-xs"}>Profits</p>
              <p className="font-semibold">{formatCurrency(totals.stProfit)}</p>
            </div>
            <div>
              <p className={labelColor + "text-xs"}>Losses</p>
              <p className="font-semibold">{formatCurrency(totals.stLoss)}</p>
            </div>
          </div>
          <div className="mt-2 pt-2 border-t border-white/10">
            <p className={labelColor + "text-xs"}>Net ST Capital Gains</p>
            <p
              className={`text-lg font-bold ${totals.netSt >= 0 ? "text-green-400" : "text-red-400"}`}
            >
              {formatCurrency(totals.netST)}
            </p>
          </div>
        </div>
        {/* LONG TERM SECTION */}
        <div>
          <p className="text-xs font-semibold mb-2 text-indigo-400">
            LONG TERM
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className={labelColor + "text-xs"}>Profits</p>
              <p className="font-semibold">{formatCurrency(totals.ltProfit)}</p>
            </div>
            <div>
              <p className={labelColor + "text-xs"}>Losses</p>
              <p className="font-semibold">{formatCurrency(totals.ltLoss)}</p>
            </div>
          </div>
          <div className="mt-2 pt-2 border-t border-white/10">
            <p className={labelColor + "text-xs"}>Net LT Capital Gains</p>
            <p
              className={`text-lg font-bold ${totals.netLT >= 0 ? "text-green-400" : "text-red-400"}`}
            >
              {formatCurrency(totals.netLT)}
            </p>
          </div>
        </div>

        {/* Total Realized Gain */}
        <div className="pt-4 mt-4 border-t-2 border-dashed border-white/20">
          <p className="text-sm opacity-70">Total Realized Capital Gain</p>
          <p className="text-3xl font-extrabold tracking-tight">
            {formatCurrency(totals.realizedGain)}
          </p>
        </div>
      </div>
    </div>
  );
};
export default SummaryCard;
