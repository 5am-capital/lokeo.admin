<template>
<q-layout view="hHh Lpr lff">-->
<!--    <q-header elevated>-->
<!--      <q-toolbar>-->
<!--        <q-btn-->
<!--          flat-->
<!--          dense-->
<!--          round-->
<!--          icon="menu"-->
<!--          aria-label="Menu"-->
<!--          @click="toggleLeftDrawer"-->
<!--        />-->

<!--        <q-toolbar-title>-->
<!--          Quasar App-->
<!--        </q-toolbar-title>-->

<!--        <div>Quasar v{{ $q.version }}</div>-->
<!--      </q-toolbar>-->
<!--    </q-header>-->

    <q-drawer
      v-model="drawer"
      show-if-above
      :width="200"
      :breakpoint="500"
      bordered
      class="bg-grey-3"
    >
      <q-list>
        <q-item-label v-if="authStore.isAuthorized" header>
          <router-link to="/productList" class="nav-link">
             Продукты
          </router-link>

        </q-item-label>
        <q-item-label v-if="authStore.isAuthorized" header>
          <router-link to="/organizationList" class="nav-link">
            Организации
          </router-link>
        </q-item-label>
        <q-item-label v-if="authStore.isAuthorized" header>
          <router-link to="/villageList" class="nav-link">
            Посёлки
          </router-link>
        </q-item-label>

        <q-item-label v-if="authStore.isAuthorized" header>
          <router-link to="/contractTemplateList" class="nav-link">
            Шаблоны
          </router-link>
        </q-item-label>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
</q-layout>
</template>

<script setup>

import {ref} from "vue";
import {useAuthStore} from "stores/authStore";

const drawer = ref(true)
const authStore = useAuthStore()

</script>
