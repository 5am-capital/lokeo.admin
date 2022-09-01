import http from "src/http";
import {defineStore} from "pinia";


export const useMeasurementUnitStore = defineStore({
  id: 'measurementUnit',

  state: () => ({
    entities: [],
  }),

  getters: {

  },
  actions: {
    async fetchEntities() {
      const {data} = await http.get('/measurementUnits')
      this.entities = data;
    },
  }
})
