const compactNumberFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 1,
  notation: "compact",
});

const currencyFormatter = new Intl.NumberFormat("en-US", {
  currency: "USD",
  maximumFractionDigits: 1,
  notation: "compact",
  style: "currency",
});

const percentFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 0,
  style: "percent",
});

function formatCompactNumber(value: number) {
  return compactNumberFormatter.format(value);
}

function formatCurrency(value: number) {
  return currencyFormatter.format(value);
}

function formatDuration(seconds?: number) {
  if (!seconds) {
    return "n/a";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return minutes > 0 ? `${minutes}m ${remainingSeconds}s` : `${remainingSeconds}s`;
}

function formatPercent(value: number | null | undefined) {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return "--";
  }

  return percentFormatter.format(value / 100);
}

export { formatCompactNumber, formatCurrency, formatDuration, formatPercent };
