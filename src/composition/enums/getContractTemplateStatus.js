export function getContractTemplateStatus(val) {
  switch(val) {
    default:
    case 'Inactive': return 'Неактивный'
    case 'Active': return 'Активный'
    case 'Archived': return 'Архивный'
  }
}
