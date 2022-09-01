
export function useCreateOption(entity, field = 'name') {
  entity.label = entity[field];
  return entity;
}
