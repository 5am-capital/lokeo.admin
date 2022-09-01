export function getProductSupplyType(obj) {

  switch(obj) {
    default:
    case 'Base': return 'Базовый'
    case 'Additional': return 'Дополнительный'
  }
}
