import {defineStore} from "pinia";
import http from "src/http";


export const useProductStore = defineStore({
  id: 'product',
  state: () => ({
    productCategories: null,
    products: null,
  }),

  getters: {

  },
  actions: {
    async createProduct(dto) {
      const {data} = await http.post('/products', dto)

    },
    async fetchProducts() {
      const {data} = await http.get('/products')
      this.products = data;
    },

    async fetchProductCategories() {
      const {data} = await http.get('/productCategories')
      this.productCategories = data;
    }
  }
})
