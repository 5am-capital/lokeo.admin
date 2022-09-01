<template>
  <div class="col q-gutter-lg">
    <q-btn color="primary" icon="mdi-plus-thick" label="Новый шаблон договора" @click="toCreateEntityPage"></q-btn>
    <q-table
      title="Наши шаблоны договоров"
      :rows="entities.rows"
      :columns="entities.columns"
      row-key="name"
    >
      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th auto-width></q-th>
          <q-th
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
          >
            {{ col.label }}
          </q-th>
        </q-tr>
      </template>
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td auto-width>
            <q-btn size="sm" color="primary" icon="edit" round dense @click="toEditEntityPage(props.cols[0].value)"></q-btn>
          </q-td>
          <q-td
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
          >
            {{ col.value }}
          </q-td>
        </q-tr>
        <q-tr v-show="props.expand" :props="props">
          <q-td colspan="100%">
            <div class="text-left">This is expand slot for row above: {{ props.row.name }}.</div>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>

<script setup>
import {useRouter} from "vue-router";
import { computed, onMounted, toRaw } from "vue";
import { useContractTemplateStore } from "stores/contractTemplateStore";
import { getContractTemplateStatus } from "composition/enums/getContractTemplateStatus";
import { getOwnershipTransfer } from "composition/enums/getOwnershipTransfer";

const router = useRouter()
const contractTemplateStore = useContractTemplateStore()

function toCreateEntityPage() {
  router.push('contractTemplateCreate')
}

function toEditEntityPage(id) {
  router.push(`contractTemplateList/${id}`)
}
const entities = computed(() => {
  return {
    columns: [
      {
        name: 'id',
        required: true,
        label: '#',
        align: 'left',
        field: row => row.id,
        format: val => `${val}`,
      },
      {
        name: 'name',
        label: 'Название',
        align: 'left',
        field: row => row.name,
        format: val => `${val}`,
      },
      { name: 'сontractTemplateStatus', align: 'left', label: 'Статус', field: row => getContractTemplateStatus(row.сontractTemplateStatus) },
      { name: 'firstSide', align: 'left', label: 'Сторона №1', field: row => row.firstSide ? row.firstSide.name : '' },
      { name: 'village', align: 'left', label: 'Посёлок', field: row => row.village ? row.village.name : '' },
      { name: 'ownershipTransfer', align: 'left', label: 'Передача собственности', field: row => getOwnershipTransfer(row.ownershipTransfer) },
    ],
    rows: toRaw(contractTemplateStore.entities)
  }
})

onMounted(() => {
  contractTemplateStore.fetchEntities()
})
</script>

<style scoped>

</style>
