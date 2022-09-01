import http from "src/http";
import {defineStore} from "pinia";


export const useVillageStore = defineStore({
  id: 'village',

  state: () => ({
    entities: [],
    ownershipGroups: [],
    village: {},
    lands: [],
    landsPagination: {},
  }),

  getters: {

  },
  actions: {
    async fetchEntities() {
      const {data} = await http.get('/villages')
      this.entities = data;
    },
    async fetchVillage(id) {
      const {data} = await http.get(`/villages/${id}`)
      this.village = data;
    },
    async fetchVillageLands(id, params) {
      const paramsRequests = params ? `?${params}` : ""
      const result = await http.get(`/villages/${id}/lands${paramsRequests}`)
      this.lands = result.data
      this.landsPagination = JSON.parse(result.headers['x-pagination'])
    },
    async fetchVillageOwnershipGroups(villageId) {
      const {data} = await http.get(`/villages/${villageId}/ownershipGroups`)
      this.ownershipGroups = data;
    },
    async createEntity(dto) {
      const {data} = await http.post('/villages', dto)
      console.log(data)
    },
  }
})
