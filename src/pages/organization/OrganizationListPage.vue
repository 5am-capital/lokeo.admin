<template>
  <div class="col q-gutter-lg">
    <q-btn color="primary" icon="mdi-plus-thick" label="Новая организация" @click="toCreateEntityPage"></q-btn>
    <q-table
      title="Наши организации"
      :rows="entities.rows"
      :columns="entities.columns"
      @row-click="toOrganizationCard"
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
            <q-btn size="sm" color="primary" icon="edit" round dense @click="toEditEntityPage(props.row)"></q-btn>
          </q-td>
          <q-td
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
          >
            {{ col.value }}
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>

<script setup>
import {useRouter} from "vue-router";
import { computed, onMounted, toRaw } from "vue";
import { useOrganizationStore } from "stores/organizationStore";
import { getProductSupplyType } from "composition/enums/getProductSupplyType";
import { getOrganizationInternalType } from "composition/enums/getOrganizationInternalType";

const router = useRouter()
const organizationStore = useOrganizationStore()


const entities = computed(() => {
  return {
    columns: [
      {
        name: 'briefName',
        required: true,
        label: 'Организация',
        align: 'left',
        field: row => row.briefName,
        format: val => `${val}`,
      },
      { name: 'internalType', align: 'left', label: 'Статус', field: row => getOrganizationInternalType(row.internalType) },
      { name: 'inn', align: 'left', label: 'ИНН', field: row => row.inn },
      { name: 'employeesCount', align: 'left', label: 'Сотрудников', field: row => row.employeesCount },
      { name: 'checkingAccount', align: 'left', label: 'Расчетный счет', field: row => row.checkingAccount },
    ],
    rows: toRaw(organizationStore.organizations)
  }
})

function toOrganizationCard(evt, row, index) {
  const id = organizationStore.organizations[index].id
  router.push(`organizationList/${id}`)
}
function toCreateEntityPage() {
  organizationStore.editedOrganization = null
  router.push(`organizationCreate`)
}

async function toEditEntityPage(row) {
  await organizationStore.getEditedOrganization(row.id)
  router.push(`organizationCreate`)
}


onMounted(async () => {
  await organizationStore.fetchOrganizations()
})

</script>

<style scoped>

</style>
