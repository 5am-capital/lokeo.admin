<template>
  <div class="col q-gutter-lg">
    <q-btn color="primary" icon="mdi-plus-thick" label="Новый посёлок" @click="toCreateEntityPage"></q-btn>
    <q-table
      title="Наши посёлки"
      :rows="entities.rows"
      :columns="entities.columns"
      row-key="name"
      @row-click="toVillageCard"
    >
    </q-table>
  </div>
</template>

<script setup>
import {useRouter} from "vue-router";
import { computed, onMounted, toRaw } from "vue";
import { useVillageStore } from "stores/villageStore";

const router = useRouter()
const villageStore = useVillageStore()

function toCreateEntityPage() {
  router.push('villageCreate')
}
const entities = computed(() => {
  return {
    columns: [
      {
        name: 'name',
        required: true,
        label: 'Название',
        align: 'left',
        field: row => row.name,
        format: val => `${val}`,
      },
      { name: 'landsCount', align: 'left', label: 'Участки', field: row => row.landsCount },
    ],
    rows: toRaw(villageStore.entities)
  }
})

function toVillageCard(evt, row, index) {
  const id = villageStore.entities[index].id
  router.push(`villageList/${id}`)
}

onMounted(() => {
  villageStore.fetchEntities()
})

</script>

<style scoped>

</style>
