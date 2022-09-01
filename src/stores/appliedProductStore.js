import http from "src/http";
import {defineStore} from "pinia";


export const useAppliedProductStore = defineStore({
  id: 'appliedProduct',

  state: () => ({
    entities: [],
    entity: {},
  }),

  getters: {

  },
  actions: {
    async addProductToTemplate(dto) {
      const {data} = await http.post('/appliedProducts', dto)
      console.log(data)
    },
    async fetchEntities(id) {
      const {data} = await http.get(`/appliedProducts/templates/${id}`);
      this.entities = data;
    },
    async fetchEntity(id) {
      const {data} = await http.get(`/appliedProducts/${id}`);
      this.entity = data;
    },
    async setSettings(id, dto) {
      const {data} = await http.post(`/appliedProducts/${id}/settings`, dto);
      this.entity = data;
      console.log(data)
    },
  }
})
