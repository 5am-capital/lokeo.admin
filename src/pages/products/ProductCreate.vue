<template>
  <q-page class="q-pa-md col q-gutter-md">
    <div class="text-h4">Новый продукт</div>
    <div>Создайте новый продукт. Вы можете использовать продукт как для получения новых заказов, так и для управления поступлениями и начислениями уже существующих.</div>

    <q-badge color="blue">
      Арт. {{productVendorCode}}
    </q-badge>
    <div>
      <q-btn-toggle
        v-model="productSupplyType"
        toggle-color="primary"
        :options="productSupplyOptions"></q-btn-toggle>
    </div>
    <div v-if="productSupplyType === 'Base'">
      Поставляется вместе с продажей участка при активации собственности. Можно назначить участкам через шаблон.
    </div>
    <div v-if="productSupplyType === 'Additional'">
      Поставляется после того как клиент стал собственником участка. Продукт публикуется в личный кабинет для получения заказов.
    </div>

    <div class="q-gutter-sm" style="max-width: 500px">
      <div class="row items-center" >
        <q-input outlined v-model="productName"
                 label="Название продукта"/>
        <q-btn-toggle
          v-model="productType"
          toggle-color="primary"
          :options="productTypeOptions"></q-btn-toggle>
      </div>

      <div>
        <q-input
          v-model="productDesc"
          filled
          type="textarea"
        ></q-input>
      </div>
      <div>
        <q-select outlined v-model="productOrg" :options="organizations" label="Организация-поставщик"></q-select>
      </div>
      <div>
        <q-select outlined v-model="productCategory" :options="productCategories" label="Категория"></q-select>
      </div>
    </div>

    <q-btn color="primary" @click="createNewProduct">Создать новый продукт</q-btn>
  </q-page>
</template>

<script setup>

import {computed, onMounted, ref, toRaw, unref} from "vue";
import {useProductStore} from "stores/productStore";
import {useOrganizationStore} from "stores/organizationStore";
import {useRouter} from "vue-router";
import {getProductSupplyOptions} from 'composition/options/getProductSupplyOptions'
import {getProductTypeOptions} from "composition/options/getProductTypeOptions";

const router = useRouter()
const productStore = useProductStore()
const organizationStore = useOrganizationStore()

const productSupplyType = ref('Base')
const productName = ref('')
const productType = ref('Service')
const productDesc = ref('')
const productOrg = ref(null)
const productCategory = ref(null)
const productVendorCode = ref(Math.floor(100000000 + Math.random() * 900000000));

const productTypeOptions = computed(() => getProductTypeOptions())
const productSupplyOptions = computed(() => getProductSupplyOptions())

const productCategories = computed(() => {
  if(productStore.productCategories) {
    return productStore.productCategories.map(function(item) {
      item.label = item.name;
      return item;
    })
  }
  else {
    return []
  }
})

const organizations = computed(() => {
  if(organizationStore.organizations) {
    return organizationStore.organizations.map(function(item) {
      item.label = item.name;
      return item;
    })
  }
  else {
    return []
  }
})

async function createNewProduct() {
  const dto = {
      vendorCode: productVendorCode.value.toString(),
      name: productName.value,
      description: productDesc.value,
      productSupplyType: productSupplyType.value,
      productType: productType.value,
      productCategoryId: productCategory.value.id,
      supplierId: productOrg.value.id,
  }
  await productStore.createProduct(dto)
  router.push('productList')
}

onMounted(() => {
  productStore.fetchProductCategories()
  organizationStore.fetchOrganizations()


})

</script>

<style scoped>

</style>
