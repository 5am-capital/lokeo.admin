import http from "src/http";
import {defineStore} from "pinia";


export const useContractTemplateStore = defineStore({
  id: 'contractTemplate',

  state: () => ({
    entities: [],
    entity: {},
    productsToAdd: [],
  }),

  getters: {

  },
  actions: {
    async fetchProductsToAdd() {
      const {data} = await http.get('/products')
      this.productsToAdd = data;
      console.log(data)
    },
    async fetchEntities() {
      const {data} = await http.get('/contractTemplates')
      this.entities = data;
      console.log(data)
    },

    async fetchEntity(id) {
      const {data} = await http.get(`/contractTemplates/${id}`)
      this.entity = data;
    },

    async createEntity(dto) {
      const {data} = await http.post('/contractTemplates', dto)
      console.log(data)
    },
  }
})
