# Tax Loss Harvester

A React-based prototype for simulating crypto tax-loss harvesting with real-time capital gains updates.

Users can review a holdings table, select assets to harvest, and immediately compare their current capital gains position against a projected after-harvesting outcome.

## Live Demo

[View the deployed app](https://tax-harvester-seven.vercel.app/)

## Run Locally

To start the project :

```bash
npm install
npm run dev
```

Then open the local Vite URL shown in your terminal.

## Why This Project Exists

Tax-loss harvesting can be hard to reason about when holdings span short-term and long-term positions. This project makes that tradeoff visible by showing:

- the user's current capital gains baseline
- the impact of selecting specific assets to harvest
- the updated realized gains after those selections
- the potential tax savings when realized gains decrease

## Features

- Side-by-side `Pre-Harvesting` and `After Harvesting` summary cards
- Real-time tax impact updates driven by Redux state
- Sortable holdings table
- Per-row selection with checkboxes
- Select-all checkbox in the table header
- Default compact view with 4 visible assets before `View All`
- Savings alert when harvesting reduces realized capital gains
- Mocked holdings and mocked capital gains for local development without a backend

## How It Works

The app combines two mocked inputs:

- `holdings`: per-asset portfolio data such as `totalHolding`, `averageBuyPrice`, `currentPrice`, `stcg`, and `ltcg`
- `capitalGains`: the user's current realized capital gains baseline before any harvesting action

The `Pre-Harvesting` card is calculated from the mocked `capitalGains` payload.

The `After Harvesting` card is calculated by applying the selected holdings to that baseline:

- positive `stcg.gain` values are added to short-term profits
- negative `stcg.gain` values are added to short-term losses
- positive `ltcg.gain` values are added to long-term profits
- negative `ltcg.gain` values are added to long-term losses

That means the UI reflects the exact impact of the rows the user selects.

## Example Calculation

Given this capital gains baseline:

```json
{
  "stcg": {
    "profits": 70200.88,
    "losses": 1548.53
  },
  "ltcg": {
    "profits": 5020,
    "losses": 3050
  }
}
```

The app derives:

- `Net ST Capital Gains = stcg.profits - stcg.losses`
- `Net LT Capital Gains = ltcg.profits - ltcg.losses`
- `Total Realized Capital Gain = netST + netLT`

When a holding is selected, its short-term and long-term gains are merged into those totals and the `After Harvesting` card updates instantly.

## Holdings Table

The holdings table is designed to be compact but information-dense.

Each visible row includes:

- `Asset`: token symbol, token name, and logo
- `Holding Avg Buy Price`: `totalHolding` on the first line, `averageBuyPrice` and coin symbol on the second line
- `Current Price`: `currentPrice`
- `Short Term Gain`: `stcg.gain` on the first line, `stcg.balance` and coin symbol on the second line
- `Long Term Gain`: `ltcg.gain` on the first line, `ltcg.balance` and coin symbol on the second line
- `Amount to Sell`: populated with `totalHolding` only when the row is selected

## Tech Stack

- React 19
- Vite
- Redux Toolkit
- React Redux
- Tailwind CSS 4
- ESLint

## Getting Started

### Prerequisites

- Node.js 18 or newer
- npm

### Installation

```bash
npm install
```

### Start Development Server

```bash
npm run dev
```

### Build For Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Lint The Project

```bash
npm run lint
```

## Project Structure

```text
src/
  api/
    holdingsApi.js
  features/
    harvester/
      components/
        HoldingTable.jsx
        SavingsAlert.jsx
        SummaryCard.jsx
      store/
        harvesterSlice.js
  store/
    index.js
  utils/
    formatters.js
  App.jsx
  main.jsx
```

## State Management

Redux keeps the core simulation state in one place:

- `holdings`
- `capitalGains`
- `selectedIds`
- `loading`
- `error`

Important selectors:

- `selectAllHoldings`
- `selectSelectedIds`
- `selectedPreHarvestTotals`
- `selectPostHarvestTotals`

## Mock Data

Mock API functions live in [src/api/holdingsApi.js](./src/api/holdingsApi.js).

Current exports:

- `fetchHoldings()`
- `fetchCapitalGains()`

These return in-memory mock data so the UI and tax calculation flow can be developed before connecting a real backend.

## Notes

- Currency formatting currently uses `en-US` and `USD`
- The app is frontend-only right now
- There is no persistence or authentication yet
