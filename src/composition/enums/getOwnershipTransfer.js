export function getOwnershipTransfer(val) {
  switch(val) {
    default:
    case false: return 'Нет'
    case true: return 'Да'
  }
}
