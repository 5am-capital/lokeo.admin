<template>
  <div class="q-pa-md" style="max-width: 800px;
    position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);">
    <div class="text-h3 q-pa-lg">Lokeo Admin App</div>
    <q-form
      ref="loginForm"
      class="q-gutter-md">
      <q-input
        filled
        v-model="phoneNumber"
        label="Телефон *"
        mask="# (###) ### ####"
        lazy-rules
        :rules="[ val => val && val.length > 0 || 'Please type something']"
      ></q-input>
      <q-input
        filled
        v-model="password"
        label="Пароль *"
        :type="isPwd ? 'password' : 'text'"
        lazy-rules
        :rules="[ val => val && val.length > 0 || 'Please type something']"
      ></q-input>
    </q-form>

    <div>
      <q-btn label="Войти" @click="onSubmit" color="primary"></q-btn>
      <q-btn label="Очистить" @click="onReset" color="primary" flat class="q-ml-sm"></q-btn>
    </div>
  </div>

</template>

<script setup>
import {ref} from "vue";
import {useAuthStore} from "stores/authStore";
import { useRouter } from 'vue-router'

const isPwd = ref(true)
const loginForm = ref({});

const phoneNumber = ref('99999999991')
const password = ref('q1234567890')

const authStore = useAuthStore()
const router = useRouter()

function onSubmit() {

    if(loginForm.value.validate()) {
      const phoneVal = phoneNumber.value;
      const passVal = password.value;

      authStore.login(phoneVal, passVal).then(() => {
        console.log('To Home')
        router.push('/home')
      })
    }


    // loginForm.value.validate().then(success => async {
    // if (success) {
    //   await authStore.login({email, password})
    // }
    // else {
    //   // oh no, user has filled in
    //   // at least one invalid value
    // }
}

function onReset() {
  console.log('onReset')
  loginForm.value.resetValidation()
}
</script>

<style scoped>

</style>
