import http from "src/http";
import {defineStore} from "pinia";


export const useLandStore = defineStore({
  id: 'land',

  state: () => ({
    land: {},
    lands: [],
    owners: [],
    ownersPagination: {},
  }),

  getters: {

  },
  actions: {
    async fetchLand(landId) {
      const {data} = await http.get(`/lands/${landId}`)
      this.land = data;
    },
    async fetchLands(params) {
      const paramsRequests = params ? `?${params}` : ""
      const {data} = await http.get(`/lands${paramsRequests}`)
      this.lands = data;
    },

    async fetchOwners(landId, params) {
      const paramsRequests = params ? `?${params}` : ""
      const result = await http.get(`/lands/${landId}/owners${paramsRequests}`)
      this.owners = result.data;
      this.ownersPagination = JSON.parse(result.headers['x-pagination'])
    }
  }
})
