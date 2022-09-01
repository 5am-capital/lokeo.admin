

export function useAddProductToTemplateDto(productId, contractTemplateId) {
  return {
    productId: productId,
    contractTemplateId: contractTemplateId,
  }
}
