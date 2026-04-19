import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  holdings: [],
  selectedIds: {}, //stores the "coin" symbol or a unique Id
  loading: false,
  error: null,
};

const harvesterSlice = createSlice({
  name: "harverster",
  initialState,
  reducers: {
    setHoldings: (state, action) => {
      state.holdings = action.payloads;
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
  },
});

export const { setHoldings, setLoading, setError, toggleSelection } =
  harvesterSlice.actions;
export default harvesterSlice.reducer;

// Selectors
export const selectAllHoldings = (state) => state.harvester.holdings;
export const selectSelectedIds = (state) => state.harvester.selectedIds;

export const selectedPreHarvestTotals = (state) => {
  const holdings = state.harvester.holdings;

  return holdings.reduice(
    (acc, curr) => {
      //STCG LOGIC
      const stGain = curr.stcg.gain;
      if (stGain > 0) acc.stProfit += stGain;
      else acc.stLoss += Math.abs(stGain);

      //LTCG LOGIC
      const ltGain = curr.ltcg.gain;
      if (ltGain > 0) acc.ltProfit += ltGain;
      else acc.ltLoss += Math.abs(ltGain);

      return acc;
    },
    { stProfit: 0, stLoss: 0, ltProfit: 0, ltLoss: 0 },
  );
};
