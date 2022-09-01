<template>
  <q-page class="q-pa-md col q-gutter-md">
    <div class="text-h4">{{entity.name}}</div>
    <div>
      <q-table
        title="Участки"
        :rows="lands.rows"
        :columns="lands.columns"
        v-model="landTable"
        row-key="id"
        v-model:pagination="landTablePagination"
        :loading="landTableLoading"
        @request="onLandTableRequest"
        @row-click="toVillageLandCard"
      >
      </q-table>
    </div>
  </q-page>
</template>

<script setup>

import { useRoute, useRouter } from "vue-router";
import { useVillageStore } from "stores/villageStore";
import { computed, onMounted, toRaw, ref} from "vue";

const router = useRouter()
const route = useRoute()

const villageStore = useVillageStore()
const entity = computed(() => villageStore.village)

const lands = computed(() => {
  return {
    columns: [
      {
        name: 'name',
        required: true,
        label: 'Название',
        align: 'left',
        field: row => `Участок №${row.landNumber}`,
        format: val => `${val}`
      },
    ],
    rows: toRaw(villageStore.lands)
  }
})
const landTable = ref()
const landTableLoading = ref(false)
const landTablePagination = ref({
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 5,
  rowsNumber: 10
})

async function onLandTableRequest(props) {
  const { page, rowsPerPage, sortBy, descending } = props.pagination

  landTableLoading.value = true

  let params = "";
  params = [params, `pageNumber=${page}`].join("")
  params = [params, `pageSize=${rowsPerPage}`].join("&")

  await villageStore.fetchVillageLands(route.params.id, params)

  landTablePagination.value.page = page
  landTablePagination.value.rowsPerPage = rowsPerPage
  landTablePagination.value.sortBy = sortBy
  landTablePagination.value.descending = descending
  landTablePagination.value.rowsNumber = villageStore.landsPagination.totalCount

  landTableLoading.value = false
}

function toVillageLandCard(evt, row, index) {
  const id = villageStore.lands[index].id
  router.push(`${route.params.id}/lands/${id}`)
}

onMounted(async () => {
  await villageStore.fetchVillage(route.params.id)

  let params = "";
  params = [params, `pageNumber=${landTablePagination.value.page}`].join("")
  params = [params, `pageSize=${landTablePagination.value.rowsPerPage}`].join("&")
  await villageStore.fetchVillageLands(route.params.id, params)
})

</script>

<style scoped>

</style>
