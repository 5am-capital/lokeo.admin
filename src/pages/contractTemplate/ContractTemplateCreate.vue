<template>
  <q-page class="q-pa-md col q-gutter-md">
    <div class="text-h4">Новый шаблон договора</div>
    <div class="q-gutter-sm" style="max-width: 500px">
      <q-input outlined v-model="entityName"
               label="Название шаблона"/>
      <div class="text-subtitle3">Название договора должно отражать его суть.</div>

      <q-input outlined v-model="entityNameForClient"
               label="Название для личного кабинета клиента"/>

      <q-toggle v-model="entityOwnershipTransfer" label="Фиксирует передачу собственности"></q-toggle>

      <div>
        <q-select outlined v-model="entityFirstSide" :options="organizations" label="Сторона №1"></q-select>
        <div class="text-subtitle2">
          Данные этой организации будут использованы при создании лицевого счета и для каталога продуктов в личном кабинете клиента.
        </div>
      </div>

      <div>
        <q-select outlined v-model="entityVillage" :options="villages" label="Посёлок"></q-select>
        <div class="text-subtitle2">
          Шаблон договора будет использован для создания лицевых счетов
          в данном посёлке.
        </div>
      </div>
    </div>

    <q-btn color="primary" @click="createNewEntity">Создать новый шаблон</q-btn>
  </q-page>
</template>

<script setup>
import {useRouter} from "vue-router";
import { useContractTemplateStore } from "stores/contractTemplateStore";
import { ref, computed, onMounted  } from "vue";
import { useVillageStore } from "stores/villageStore";
import { useOrganizationStore } from "stores/organizationStore";

const router = useRouter()
const contractTemplateStore = useContractTemplateStore()
const villageStore = useVillageStore()
const organizationStore = useOrganizationStore()

const entityName = ref('')
const entityNameForClient = ref('')
const entityOwnershipTransfer = ref(false)
const entityFirstSide = ref(null)
const entityVillage = ref(null)

async function createNewEntity() {
  const dto = {
    name: entityName.value,
    nameForClient: entityNameForClient.value,
    ownershipTransfer: entityOwnershipTransfer.value,
    firstSideId: entityFirstSide.value.id,
    villageId: entityVillage.value.id,
  }
  await contractTemplateStore.createEntity(dto)
  await router.push('contractTemplateList')
}

const villages = computed(() => {
  return villageStore.entities.map(function(item) {
    item.label = item.name;
    return item;
  })
})

const organizations = computed(() => {
  return organizationStore.organizations.map(function(item) {
    item.label = item.name;
    return item;
  })
})

onMounted(() => {
  villageStore.fetchEntities()
  organizationStore.fetchOrganizations()
})
</script>

<style scoped>

</style>
