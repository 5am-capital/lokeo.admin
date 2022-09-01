<template>
  <q-page class="q-pa-md col q-gutter-md">
    <div class="text-h4">Новый посёлок</div>
    <div class="q-gutter-sm" style="max-width: 500px">
      <q-input outlined v-model="entityName"
               label="Название посёлка"/>
    </div>
    <q-btn color="primary" @click="createNewEntity">Создать новый посёлок</q-btn>
  </q-page>
</template>

<script setup>
import {useRouter} from "vue-router";
import { useVillageStore } from "stores/villageStore";
import { ref } from "vue";

const router = useRouter()
const villageStore = useVillageStore()
const entityName = ref('')

async function createNewEntity() {
  const dto = {
    name: entityName.value
  }

  await villageStore.createEntity(dto)
  await router.push('villageList')
}

</script>

<style scoped>

</style>
