<template>
  <div class="col q-gutter-md">
    <div class="text-weight-bold">Цена</div>
    <div class="row">
      <q-input type="number" v-model="generalFinancesPrice" outlined label="Цена, руб"></q-input>
      <q-toggle v-model="generalFinancesUseLandSizesForPricing" label="Использовать размеры участка"></q-toggle>
    </div>
    <div class="row">
      <q-input v-if="!generalFinancesUseLandSizesForPricing" type="number"
               v-model="generalFinancesAmount" outlined label="Количество"></q-input>
    </div>
    <div style="width: 250px">
      <q-select outlined v-model="generalFinancesMeasurementUnit" :options="measurementUnits" label="Выберите единицу измерения"></q-select>
    </div>
    <div class="text-weight-bold">Способ расчёта суммы списания</div>
    <q-option-group
      v-model="generalFinancesAccrualWayCalculation"
      :options="accrualWayCalculationOptions"
      color="primary"
    ></q-option-group>
  </div>
</template>

<script setup>
import { computed, inject, onMounted } from "vue";
import { getAccrualWayCalculationOptions } from "composition/options/getAccrualWayCalculationOptions";
import { useMeasurementUnitStore } from "stores/measurementUnitStore";
import { useCreateOptions } from "composition/options/createOptions";

const measurementUnitStore = useMeasurementUnitStore()
const accrualWayCalculationOptions = getAccrualWayCalculationOptions()

const measurementUnits = computed(() => {
  let filteredMeasurementUnits = measurementUnitStore.entities;
  if(generalFinancesUseLandSizesForPricing.value) {
    filteredMeasurementUnits = filteredMeasurementUnits.filter(q => q.isStandardLandUnit)
  }
  return useCreateOptions(filteredMeasurementUnits);
})

const {
  generalFinancesPrice,
  generalFinancesAmount,
  generalFinancesUseLandSizesForPricing,
  generalFinancesAccrualWayCalculation,
  generalFinancesMeasurementUnit
} = inject('productGeneralFinancialSettings')


onMounted(async () => {
  await measurementUnitStore.fetchEntities()
})

</script>

<style scoped>

</style>
