import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  holdings: [],
  selectedIds: [], //stores the "coin" symbol or a unique Id
  loading: false,
  error: null,
};

const harvesterSlice = createSlice({
  name: "harverster",
  initialState,
  reducers: {
    setHoldings: (state, action) => {
      state.holdings = action.payload.map((holding, index) => ({
        ...holding,
        id: holding.id ?? `${holding.coin}-${index}`,
      }));
      state.selectedIds = state.selectedIds.filter((id) =>
        state.holdings.some((holding) => holding.id === id),
      );
      state.loading = false;
    },
    setLoading: (state) => {
      state.loading = true;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    toggleSelection: (state, action) => {
      const coinId = action.payload;
      if (state.selectedIds.includes(coinId)) {
        state.selectedIds = state.selectedIds.filter((id) => id !== coinId);
      } else {
        state.selectedIds.push(coinId);
      }
    },
    setSelectedIds: (state, action) => {
      state.selectedIds = action.payload;
    },
  },
});

export const {
  setHoldings,
  setLoading,
  setError,
  toggleSelection,
  setSelectedIds,
} = harvesterSlice.actions;
export default harvesterSlice.reducer;

// Selectors
export const selectAllHoldings = (state) => state.harvester.holdings;
export const selectSelectedIds = (state) => state.harvester.selectedIds;

export const selectedPreHarvestTotals = (state) => {
  const holdings = state.harvester.holdings || [];

  const totals = holdings.reduce(
    (acc, curr) => {
      const stGain = Number(curr?.stcg?.gain) || 0;
      const ltGain = Number(curr?.ltcg?.gain) || 0;

      acc.stProfit += stGain > 0 ? stGain : 0;
      acc.stLoss += stGain < 0 ? Math.abs(stGain) : 0;

      acc.ltProfit += ltGain > 0 ? ltGain : 0;
      acc.ltLoss += ltGain < 0 ? Math.abs(ltGain) : 0;

      return acc;
    },
    { stProfit: 0, stLoss: 0, ltProfit: 0, ltLoss: 0 },
  );

  const netST = totals.stProfit - totals.stLoss;
  const netLT = totals.ltProfit - totals.ltLoss;

  return {
    ...totals,
    netST,
    netLT,
    realizedGain: netST + netLT,
  };
};

export const selectPostHarvestTotals = (state) => {
  const { holdings, selectedIds } = state.harvester;

  const preTotals = selectedPreHarvestTotals(state);

  // Selected rows represent positions the user wants to harvest.
  // We add their realized impact on top of the current tax picture.
  const harvestedImpact = holdings.reduce(
    (acc, curr) => {
      if (!selectedIds.includes(curr.id)) {
        return acc;
      }

      const stGain = Number(curr?.stcg?.gain) || 0;
      const ltGain = Number(curr?.ltcg?.gain) || 0;

      acc.stProfit += stGain > 0 ? stGain : 0;
      acc.stLoss += stGain < 0 ? Math.abs(stGain) : 0;
      acc.ltProfit += ltGain > 0 ? ltGain : 0;
      acc.ltLoss += ltGain < 0 ? Math.abs(ltGain) : 0;

      return acc;
    },
    { stProfit: 0, stLoss: 0, ltProfit: 0, ltLoss: 0 },
  );

  const totals = {
    stProfit: preTotals.stProfit + harvestedImpact.stProfit,
    stLoss: preTotals.stLoss + harvestedImpact.stLoss,
    ltProfit: preTotals.ltProfit + harvestedImpact.ltProfit,
    ltLoss: preTotals.ltLoss + harvestedImpact.ltLoss,
  };

  const netST = totals.stProfit - totals.stLoss;
  const netLT = totals.ltProfit - totals.ltLoss;

  return {
    ...totals,
    netST,
    netLT,
    realizedGain: netST + netLT,
  };
};
