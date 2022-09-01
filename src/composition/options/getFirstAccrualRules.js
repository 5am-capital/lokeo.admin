export function getFirstAccrualRules() {
  return [
    {label: 'С первого дня финансового периода', value: 'FromNewFinancialPeriod'},
    {label: 'Со дня активации договора: сформируются два начисления в разных финансовых периодах', value: 'FromAccountActivation'}
  ]
}
