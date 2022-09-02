import http from "src/http";
import {defineStore} from "pinia";


export const useOrganizationStore = defineStore({
  id: 'organization',

  state: () => ({
    entity: {},
    employees: [],
    employeesPagination: {},

    organizations: [],
    editedOrganization: null,
  }),

  getters: {

  },
  actions: {
    async fetchOrganizations(params) {
      const paramsRequests = params ? `?${params}` : ""

      console.log(paramsRequests)
      const {data} = await http.get(`/organizations${paramsRequests}`)
      this.organizations = data;
    },
    async fetchEmployees(id, params) {
      const paramsRequests = params ? `?${params}` : ""
      const result = await http.get(`/organizations/${id}/employees${paramsRequests}`)
      this.employeesPagination = JSON.parse(result.headers['x-pagination'])
      this.employees = result.data;
    },
    async getEntityForCard(id) {
      const {data} = await http.get(`/organizations/${id}`)
      this.entity = data;
    },

    async getEditedOrganization(id) {
      const {data} = await http.get(`/organizations/${id}`)
      this.editedOrganization = data;
      console.log("getEditedOrganization")
    },

    async createEntity(dto) {
      const {data} = await http.post('/organizations', dto)

    },
  }
})
