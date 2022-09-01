<template>
  <q-page class="q-pa-md col q-gutter-md" style="max-width: 800px">
    <div class="text-h4">{{entity.name}}</div>
    <div class="text-subtitle2">{{entity.village?.name}}</div>
    <div class="fa-border" style="max-width: 250px">
      <div class="text-weight-bold">Данные шаблона</div>
      <div>
        <div class="row justify-between">
          <div>Счетов</div>
          <div>TODO</div>
        </div>
        <div class="row justify-between">
          <div>Продуктов</div>
          <div>{{productTemplateAmount}}</div>
        </div>
        <div class="row q-col-gutter-xs justify-between">
          <div>Сторона №1</div>
          <div>{{entity.firstSide?.name}}</div>
        </div>
        <div class="row q-col-gutter-xs justify-between">
          <div>Передача собственности</div>
          <div>{{getOwnershipTransfer(entity.ownershipTransfer)}}</div>
        </div>
      </div>
    </div>
    <div>Продукты</div>
    <div>
      Добавьте продукты к шаблону, чтобы создать лицевые счета в собственности ваших участков.
    </div>
    <div>
      Чтобы использовать этот шаблон для непроданных участков добавьте базовые продукты. Также вы можете использовать шаблон для публикации дополнительных услуг уже существующим клиентам
    </div>

    <div>
      <div class="row q-gutter-sm items-center">
        <q-select outlined
                  v-model="selectedProductRef"
                  :options="availableProducts"
                  label="Выберите продукт"
                  style="width: 250px"></q-select>
        <q-btn color="primary" @click="addProductToTemplate">Добавить</q-btn>
      </div>
    </div>
    <q-table
      :title="productTableTitle"
      :rows="products.rows"
      :columns="products.columns"
      :visible-columns="products.visibleColumns"
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
            <q-btn :label="props.cols[1].value === 'Ready' ? 'Отредактировать' : 'Настроить'"
                   size="sm"
                   color="primary"
                   @click="toAddFinancialSettingPage(props.cols[0].value, props.cols[1].value)"></q-btn>
          </q-td>
          <q-td
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
          >
            {{ col.label !== '#' ? col.value : "" }}
          </q-td>
        </q-tr>
        <q-tr v-show="props.expand" :props="props">
          <q-td colspan="100%">
            <div class="text-left">This is expand slot for row above: {{ props.row.name }}.</div>
          </q-td>
        </q-tr>
      </template>
    </q-table>
    <div>
      <div class="text-h6 text-weight-bold">Финансовые условия шаблона</div>
      <div class="text-h5 text-weight-bold">TODO</div>
    </div>

  </q-page>

</template>

<script setup>
import {useRouter, useRoute } from "vue-router";
import { onMounted, computed, ref, toRaw } from "vue";
import { useContractTemplateStore } from "stores/contractTemplateStore";
import { useAppliedProductStore } from "stores/appliedProductStore";
import { getOwnershipTransfer } from "composition/enums/getOwnershipTransfer"
import { useCreateOptions } from "composition/options/createOptions";
import { getProductSupplyType } from "composition/enums/getProductSupplyType";
import { useAddProductToTemplateDto } from "composition/dtos/addProductToTemplateDto";

const router = useRouter()
const route = useRoute()
const contractTemplateStore = useContractTemplateStore()
const appliedProductStore = useAppliedProductStore()

const selectedProductRef = ref(null);

const entity = computed(() => contractTemplateStore.entity)

const availableProducts = computed(() => {
  return useCreateOptions(contractTemplateStore.productsToAdd)
})

const productTemplateAmount = computed(() => appliedProductStore.entities.length)

const productTableTitle = computed(() => {
  const org = entity.value.firstSide?.name;
  return `Доступные продукты организации ${org}`;
})

const products = computed(() => {
  return {
    columns: [
      {
        name: 'id',
        label: '#',
        align: 'left',
        field: row => row.id,
        format: val => `${val}`,
      },
      {
        name: 'appliedProductStatus',
        label: '#',
        align: 'left',
        field: row => row.appliedProductStatus,
        format: val => `${val}`,
      },
      {
        name: 'name',
        label: 'Название',
        align: 'left',
        field: row => row.name,
        format: val => `${val}`,
      },
      { name: 'vendorCode', align: 'left', label: 'Артикул', field: 'vendorCode' },
      { name: 'productSupplyType', align: 'left', label: 'Тип', field: row => getProductSupplyType(row.productSupplyType) },
      { name: 'cost', align: 'left', label: 'Стоимость', field: 'cost' },
    ],
    rows: toRaw(appliedProductStore.entities),
  }
})

async function addProductToTemplate() {
  if(!selectedProductRef.value) return;
  const dto = {
    productId: selectedProductRef.value.id,
    contractTemplateId: entity.value.id,
  }

  // const dto = useAddProductToTemplateDto(selectedProductRef.value.id, entity.value.id);

  await appliedProductStore.addProductToTemplate(dto)
  await appliedProductStore.fetchEntities(entity.value.id)
}

function toAddFinancialSettingPage(productId, status) {

  if(status === 'NotReady')
    router.push(`${route.params.id}/product/${productId}`)
  else if(status === 'Ready')
    router.push(`${route.params.id}/product/${productId}`)
}

onMounted(() => {
  contractTemplateStore.fetchEntity(route.params.id)
  contractTemplateStore.fetchProductsToAdd()
  appliedProductStore.fetchEntities(route.params.id)
})

</script>

<style scoped>

</style>
