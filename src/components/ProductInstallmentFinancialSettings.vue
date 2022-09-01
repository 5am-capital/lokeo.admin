<template>
  <div class="col q-gutter-md fa-border">
    <div>
      При активации (подписании) договора с этим продуктом в участке, система создаст начисления по указанному количеству месяцев.
    </div>
    <div>
      При включённой опции начисления аванса, сумма аванса учитывается в первом финансовом периоде.
    </div>
    <div>
      <div style="width: 250px">
        <q-input
          type="number"
          v-model="InstallmentNumber" outlined label="Количество месяцев">
        </q-input>
      </div>
      <div>
        <q-toggle left-label
                  v-model="installmentFinancesTransferMoneyIfPositiveBalanceAutomatically"
                  label="Проводить начисления при положительном остатке"></q-toggle>
      </div>
    </div>
  </div>

</template>

<script setup>
import { inject } from "vue";

const {
  installmentFinancesTransferMoneyIfPositiveBalanceAutomatically,
  InstallmentNumber
} = inject('productInstallmentFinancialSettings')
</script>

<style scoped>

</style>
