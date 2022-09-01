<template>
  <q-page class="q-pa-md col q-gutter-md">
    <div class="text-h4">{{entity.name}}</div>
    <q-btn icon="add" color="primary" @click="toPageCreateEmployee" label="Добавить сотрудника"></q-btn>

    <div>
      <q-table
        title="Сотрудники"
        :rows="employees.rows"
        :columns="employees.columns"
        v-model="employeeTable"
        row-key="id"
        v-model:pagination="employeeTablePagination"
        :loading="employeeTableLoading"
        @request="onEmployeeTableRequest"
      >
        <template v-slot:top-left="props">
          <div style="width: 250px">
            <q-select
              v-model="personGroup"
              multiple
              :options="personGroups"
              use-chips
              stack-label
              label="Группа"
              @update:model-value="selectPersonGroup(props)"
            ></q-select>
          </div>

        </template>
        <template v-slot:top-right="props">
          <q-input  dense
                    debounce="300"
                    v-model="employeeTableSearch"
                    placeholder="Поиск"
                    @update:model-value="searchEmployee(props)">
            <template v-slot:append>
              <q-icon name="search"></q-icon>
            </template>
          </q-input>
        </template>
      </q-table>
    </div>
  </q-page>
</template>

<script setup>

import { useOrganizationStore } from "stores/organizationStore";
import { computed, onMounted, ref, toRaw } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useCreateOptions } from "composition/options/createOptions";
import { usePersonStore } from "stores/personStore";

const router = useRouter()
const route = useRoute()


const organizationStore = useOrganizationStore()
const personStore = usePersonStore()
const entity = computed(() => organizationStore.entity)



async function toPageCreateEmployee() {
  await router.push(`/organizationList/${route.params.id}/employeeCreate`)
}


const employees = computed(() => {
  return {
    columns: [
      {
        name: 'name',
        required: true,
        label: 'ФИО',
        align: 'left',
        field: row => `${row.lastName} ${row.firstName} ${row.middleName}`,
        format: val => `${val}`,
        sortable: true,
      },
      { name: 'position', align: 'left', label: 'Должность', field: row => row.position, sortable: true, },
      { name: 'personGroup', align: 'left', label: 'Группа', field: row => row.personGroup },
      { name: 'phoneNumber', align: 'left', label: 'Телефон', field: row => row.phoneNumber },
      { name: 'email', align: 'left', label: 'Email', field: row => row.email },
    ],
    rows: toRaw(organizationStore.employees)
  }
})
const employeeTable = ref()
const employeeTableFilter = ref('')
const employeeTableSearch = ref('')
const employeeTableLoading = ref(false)
const employeeTablePagination = ref({
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 3,
  rowsNumber: 10
})

const personGroup = ref(null)
const personGroups = computed(() => {
  let filteredPersonGroups = personStore.personGroups;
  filteredPersonGroups = filteredPersonGroups.filter(q => q.forOrganization)
  return useCreateOptions(filteredPersonGroups);
})

function selectPersonGroup(props) {
  onEmployeeTableRequest(props)
}
function searchEmployee(props) {
  onEmployeeTableRequest(props)
}

async function onEmployeeTableRequest(props) {
  const { page, rowsPerPage, sortBy, descending } = props.pagination
  const filter = props.filter

  employeeTableLoading.value = true

  let params = "";
  params = [params, `pageNumber=${page}`].join("")
  params = [params, `pageSize=${rowsPerPage}`].join("&")

  if(employeeTableSearch.value && employeeTableSearch.value !== "") params = [params, `searchTerm=${employeeTableSearch.value}`].join('&')


  if(sortBy && sortBy !== "" && sortBy !== "desc") {

    const desc = descending ? "desc" : ""
    params = [params, `orderBy=${sortBy} ${desc}`].join('&')
  }

  if(personGroup.value && personGroup.value.length > 0) {
    const selectedGroups = personGroup.value.map(q => toRaw(q).id)
    params = [params, `personGroupIds=${selectedGroups.join(",")}`].join('&')
  }

  console.log(params)
  await organizationStore.fetchEmployees(route.params.id, params)

  // don't forget to update local pagination object
  employeeTablePagination.value.page = page
  employeeTablePagination.value.rowsPerPage = rowsPerPage
  employeeTablePagination.value.sortBy = sortBy
  employeeTablePagination.value.descending = descending
  employeeTablePagination.value.rowsNumber = organizationStore.employeesPagination.totalCount
  employeeTableLoading.value = false
}

onMounted(async () => {
  await organizationStore.getEntityForCard(route.params.id)
  await personStore.fetchPersonGroups()

  let params = "";
  params = [params, `pageNumber=${employeeTablePagination.value.page}`].join("")
  params = [params, `pageSize=${employeeTablePagination.value.rowsPerPage}`].join("&")

  await organizationStore.fetchEmployees(route.params.id, params)

  employeeTablePagination.value.rowsNumber = organizationStore.employeesPagination.totalCount
})

</script>

<style scoped>

</style>
