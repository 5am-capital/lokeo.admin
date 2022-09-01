export function getOwnerType(obj) {

  switch(obj) {
    default:
    case 'Visitor': return 'Посетитель'
    case 'Representative': return 'Представитель'
    case 'Owner': return 'Собственник'
  }
}
