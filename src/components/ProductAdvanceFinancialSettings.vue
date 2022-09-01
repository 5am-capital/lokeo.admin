<template>

  <div class="col q-gutter-md fa-border">
    <div>
      Система начислит аванс, который необходимо оплатить клиенту, чтобы активировать предоставление продукта.
    </div>
    <div>
      <q-btn-toggle
        v-model="advanceFinancesPercentsOrSum"
        toggle-color="primary"
        :options="percentsOrSumOptions">
      </q-btn-toggle>

      <div style="width: 250px">
        <q-input
          v-if="advanceFinancesPercentsOrSum === 'Sum'"
          type="number"
          v-model="advanceFinancesAdvanceAmount" outlined label="Сумма, руб">
        </q-input>
        <q-input
          v-if="advanceFinancesPercentsOrSum === 'Percents'"
          type="number"
          v-model="advanceFinancesAdvancePercentOnAmount" outlined label="Аванс в процентах от суммы">
        </q-input>
      </div>
      <div>
        <q-toggle left-label v-model="advanceFinancesTransferMoneyAutomatically" label="Автоматическое проведение аванса"></q-toggle>
      </div>
    </div>
  </div>
</template>

<script setup>

import { inject } from "vue";
import { getPercentsOrSum } from "composition/options/getPercentsOrSum";

const percentsOrSumOptions = getPercentsOrSum()
const {
  advanceFinancesTransferMoneyAutomatically,
  advanceFinancesPercentsOrSum,
  advanceFinancesAdvancePercentOnAmount,
  advanceFinancesAdvanceAmount
} = inject('productAdvanceFinancialSettings')


</script>

<style scoped>

</style>
