import { formatCurrency } from "../../../utils/formatters";

const SummaryCard = ({ title, totals, isDark = false, children }) => {
  const bgColor = isDark
    ? "bg-[#3f3528] dark:bg-slate-900"
    : "bg-[#8b6f47] dark:bg-blue-800";
  const textColor = "text-[#fffaf0]";
  const labelColor = "text-[#e8dcc8]";

  return (
    <div
      className={`${bgColor} ${textColor} min-w-0 rounded-md border border-stone-300/20 p-6 shadow-sm`}
    >
      <h3 className="text-sm font-medium uppercase tracking-wider mb-6 opacity-80">
        {title}
      </h3>

      <div className="space-y-6">
        {/* Short Term Section */}
        <div>
          <p className="mb-2 text-xs font-semibold text-[#f6d58b]">SHORT TERM</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className={`${labelColor} text-xs`}>Profits</p>
              <p className="break-words font-semibold">{formatCurrency(totals.stProfit)}</p>
            </div>
            <div>
              <p className={`${labelColor} text-xs`}>Losses</p>
              <p className="break-words font-semibold">{formatCurrency(totals.stLoss)}</p>
            </div>
          </div>
          <div className="mt-2 border-t border-[#fffaf0]/20 pt-2">
            <p className={`${labelColor} text-xs`}>Net ST Capital Gains</p>
            <p
              className={`break-words text-lg font-bold ${totals.netST >= 0 ? "text-emerald-200" : "text-red-200"}`}
            >
              {formatCurrency(totals.netST)}
            </p>
          </div>
        </div>
        {/* LONG TERM SECTION */}
        <div>
          <p className="mb-2 text-xs font-semibold text-[#d7c2ff]">
            LONG TERM
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className={`${labelColor} text-xs`}>Profits</p>
              <p className="break-words font-semibold">{formatCurrency(totals.ltProfit)}</p>
            </div>
            <div>
              <p className={`${labelColor} text-xs`}>Losses</p>
              <p className="break-words font-semibold">{formatCurrency(totals.ltLoss)}</p>
            </div>
          </div>
          <div className="mt-2 border-t border-[#fffaf0]/20 pt-2">
            <p className={`${labelColor} text-xs`}>Net LT Capital Gains</p>
            <p
              className={`break-words text-lg font-bold ${totals.netLT >= 0 ? "text-emerald-200" : "text-red-200"}`}
            >
              {formatCurrency(totals.netLT)}
            </p>
          </div>
        </div>

        {/* Total Realized Gain */}
        <div className="mt-4 border-t-2 border-dashed border-[#fffaf0]/25 pt-4">
          <p className="text-sm opacity-70">Total Realized Capital Gain</p>
          <p className="break-words text-2xl font-extrabold tracking-tight sm:text-3xl">
            {formatCurrency(totals.realizedGain)}
          </p>
        </div>
        {children}
      </div>
    </div>
  );
};
export default SummaryCard;
