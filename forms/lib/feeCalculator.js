export function calculateFee(feeConfig, hectares) {
  if (!Number.isFinite(hectares) || hectares <= 0) return 0;
  if (feeConfig.type === "flat") {
    return hectares * feeConfig.ratePerHectare;
  }
  const bracket = feeConfig.brackets.find((b) => hectares <= b.upTo);
  if (bracket) return bracket.amount;
  const topBracket = feeConfig.brackets[feeConfig.brackets.length - 1];
  return topBracket.amount * feeConfig.aboveMaxMultiplier;
}
export function formatFeeAmount(amount) {
  return `${amount.toLocaleString("ka-GE")} ₾`;
}