<template>
  <div class="col q-gutter-md fa-border">
    <div>
      Добавьте настройки создания регулярных начислений. Система в соответствии с ценой продукта автоматически создаст новое начисление в день начала финансового периода.

    </div>
    <div>
      При включённой опции начисления аванса, сумма аванса учитывается в первом финансовом периоде.
    </div>
    <div>
      <q-btn-toggle
        v-model="regularFinancesRegularity"
        toggle-color="primary"
        :options="accrualRegularityOptions">
      </q-btn-toggle>
      <div class="row">
        <div style="width: 250px">
          <q-input
            :disable="regularFinancesPeriodLastDayOfMonth"
            type="number"
            v-model="regularFinancesPeriodStartDay" outlined label="День начала фин. периода">
          </q-input>
        </div>
        <q-checkbox v-model="regularFinancesPeriodLastDayOfMonth" label="Последний день месяца"></q-checkbox>
      </div>
      <div v-if="regularFinancesRegularity === 'EveryYear'">
        <div style="width: 250px">
          <q-input
            type="number"
            v-model="regularFinancesPeriodStartMonth" outlined label="Месяц начала фин. периода">
          </q-input>
        </div>
      </div>
      <div>
        <div class="text-weight-bold">
          Первое начисление на баланс договора
        </div>
        <div>
          <q-option-group
            v-model="regularFinancesFirstAccrualRules"
            :options="firstAccrualRulesOptions"
            color="primary"
          ></q-option-group>
        </div>
      </div>
      <div>
        <div class="text-weight-bold">
          Срочность настройки
        </div>
        <div>
          <q-option-group
            v-model="regularFinancesAccrualUrgency"
            :options="accrualUrgencyOptions"
            color="primary"
          ></q-option-group>
        </div>
      </div>
      <div>
        <q-toggle left-label v-model="regularFinancesTransferMoneyAutomatically" label="Автоматическое проведение созданных начислений"></q-toggle>
      </div>
    </div>
  </div>
</template>

<script setup>

import { inject } from "vue";
import { getFirstAccrualRules } from "composition/options/getFirstAccrualRules";
import { getAccrualUrgency } from "composition/options/getAccrualUrgency";
import { getAccrualRegularity } from "composition/options/getAccrualRegularity";

const firstAccrualRulesOptions = getFirstAccrualRules();
const accrualUrgencyOptions = getAccrualUrgency();
const accrualRegularityOptions = getAccrualRegularity();

const {
  regularFinancesTransferMoneyAutomatically,
  regularFinancesPeriodStartDay,
  regularFinancesPeriodStartMonth,
  regularFinancesPeriodLastDayOfMonth,
  regularFinancesFirstAccrualRules,
  regularFinancesAccrualUrgency,
  regularFinancesRegularity
} = inject('productRegularAccrualFinancialSettings')


</script>

<style scoped>

</style>
