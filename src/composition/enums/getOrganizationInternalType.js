export function getOrganizationInternalType(obj) {
  switch(obj) {
    default:
    case 'Mine': return 'Моя организация'
    case 'Contractor': return 'Подрядчик'
    case 'Partner': return 'Партнер'
  }
}
