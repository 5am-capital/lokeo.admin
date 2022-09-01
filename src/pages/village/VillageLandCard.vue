<template>
  <q-page class="q-pa-md col q-gutter-md">
    <div class="text-h4">Участок №{{entity.number}}</div>

    <q-card flat bordered style="width: 100%; max-width: 600px">
      <q-card-section horizontal>
        <q-card-section>
          Собственность {{entity.activeOwnershipName}}
        </q-card-section>
        <q-separator vertical></q-separator>
        <q-card-actions vertical align="center">
            <q-btn color="primary" label="Активировать собственность"></q-btn>
        </q-card-actions>
      </q-card-section>
    </q-card>


    <q-btn icon="add" color="primary" @click="toPageCreateOwner" label="Добавить лицо к собственности"></q-btn>
    <div class="text-h6">
      Собственники, представители и гости собственности {{entity.activeOwnershipName}}
    </div>
    <div>
      <q-table
        :rows="owners.rows"
        :columns="owners.columns"
        v-model="ownerTable"
        row-key="id"
        v-model:pagination="ownerTablePagination"
        :loading="ownerTableLoading"
        @request="onOwnerTableRequest"
      >
        <template v-slot:top-left="props">
          <div style="width: 250px">
            <q-select
              v-model="ownerType"
              multiple
              :options="ownerTypeOptions"
              use-chips
              stack-label
              label="Группа"
              @update:model-value="selectOwnerType(props)"
            ></q-select>
          </div>
        </template>
        <template v-slot:top-right="props">
          <q-input  dense
                    debounce="300"
                    v-model="ownerTableSearch"
                    placeholder="Поиск"
                    @update:model-value="searchOwners(props)">
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

import { onMounted, computed, ref, toRaw} from "vue";
import { useLandStore } from "stores/landStore";
import { useRoute, useRouter } from "vue-router";
import { getOwnerType } from "composition/enums/getOwnerType";
import { useCreateOptions } from "composition/options/createOptions";
import { getOwnerTypeOptions } from "composition/options/getOwnerTypeOptions";

const router = useRouter()
const route = useRoute()

const landStore = useLandStore()

const entity = computed(() => landStore.land)



const owners = computed(() => {
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
      { name: 'ownerType', align: 'left', label: 'Статус', field: row => getOwnerType(row.ownerType), sortable: true, },
      { name: 'phoneNumber', align: 'left', label: 'Телефон', field: row => row.phoneNumber },
      { name: 'email', align: 'left', label: 'Email', field: row => row.email },
    ],
    rows: toRaw(landStore.owners)
  }
})
const ownerTable = ref()
const ownerTableFilter = ref('')
const ownerTableSearch = ref('')
const ownerTableLoading = ref(false)
const ownerTablePagination = ref({
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 3,
  rowsNumber: 10
})

const ownerType = ref(null)
const ownerTypeOptions = computed(() => {
  return getOwnerTypeOptions();
})

function searchOwners(props) {
  onOwnerTableRequest(props)
}
function selectOwnerType(props) {
  onOwnerTableRequest(props)
}

async function onOwnerTableRequest(props) {
  const { page, rowsPerPage, sortBy, descending } = props.pagination
  const filter = props.filter

  ownerTableLoading.value = true

  let params = "";
  params = [params, `pageNumber=${page}`].join("")
  params = [params, `pageSize=${rowsPerPage}`].join("&")

  if(ownerTableSearch.value && ownerTableSearch.value !== "") params = [params, `searchTerm=${ownerTableSearch.value}`].join('&')

  if(sortBy && sortBy !== "" && sortBy !== "desc") {
    const desc = descending ? "desc" : ""
    params = [params, `orderBy=${sortBy} ${desc}`].join('&')
  }

  if(ownerType.value && ownerType.value.length > 0) {
    const selectedOwnerTypes = ownerType.value.map(q => q.value)
    params = [params, `ownerTypes=${selectedOwnerTypes.join(",")}`].join('&')
  }

  console.log(params)
  await landStore.fetchOwners(route.params.landId, params)

  // don't forget to update local pagination object
  ownerTablePagination.value.page = page
  ownerTablePagination.value.rowsPerPage = rowsPerPage
  ownerTablePagination.value.sortBy = sortBy
  ownerTablePagination.value.descending = descending
  ownerTablePagination.value.rowsNumber = landStore.ownersPagination.totalCount

  ownerTableLoading.value = false
}

async function toPageCreateOwner() {
  await router.push(`/villageList/${route.params.id}/lands/${route.params.landId}/ownerCreate`)
}

onMounted(async () => {
  await landStore.fetchLand(route.params.landId)

  console.log(landStore.land)

  let params = "";
  params = [params, `pageNumber=${ownerTablePagination.value.page}`].join("")
  params = [params, `pageSize=${ownerTablePagination.value.rowsPerPage}`].join("&")

  await landStore.fetchOwners(route.params.landId, params)

  ownerTablePagination.value.rowsNumber = landStore.ownersPagination.totalCount
})


</script>

<style scoped>

</style>
