<template>
  <div class="col q-gutter-md fa-border">
    <div>
      Неустойка рассчитывается для каждого начисления отдельно и начисляется на баланс договора самостоятельной операцией.
    </div>
    <div>
      Выберите один из типов неустойки.
    </div>
    <div>
      <q-btn-toggle
        v-model="forfeitFinancesType"
        toggle-color="primary"
        :options="forfeitTypeOptions">
      </q-btn-toggle>

      <div v-if="forfeitFinancesType === 'Penalties'" class="col">
        <div>
          Пени формируются месяц после фиксации долга и в конце месяца начисляются на баланс договора.
        </div>
        <div class="text-weight-bold">
          Ежедневное формирование пеней
        </div>
        <div style="width: 250px">
          <q-input
            type="number"
            v-model="forfeitFinancesPenaltyPercentOnDebtAmount" outlined label="Пени от суммы долга, %">
          </q-input>
        </div>
        <div style="width: 250px">
          <q-input
            type="number"
            v-model="forfeitFinancesMaximumPercentOnDebtAmount" outlined label="Максимально от суммы долга, %">
          </q-input>
        </div>
        <div>
          Формирование пени остановится как только на балансе будет положительный остаток, чтобы закрыть долг.
        </div>
        <div>
          Сформированные пени будут начислены в конце расчетного периода.
        </div>
      </div>

      <div v-if="forfeitFinancesType === 'Fines'" class="col">
        <div>
          Начисление штрафа будет создано через это количество дней. Далее каждые 30 дней просрочки оплаты.
        </div>
        <div style="width: 250px">
          <q-input
            type="number"
            v-model="forfeitFinancesFineSumPerMonth" outlined label="Сумма штрафа в месяц, руб.">
          </q-input>
        </div>
      </div>

      <div>
        <q-toggle left-label v-model="forfeitFinancesTransferMoneyAutomatically" label="Автоматическое проведение созданных начислений"></q-toggle>
      </div>
    </div>
  </div>
</template>

<script setup>
import { inject } from "vue";
import { getForfeitTypeOptions } from "composition/options/getForfeitTypeOptions";

const forfeitTypeOptions = getForfeitTypeOptions()

const {
  forfeitFinancesType,
  forfeitFinancesPenaltyPercentOnDebtAmount,
  forfeitFinancesMaximumPercentOnDebtAmount,
  forfeitFinancesFineSumPerMonth,
  forfeitFinancesTransferMoneyAutomatically,
} = inject('productForfeitFinancialSettings')

</script>

<style scoped>

</style>
