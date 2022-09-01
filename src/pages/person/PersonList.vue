<template>
  <div class="col q-gutter-lg">
    <q-btn color="primary" icon="mdi-plus-thick" label="Создать лицо"  @click="toCreatePersonPage"></q-btn>

    <q-tabs
      v-model="peopleTab"
      dense
      narrow-indicator
    >
      <q-tab name="owners" label="Участков"></q-tab>
      <q-tab name="employees" label="Компании"></q-tab>
    </q-tabs>
    <q-tab-panels v-model="peopleTab">

      <q-tab-panel name="owners" animated>
        <q-table
          title="Собственники">
        </q-table>
      </q-tab-panel>
      <q-tab-panel name="employees" animated>
        <q-table
          title="Сотрудники">
        </q-table>
      </q-tab-panel>
    </q-tab-panels>


  </div>
</template>

<script setup>
import { useRouter } from "vue-router/dist/vue-router";
import { ref } from "vue";

const router = useRouter()

const peopleTab = ref()

function toCreatePersonPage() {
  router.push('personCreate')
}
</script>

<style scoped>

</style>
