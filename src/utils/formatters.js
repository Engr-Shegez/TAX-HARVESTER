export const formatCurrency = (value) => {
  const amount = Number(value);

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number.isFinite(amount) ? amount : 0);
};

export const formatNumber = (value, maximumFractionDigits = 6) => {
  const amount = Number(value);

  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits,
  }).format(Number.isFinite(amount) ? amount : 0);
};

export const formatPercent = (value) => {
  const amount = Number(value);

  return new Intl.NumberFormat("en-US", {
    style: "percent",
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(Number.isFinite(amount) ? amount / 100 : 0);
};

export const formatDate = (value) => {
  if (!value) {
    return "Unknown";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00Z`));
};
