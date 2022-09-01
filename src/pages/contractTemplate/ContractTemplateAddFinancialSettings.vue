<template>
  <q-page class="q-pa-md col q-gutter-md" style="max-width: 700px; min-height: 1200px">
    <div class="col q-gutter-md">
      <div class="text-h4">{{productName}}</div>
      <div>Вы можете задать цену продукта и система посчитает стоимость, или наоборот.
        Если использовать размеры участка — стоимость будет рассчитана при добавлении договора с данным продуктом к участку.
      </div>
      <q-badge>Арт. {{productVendorCode}}</q-badge>

      <ProductGeneralFinancialSettings />

      <div>
        <div class="text-weight-bold">Система начислений</div>
        <q-btn-toggle
          v-model="accrualSystem"
          toggle-color="primary"
          :options="accrualSystemOptions"></q-btn-toggle>
        <div v-if="accrualSystem === 'Advance'">
          Заказ продукта не будет выполняться, пока на балансе клиента не достаточно средств для списания.
        </div>
        <div v-if="accrualSystem === 'Credit'">
          Клиент сможет пользоваться продуктом даже если на балансе нет доступных средств к списанию.
        </div>
        <div v-if="accrualSystem === 'Credit'">
          <q-input type="number"
                   v-model="debtAfterDays"
                   outlined
                   label="Долг наступит через ... дней неуплаты"
                   style="width: 300px"></q-input>
        </div>
      </div>

      <div>
        <div class="text-weight-bold">Способ начисления</div>
        <div>По умолчанию установлен стандартный способ начисления.</div>
        <div>Будет создаваться начисление с полной суммой продукта. </div>
        <div>Вы можете включить особые настройки создания начислений.</div>
      </div>

      <div class="col">
        <div>
          <div class="row items-start">
            <div>
              <q-toggle v-model="advanceFinancialSettingActivity"></q-toggle>
            </div>
            <q-expansion-item
              label="Начисление аванса для активации договора"
              v-model="advanceFinancialSettingExpanded">
              <ProductAdvanceFinancialSettings/>
            </q-expansion-item>
          </div>

        </div>

        <div>
          <div class="row items-start">
            <div>
              <q-toggle v-model="regularAccrualFinancialSettingActivity"></q-toggle>
            </div>
            <q-expansion-item
              label="Регулярное начисление"
              v-model="regularAccrualFinancialSettingExpanded">
              <ProductRegularAccrualFinancialSettings/>
            </q-expansion-item>
          </div>
        </div>
        <div>
          <div class="row items-start">
            <div>
              <q-toggle v-model="installmentFinancialSettingActivity"></q-toggle>
            </div>
            <q-expansion-item
              label="Начисление рассрочки"
              v-model="installmentFinancialSettingExpanded">
              <ProductInstallmentFinancialSettings/>
            </q-expansion-item>
          </div>
        </div>
        <div v-if="accrualSystem === 'Credit'">
          <div class="row items-start">
            <div>
              <q-toggle v-model="forfeitFinancialSettingActivity"></q-toggle>
            </div>
            <q-expansion-item
              label="Начисление неустойки по продукту"
              v-model="forfeitFinancialSettingExpanded">
              <ProductForfeitFinancialSettings/>
            </q-expansion-item>
          </div>
        </div>
      </div>




    </div>

    <q-btn label="Сохранить" @click="SaveFinancialSettings"></q-btn>
  </q-page>
</template>

<script setup>
import { useAppliedProductStore } from "stores/appliedProductStore";
import { onMounted, computed, ref, toRaw, provide, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getAccrualWayCalculationOptions } from "composition/options/getAccrualWayCalculationOptions";
import { getAccrualSystemOptions } from "composition/options/getAccrualSystemOptions";
import { getPercentsOrSum } from "composition/options/getPercentsOrSum";

import ProductGeneralFinancialSettings from "components/ProductGeneralFinancialSettings.vue";
import ProductAdvanceFinancialSettings from "components/ProductAdvanceFinancialSettings.vue";
import ProductRegularAccrualFinancialSettings from "components/ProductRegularAccrualFinancialSettings.vue";
import ProductInstallmentFinancialSettings from "components/ProductInstallmentFinancialSettings.vue";
import ProductForfeitFinancialSettings from "components/ProductForfeitFinancialSettings.vue";
import { getFirstAccrualRules } from "composition/options/getFirstAccrualRules";
import { getAccrualUrgency } from "composition/options/getAccrualUrgency";
import { getAccrualRegularity } from "composition/options/getAccrualRegularity";
import { getForfeitTypeOptions } from "composition/options/getForfeitTypeOptions";
import { useCreateOption } from "composition/options/createOption";


const router = useRouter()
const route = useRoute()

const appliedProductStore = useAppliedProductStore()

const entity = computed(() => appliedProductStore.entity)

const productName = ref('')
const productVendorCode = ref('')

const advanceFinancialSettingActivity = ref(!!entity.value.productAdvanceFinancialSettings);
const advanceFinancialSettingExpanded = ref(false);
const regularAccrualFinancialSettingActivity = ref(!!entity.value.productRegularAccrualFinancialSettings);
const regularAccrualFinancialSettingExpanded = ref(false);
const installmentFinancialSettingActivity = ref(!!entity.value.productInstallmentFinancialSettings);
const installmentFinancialSettingExpanded = ref(false);
const forfeitFinancialSettingActivity = ref(!!entity.value.productForfeitFinancialSettings);
const forfeitFinancialSettingExpanded = ref(false);

const generalFinancesPrice = ref(entity.value.productGeneralFinancialSettings?.price)
const generalFinancesAmount = ref(entity.value.productGeneralFinancialSettings?.amount)
const generalFinancesUseLandSizesForPricing = ref(entity.value.productGeneralFinancialSettings?.useLandSizesForPricing)
const generalFinancesAccrualWayCalculation = ref(entity.value.productGeneralFinancialSettings?.accrualWayCalculation
  || getAccrualWayCalculationOptions()[0].value)
const generalFinancesMeasurementUnit = ref()
provide('productGeneralFinancialSettings', {
  generalFinancesPrice,
  generalFinancesAmount,
  generalFinancesUseLandSizesForPricing,
  generalFinancesAccrualWayCalculation,
  generalFinancesMeasurementUnit
})

const advanceFinancesTransferMoneyAutomatically = ref(entity.value.productAdvanceFinancialSettings?.transferMoneyAutomatically)
const advanceFinancesPercentsOrSum = ref(getPercentsOrSum()[0].value)
const advanceFinancesAdvancePercentOnAmount = ref()
const advanceFinancesAdvanceAmount = ref()
provide('productAdvanceFinancialSettings', {
  advanceFinancesTransferMoneyAutomatically,
  advanceFinancesPercentsOrSum,
  advanceFinancesAdvancePercentOnAmount,
  advanceFinancesAdvanceAmount
})


const regularFinancesTransferMoneyAutomatically = ref(false)
const regularFinancesPeriodStartDay = ref()
const regularFinancesPeriodStartMonth = ref()
const regularFinancesPeriodLastDayOfMonth = ref(false)
const regularFinancesFirstAccrualRules = ref(getFirstAccrualRules()[0].value)
const regularFinancesAccrualUrgency = ref(getAccrualUrgency()[0].value)
const regularFinancesRegularity = ref(getAccrualRegularity()[0].value)

provide('productRegularAccrualFinancialSettings', {
  regularFinancesTransferMoneyAutomatically,
  regularFinancesPeriodStartDay,
  regularFinancesPeriodStartMonth,
  regularFinancesPeriodLastDayOfMonth,
  regularFinancesFirstAccrualRules,
  regularFinancesAccrualUrgency,
  regularFinancesRegularity
})

const installmentFinancesTransferMoneyIfPositiveBalanceAutomatically = ref(false)
const InstallmentNumber = ref(6)
provide('productInstallmentFinancialSettings', {
  installmentFinancesTransferMoneyIfPositiveBalanceAutomatically,
  InstallmentNumber
})


const forfeitFinancesType = ref(getForfeitTypeOptions()[0].value)
const forfeitFinancesPenaltyPercentOnDebtAmount = ref(1);
const forfeitFinancesMaximumPercentOnDebtAmount = ref(30);
const forfeitFinancesFineSumPerMonth = ref(50);
const forfeitFinancesTransferMoneyAutomatically = ref(false);
provide('productForfeitFinancialSettings', {
  forfeitFinancesType,
  forfeitFinancesPenaltyPercentOnDebtAmount,
  forfeitFinancesMaximumPercentOnDebtAmount,
  forfeitFinancesFineSumPerMonth,
  forfeitFinancesTransferMoneyAutomatically,
})


const accrualSystemOptions = getAccrualSystemOptions()
const accrualSystem = ref(getAccrualSystemOptions()[0].value)
const debtAfterDays = ref(14);

onMounted(async () => {
  await appliedProductStore.fetchEntity(route.params.productId)

  productName.value = entity.value.product.name
  productVendorCode.value = entity.value.product.vendorCode


  advanceFinancialSettingActivity.value = !!entity.value.productAdvanceFinancialSettings;
  regularAccrualFinancialSettingActivity.value = !!entity.value.productRegularAccrualFinancialSettings;
  installmentFinancialSettingActivity.value = !!entity.value.productInstallmentFinancialSettings;
  forfeitFinancialSettingActivity.value = !!entity.value.productForfeitFinancialSettings;

  if(entity.value.productGeneralFinancialSettings) {
    generalFinancesPrice.value = entity.value.productGeneralFinancialSettings?.price;
    generalFinancesAmount.value = entity.value.productGeneralFinancialSettings?.amount;
    generalFinancesUseLandSizesForPricing.value = entity.value.productGeneralFinancialSettings?.useLandSizesForPricing;
    generalFinancesAccrualWayCalculation.value = entity.value.productGeneralFinancialSettings?.accrualWayCalculation;

    generalFinancesMeasurementUnit.value = useCreateOption(entity.value.productGeneralFinancialSettings?.measurementUnit);
  }

  if(entity.value.productAdvanceFinancialSettings) {
    advanceFinancesTransferMoneyAutomatically.value = entity.value.productAdvanceFinancialSettings?.transferMoneyAutomatically;
    advanceFinancesPercentsOrSum.value = entity.value.productAdvanceFinancialSettings?.percentsOrSum;
    advanceFinancesAdvancePercentOnAmount.value = entity.value.productAdvanceFinancialSettings?.advancePercentOnAmount;
    advanceFinancesAdvanceAmount.value = entity.value.productAdvanceFinancialSettings?.advanceAmount;
  }

  if(entity.value.productRegularAccrualFinancialSettings) {
    regularFinancesTransferMoneyAutomatically.value = entity.value.productRegularAccrualFinancialSettings?.transferMoneyAutomatically;
    regularFinancesPeriodStartDay.value = entity.value.productRegularAccrualFinancialSettings?.financialPeriodStartDay;
    regularFinancesPeriodStartMonth.value = entity.value.productRegularAccrualFinancialSettings?.financialPeriodStartMonth;
    regularFinancesPeriodLastDayOfMonth.value = entity.value.productRegularAccrualFinancialSettings?.financialPeriodLastDayOfMonth;
    regularFinancesFirstAccrualRules.value = entity.value.productRegularAccrualFinancialSettings?.firstAccrualRules;
    regularFinancesAccrualUrgency.value = entity.value.productRegularAccrualFinancialSettings?.accrualUrgency;
    regularFinancesRegularity.value = entity.value.productRegularAccrualFinancialSettings?.accrualRegularity;
  }

  if(entity.value.productInstallmentFinancialSettings) {
    installmentFinancesTransferMoneyIfPositiveBalanceAutomatically.value = entity.value.productInstallmentFinancialSettings?.transferMoneyIfPositiveBalanceAutomatically;
    InstallmentNumber.value = entity.value.productInstallmentFinancialSettings?.installmentNumber;
  }

  if(entity.value.productForfeitFinancialSettings) {
    forfeitFinancesType.value = entity.value.productForfeitFinancialSettings?.forfeitType;
    forfeitFinancesPenaltyPercentOnDebtAmount.value = entity.value.productForfeitFinancialSettings?.penaltyPercentOnDebtAmount;
    forfeitFinancesMaximumPercentOnDebtAmount.value = entity.value.productForfeitFinancialSettings?.maximumPercentOnDebtAmount;
    forfeitFinancesFineSumPerMonth.value = entity.value.productForfeitFinancialSettings?.fineSumPerMonth;
    forfeitFinancesTransferMoneyAutomatically.value = entity.value.productForfeitFinancialSettings?.transferMoneyAutomatically;
  }

  if(entity.value.productGeneralFinancialSettings) {
    accrualSystem.value = entity.value.productGeneralFinancialSettings?.accrualSystem;
    debtAfterDays.value = entity.value.productGeneralFinancialSettings?.debtAfterDays;
  }

})

watch(regularAccrualFinancialSettingActivity, (current) => {
  if(current) installmentFinancialSettingActivity.value = false;
})
watch(installmentFinancialSettingActivity, (current) => {
  if(current) regularAccrualFinancialSettingActivity.value = false;
})

async function SaveFinancialSettings() {
  let dto = {}
  // dto.appliedProduct = entity.value.appliedProduct
  dto.productGeneralFinancialSettings = {
    price: generalFinancesPrice.value,
    measurementUnit: generalFinancesMeasurementUnit.value,
    amount: generalFinancesAmount.value,
    useLandSizesForPricing: generalFinancesUseLandSizesForPricing.value,
    accrualSystem: accrualSystem.value,
    debtAfterDays: debtAfterDays.value,
    accrualWayCalculation: generalFinancesAccrualWayCalculation.value
  }

  if(advanceFinancialSettingActivity.value) {
    dto.productAdvanceFinancialSettings = {
      transferMoneyAutomatically: advanceFinancesTransferMoneyAutomatically.value,
      percentsOrSum: advanceFinancesPercentsOrSum.value,
      advancePercentOnAmount: advanceFinancesAdvancePercentOnAmount.value,
      advanceAmount: advanceFinancesAdvanceAmount.value
    }
  }
  if(regularAccrualFinancialSettingActivity.value) {
    dto.productRegularAccrualFinancialSettings = {
      transferMoneyAutomatically: regularFinancesTransferMoneyAutomatically.value,
      financialPeriodStartDay: regularFinancesPeriodStartDay.value,
      financialPeriodStartMonth: regularFinancesPeriodStartMonth.value,
      financialPeriodLastDayOfMonth: regularFinancesPeriodLastDayOfMonth.value,
      accrualRegularity: regularFinancesRegularity.value,
      firstAccrualRules: regularFinancesFirstAccrualRules.value,
      accrualUrgency: regularFinancesAccrualUrgency.value,
    }
  }
  if(forfeitFinancialSettingActivity.value) {
    dto.productForfeitFinancialSettings = {
      forfeitType: forfeitFinancesType.value,
      penaltyPercentOnDebtAmount: forfeitFinancesPenaltyPercentOnDebtAmount.value,
      maximumPercentOnDebtAmount: forfeitFinancesMaximumPercentOnDebtAmount.value,
      fineSumPerMonth: forfeitFinancesFineSumPerMonth.value,
      transferMoneyAutomatically: forfeitFinancesTransferMoneyAutomatically.value,
    }
  }
  if(installmentFinancialSettingActivity.value) {
    dto.productInstallmentFinancialSettings = {
      transferMoneyIfPositiveBalanceAutomatically: installmentFinancesTransferMoneyIfPositiveBalanceAutomatically.value,
      installmentMeasures: 'Months',
      installmentNumber: InstallmentNumber.value
    }
  }

  console.log(dto)
  await appliedProductStore.setSettings(route.params.productId, dto)
  await router.push(`/contractTemplateList/${route.params.id}`)
}

</script>

<style scoped>

</style>
