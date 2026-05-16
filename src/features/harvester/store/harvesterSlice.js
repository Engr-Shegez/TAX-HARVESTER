import { createSlice } from "@reduxjs/toolkit";

const today = new Date("2026-05-16T00:00:00Z");
const longTermDays = 365;

const initialState = {
  holdings: [],
  transactions: [],
  capitalGains: {
    stcg: {
      profits: 0,
      losses: 0,
    },
    ltcg: {
      profits: 0,
      losses: 0,
    },
  },
  settings: {
    accountingMethod: "HIFO",
    taxYear: "2026",
    baseCurrency: "USD",
    jurisdiction: "US",
    hideDust: true,
    maxSaleValue: 10000,
    lossOnly: true,
  },
  filters: {
    search: "",
    chain: "all",
    holdingPeriod: "all",
    status: "all",
  },
  selectedLotIds: [],
  loading: false,
  error: null,
};

const daysHeld = (date) => {
  const acquiredAt = new Date(`${date}T00:00:00Z`);
  return Math.max(0, Math.floor((today - acquiredAt) / 86400000));
};

const buildTotalsFromCapitalGains = (capitalGains = {}) => {
  const stProfit = Number(capitalGains?.stcg?.profits) || 0;
  const stLoss = Number(capitalGains?.stcg?.losses) || 0;
  const ltProfit = Number(capitalGains?.ltcg?.profits) || 0;
  const ltLoss = Number(capitalGains?.ltcg?.losses) || 0;

  const netST = stProfit - stLoss;
  const netLT = ltProfit - ltLoss;

  return {
    stProfit,
    stLoss,
    ltProfit,
    ltLoss,
    netST,
    netLT,
    realizedGain: netST + netLT,
  };
};

const getLotCostBasis = (lot) => {
  return Number(lot.quantity) * Number(lot.costBasisPerUnit) + Number(lot.fees || 0);
};

const enrichHoldings = (holdings) => {
  return holdings.map((holding, index) => {
    const id = holding.id ?? `${holding.coin}-${index}`;
    const lots = (holding.taxLots || []).map((lot, lotIndex) => {
      const lotId = lot.id ?? `${id}-lot-${lotIndex}`;
      const quantity = Number(lot.quantity) || 0;
      const currentValue = quantity * Number(holding.currentPrice || 0);
      const costBasis = getLotCostBasis(lot);
      const unrealizedGain = currentValue - costBasis;
      const heldDays = daysHeld(lot.acquiredAt);
      const holdingPeriod = heldDays >= longTermDays ? "long-term" : "short-term";
      const lossPercent = costBasis > 0 ? (unrealizedGain / costBasis) * 100 : 0;

      return {
        ...lot,
        id: lotId,
        assetId: id,
        coin: holding.coin,
        coinName: holding.coinName,
        chain: holding.chain,
        logo: holding.logo,
        currentPrice: holding.currentPrice,
        quantity,
        costBasis,
        currentValue,
        unrealizedGain,
        heldDays,
        holdingPeriod,
        lossPercent,
      };
    });

    const quantity = lots.reduce((sum, lot) => sum + lot.quantity, 0);
    const costBasis = lots.reduce((sum, lot) => sum + lot.costBasis, 0);
    const currentValue = lots.reduce((sum, lot) => sum + lot.currentValue, 0);
    const unrealizedGain = lots.reduce((sum, lot) => sum + lot.unrealizedGain, 0);

    return {
      ...holding,
      id,
      taxLots: lots,
      totalHolding: quantity,
      costBasis,
      currentValue,
      averageBuyPrice: quantity > 0 ? costBasis / quantity : 0,
      unrealizedGain,
    };
  });
};

const getAllLots = (holdings) => holdings.flatMap((holding) => holding.taxLots || []);

const sortLotsByMethod = (lots, accountingMethod) => {
  const sorted = [...lots];

  if (accountingMethod === "FIFO") {
    return sorted.sort((a, b) => new Date(a.acquiredAt) - new Date(b.acquiredAt));
  }

  if (accountingMethod === "LIFO") {
    return sorted.sort((a, b) => new Date(b.acquiredAt) - new Date(a.acquiredAt));
  }

  return sorted.sort((a, b) => b.costBasisPerUnit - a.costBasisPerUnit);
};

const harvesterSlice = createSlice({
  name: "harvester",
  initialState,
  reducers: {
    setHoldings: (state, action) => {
      state.holdings = enrichHoldings(action.payload);
      const validLotIds = getAllLots(state.holdings).map((lot) => lot.id);
      state.selectedLotIds = state.selectedLotIds.filter((id) =>
        validLotIds.includes(id),
      );
      state.loading = false;
    },
    setCapitalGains: (state, action) => {
      state.capitalGains = action.payload;
    },
    setTransactions: (state, action) => {
      state.transactions = action.payload;
    },
    setSettings: (state, action) => {
      state.settings = {
        ...state.settings,
        ...action.payload,
      };
    },
    updateSettings: (state, action) => {
      state.settings = {
        ...state.settings,
        ...action.payload,
      };
    },
    updateFilters: (state, action) => {
      state.filters = {
        ...state.filters,
        ...action.payload,
      };
    },
    setLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    toggleSelection: (state, action) => {
      const lotId = action.payload;
      if (state.selectedLotIds.includes(lotId)) {
        state.selectedLotIds = state.selectedLotIds.filter((id) => id !== lotId);
      } else {
        state.selectedLotIds.push(lotId);
      }
    },
    setSelectedIds: (state, action) => {
      state.selectedLotIds = action.payload;
    },
    selectRecommendedLots: (state) => {
      const lots = getAllLots(state.holdings)
        .filter((lot) => lot.unrealizedGain < 0)
        .filter((lot) => lot.currentValue <= state.settings.maxSaleValue);

      state.selectedLotIds = sortLotsByMethod(
        lots,
        state.settings.accountingMethod,
      )
        .slice(0, 6)
        .map((lot) => lot.id);
    },
    clearSelections: (state) => {
      state.selectedLotIds = [];
    },
  },
});

export const {
  setHoldings,
  setCapitalGains,
  setTransactions,
  setSettings,
  updateSettings,
  updateFilters,
  setLoading,
  setError,
  toggleSelection,
  setSelectedIds,
  selectRecommendedLots,
  clearSelections,
} = harvesterSlice.actions;

export default harvesterSlice.reducer;

export const selectAllHoldings = (state) => state.harvester.holdings;
export const selectTransactions = (state) => state.harvester.transactions;
export const selectSelectedIds = (state) => state.harvester.selectedLotIds;
export const selectCapitalGains = (state) => state.harvester.capitalGains;
export const selectSettings = (state) => state.harvester.settings;
export const selectFilters = (state) => state.harvester.filters;

export const selectAllLots = (state) => getAllLots(selectAllHoldings(state));

export const selectedPreHarvestTotals = (state) => {
  return buildTotalsFromCapitalGains(selectCapitalGains(state));
};

export const selectSelectedLots = (state) => {
  const selectedIds = selectSelectedIds(state);
  return selectAllLots(state).filter((lot) => selectedIds.includes(lot.id));
};

export const selectFilteredHoldings = (state) => {
  const holdings = selectAllHoldings(state);
  const filters = selectFilters(state);
  const settings = selectSettings(state);
  const search = filters.search.trim().toLowerCase();

  return holdings
    .map((holding) => {
      const filteredLots = holding.taxLots.filter((lot) => {
        const matchesSearch =
          !search ||
          lot.coin.toLowerCase().includes(search) ||
          lot.coinName.toLowerCase().includes(search);
        const matchesChain = filters.chain === "all" || lot.chain === filters.chain;
        const matchesPeriod =
          filters.holdingPeriod === "all" ||
          lot.holdingPeriod === filters.holdingPeriod;
        const matchesStatus =
          filters.status === "all" ||
          (filters.status === "loss" && lot.unrealizedGain < 0) ||
          (filters.status === "gain" && lot.unrealizedGain >= 0);
        const matchesDust = !settings.hideDust || lot.currentValue >= 5;
        const matchesLossSetting = !settings.lossOnly || lot.unrealizedGain < 0;

        return (
          matchesSearch &&
          matchesChain &&
          matchesPeriod &&
          matchesStatus &&
          matchesDust &&
          matchesLossSetting
        );
      });

      return {
        ...holding,
        taxLots: filteredLots,
      };
    })
    .filter((holding) => holding.taxLots.length > 0);
};

export const selectPortfolioMetrics = (state) => {
  const lots = selectAllLots(state);
  const selectedLots = selectSelectedLots(state);

  const portfolioValue = lots.reduce((sum, lot) => sum + lot.currentValue, 0);
  const totalCostBasis = lots.reduce((sum, lot) => sum + lot.costBasis, 0);
  const unrealizedGain = lots.reduce((sum, lot) => sum + lot.unrealizedGain, 0);
  const harvestableLosses = lots
    .filter((lot) => lot.unrealizedGain < 0)
    .reduce((sum, lot) => sum + Math.abs(lot.unrealizedGain), 0);
  const selectedSaleValue = selectedLots.reduce(
    (sum, lot) => sum + lot.currentValue,
    0,
  );
  const selectedLosses = selectedLots
    .filter((lot) => lot.unrealizedGain < 0)
    .reduce((sum, lot) => sum + Math.abs(lot.unrealizedGain), 0);

  return {
    portfolioValue,
    totalCostBasis,
    unrealizedGain,
    harvestableLosses,
    selectedSaleValue,
    selectedLosses,
    selectedLotCount: selectedLots.length,
    lotCount: lots.length,
  };
};

export const selectHarvestOpportunities = (state) => {
  const lots = selectAllLots(state);
  const { accountingMethod, maxSaleValue } = selectSettings(state);

  return sortLotsByMethod(
    lots.filter((lot) => lot.unrealizedGain < 0 && lot.currentValue <= maxSaleValue),
    accountingMethod,
  )
    .map((lot) => ({
      ...lot,
      score:
        Math.abs(lot.unrealizedGain) * (lot.holdingPeriod === "short-term" ? 1.2 : 1) +
        Math.abs(lot.lossPercent) * 3,
    }))
    .sort((a, b) => b.score - a.score);
};

export const selectPostHarvestTotals = (state) => {
  const preTotals = selectedPreHarvestTotals(state);
  const selectedLots = selectSelectedLots(state);

  const harvestedImpact = selectedLots.reduce(
    (acc, lot) => {
      if (lot.holdingPeriod === "short-term") {
        acc.stProfit += lot.unrealizedGain > 0 ? lot.unrealizedGain : 0;
        acc.stLoss += lot.unrealizedGain < 0 ? Math.abs(lot.unrealizedGain) : 0;
      } else {
        acc.ltProfit += lot.unrealizedGain > 0 ? lot.unrealizedGain : 0;
        acc.ltLoss += lot.unrealizedGain < 0 ? Math.abs(lot.unrealizedGain) : 0;
      }

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

export const selectReportRows = (state) =>
  selectSelectedLots(state).map((lot) => ({
    asset: lot.coin,
    acquiredAt: lot.acquiredAt,
    quantity: lot.quantity,
    proceeds: lot.currentValue,
    costBasis: lot.costBasis,
    gainLoss: lot.unrealizedGain,
    term: lot.holdingPeriod,
    source: lot.source,
  }));
