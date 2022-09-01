import {defineStore} from "pinia";
import http from "src/http";


export const usePersonStore = defineStore({
  id: 'person',
  state: () => ({
    personGroups: [],
    entities: [],
    person: {}
  }),

  getters: {

  },
  actions: {
    async fetchPersonGroups() {
      const {data} = await http.get('/personGroups')
      this.personGroups = data;
    },

    async createEntity(dto) {
      const {data} = await http.post('/people', dto)

    },
    async fetchPerson(id) {
      const {data} = await http.get(`/people/${id}`)
      this.person = data;
    }

  }
})
