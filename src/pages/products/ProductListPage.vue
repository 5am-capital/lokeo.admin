<template>
  <div class="col q-gutter-lg">
    <q-btn color="primary" icon="mdi-plus-thick" label="Новый продукт"  @click="toCreateProductPage"></q-btn>
    <q-table
      title="Наши продукты"
      :rows="products.rows"
      :columns="products.columns"
      row-key="name"
    >
    </q-table>
  </div>

  <q-btn @click="logout">Выйти</q-btn>
</template>

<script setup>
import {useAuthStore} from "stores/authStore";
import {computed, onMounted, toRaw} from "vue";
import {useProductStore} from "stores/productStore";
import {useRouter} from "vue-router";
import {getProductSupplyType } from "composition/enums/getProductSupplyType";

const router = useRouter()
const authStore = useAuthStore()
const productStore = useProductStore()

function logout() {
  authStore.logout()
  router.push('login')
}
function toCreateProductPage() {
  router.push('productCreate')
}

const products = computed(() => {

  if(!productStore.products) return []
  return {
    columns: [
      {
        name: 'name',
        required: true,
        label: 'Название',
        align: 'left',
        field: row => row.name,
        format: val => `${val}`,
      },
      { name: 'productSupplyType', align: 'left', label: 'Тип', field: row => getProductSupplyType(row.productSupplyType) },
      { name: 'supplier', align: 'left', label: 'Организация', field: row => row.supplier.name },
      { name: 'vendorCode', align: 'left', label: 'Артикул', field: 'vendorCode' },
    ],
    rows: toRaw(productStore.products)
  }
})

onMounted(() => {
  productStore.fetchProducts()
})

</script>

<style scoped>

</style>
