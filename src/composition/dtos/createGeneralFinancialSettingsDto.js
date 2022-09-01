

export function createGeneralFinancialSettingsDto(price, measurementId, amount, useLandForPricing, accrualSystem, debtAfterDays, accrualWayCalculation) {
  return {
    price: price,
    measurementId: measurementId,
    amount: amount,
    useLandForPricing: useLandForPricing,
    accrualSystem: accrualSystem,
    debtAfterDays: debtAfterDays,
    accrualWayCalculation: accrualWayCalculation,
  }
}
