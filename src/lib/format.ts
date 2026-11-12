const numberFormatter = new Intl.NumberFormat("en-UG", {
  maximumFractionDigits: 0,
});

export function formatUGX(value: number): string {
  return `UGX ${numberFormatter.format(Math.round(value))}`;
}

export function formatNumber(value: number): string {
  return numberFormatter.format(value);
}

export function formatUsdApprox(value: number): string {
  return `≈ US$${numberFormatter.format(Math.round(value))}`;
}
