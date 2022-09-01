

export function useCreateOptions(entities, field = 'name') {
  return entities.map(function(item) {
    item.label = item[field];
    return item;
  })
}
