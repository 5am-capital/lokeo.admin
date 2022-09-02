<template>
  <q-page class="q-pa-md col q-gutter-md" style="max-width: 900px">
    <div class="text-h4">{{organizationDto.briefName ?? "Новая организация"}}</div>
    <div class="q-gutter-sm" >
      <q-input outlined v-model="organizationDto.commonData.inn"
               label="ИНН"/>
      <q-checkbox v-model="organizationDto.isMine" label="Моя организация"/>
      <q-select outlined
                label="Тип организации"
                v-model="organizationDto.commonData.legalType"
                :options="legalTypeOptions"/>
      <div class="row q-gutter-sm">
        <q-input outlined
                 v-model="organizationDto.commonData.ogrn"
                 label="ОГРН"/>
        <q-input outlined
                 v-model="organizationDto.commonData.kpp"
                 label="КПП"/>
        <q-input outlined
                 v-model="organizationDto.commonData.okpo"
                 label="ОКПО"/>
        <q-input outlined
                 v-model="organizationDto.commonData.oktmo"
                 label="ОКТМО"/>
      </div>

      <q-input outlined
               v-model="organizationDto.name"
               label="Полное название"/>
      <q-input outlined
               v-model="organizationDto.briefName"
               label="Сокращенное название"/>
      <q-input outlined
               v-model="organizationDto.commonData.address"
               label="Адрес организации"/>
      <div class="row q-gutter-sm">
        <q-input outlined
                 type="date"
                 v-model="organizationDto.commonData.registrationDate"
                 label="Дата регистрации"/>
        <q-input outlined
                 v-model="organizationDto.commonData.registrationAuthority"
                 label="Регистрирующий орган"/>
      </div>
      <div class="row q-gutter-sm">
        <q-input outlined
                 v-model="organizationDto.commonData.directorName"
                 label="Генеральный директор"/>
        <q-input outlined
                 v-model="organizationDto.commonData.accounterName"
                 label="Главный бухгалтер / кассир"/>
      </div>
    </div>

    <div>
      <div class="row items-start">
        <div>
          <q-toggle v-model="hasContacts"></q-toggle>
        </div>
        <q-expansion-item
          label="Контакты"
          v-model="hasContactsExpanded">

          <div class="col q-gutter-sm">
            <div class="text-h6">Основные контактные данные</div>
            <q-input outlined
                     v-model="organizationDto.contacts[0].phoneNumber"
                     label="Номер телефона"
                     mask="# (###) ### ####"/>
            <q-input outlined
                     v-model="organizationDto.contacts[0].email"
                     label="Email"/>
            <q-input outlined
                     v-model="organizationDto.contacts[0].site"
                     label="Сайт"/>
            <q-input outlined
                     v-model="organizationDto.contacts[0].address"
                     label="Адрес офиса"/>

            <div v-if="organizationDto.contacts.length > 1">
              <div class="text-h6">Доп. контактные данные</div>
              <div v-for="(item, index) in organizationDto.contacts.slice(1)" :key="item.index">
                <q-checkbox v-model="organizationDto.contacts[index].makeAsMain"
                            label="Сделать основными данными"/>
                <q-input outlined
                         v-model="organizationDto.contacts[index].phoneNumber"
                         label="Номер телефона"
                         mask="# (###) ### ####"/>
                <q-input outlined
                         v-model="organizationDto.contacts[index].email"
                         label="Email"/>
                <q-input outlined
                         v-model="organizationDto.contacts[index].site"
                         label="Сайт"/>
                <q-input outlined
                         v-model="organizationDto.contacts[index].address"
                         label="Адрес офиса"/>
              </div>
            </div>

          </div>
          <q-btn color="primary" icon="add" @click="addContacts"></q-btn>
          <q-btn v-if="organizationDto.contacts.length > 1" color="primary" icon="remove" @click="removeContacts"></q-btn>
        </q-expansion-item>
      </div>
    </div>

    <div>
      <div class="row items-start">
        <div>
          <q-toggle v-model="hasRequisites"></q-toggle>
        </div>
        <q-expansion-item
          label="Банковские реквизиты"
          v-model="hasRequisitesExpanded">

          <div class="col q-gutter-sm">
            <div class="text-h6">Основные банковские реквизиты</div>
            <q-checkbox v-model="organizationDto.requisites[0].isInternetAcquiringAccount"
                        label="Счет интернет-эквайринга"/>
            <q-input outlined
                     v-model="organizationDto.requisites[0].checkingAccount"
                     label="Номер расчетного счета"/>
            <q-input outlined
                     v-model="organizationDto.requisites[0].correspondentAccount"
                     label="Корреспондентский счет"/>
            <q-input outlined
                     v-model="organizationDto.requisites[0].bankName"
                     label="Название банка"/>
            <q-input outlined
                     v-model="organizationDto.requisites[0].bankKpp"
                     label="КПП банка"/>
            <q-input outlined
                     v-model="organizationDto.requisites[0].bankBik"
                     label="БИК банка"/>

            <div v-if="organizationDto.requisites.length > 1">
              <div class="text-h6">Доп. банковские реквизиты</div>
              <div v-for="(item, index) in organizationDto.requisites.slice(1)" :key="item.index">
                <div class="col q-gutter-sm">
                  <q-checkbox v-model="organizationDto.requisites[index].makeAsMain"
                              label="Сделать основными реквизитами"/>
                  <q-checkbox v-model="organizationDto.requisites[index].isInternetAcquiringAccount"
                              label="Счет интернет-эквайринга"/>
                </div>
                <q-input outlined
                         v-model="organizationDto.requisites[index].checkingAccount"
                         label="Номер расчетного счета"/>
                <q-input outlined
                         v-model="organizationDto.requisites[index].correspondentAccount"
                         label="Корреспондентский счет"/>
                <q-input outlined
                         v-model="organizationDto.requisites[index].bankName"
                         label="Название банка"/>
                <q-input outlined
                         v-model="organizationDto.requisites[index].bankKpp"
                         label="КПП банка"/>
                <q-input outlined
                         v-model="organizationDto.requisites[index].bankBik"
                         label="БИК банка"/>
              </div>
            </div>

          </div>
          <q-btn color="primary" icon="add" @click="addRequisites"></q-btn>
          <q-btn v-if="organizationDto.requisites.length > 1" color="primary" icon="remove" @click="removeRequisites"></q-btn>
        </q-expansion-item>
      </div>
    </div>

    <q-btn color="primary" @click="createNewEntity">Сохранить</q-btn>
  </q-page>
</template>

<script setup>
import {useRouter} from "vue-router";
import { useOrganizationStore } from "stores/organizationStore";
import { onMounted, ref } from "vue";
import { getLegalTypeOptions } from "composition/options/getLegalTypeOptions";

const router = useRouter()
const organizationStore = useOrganizationStore()

const legalTypeOptions = getLegalTypeOptions()

const hasContacts = ref(false)
const hasContactsExpanded = ref()

const hasRequisites = ref(false)
const hasRequisitesExpanded = ref()

const contactsCount = ref(0)
const requisitesCount = ref(0)

const organizationDto = ref({
  id: null,
  name: null,
  briefName: null,
  isMine: false,
  commonData: {
    id: null,
    legalType: null,
    inn: null,
    ogrn: null,
    kpp: null,
    okpo: null,
    oktmo: null,
    address: null,
    registrationDate: null,
    registrationAuthority: null,
    directorName: null,
    accounterName: null,
  },
  contacts: [getNewContacts()],
  requisites: [getNewRequisites()]
})

async function createNewEntity() {
  const dto = organizationDto.value;
  await organizationStore.createEntity(dto)
  await router.push('organizationList')
}

function addContacts() {
  organizationDto.value.contacts.push(getNewContacts())
}
function removeContacts() {
  if(organizationDto.value.contacts.length === 1) return;
  organizationDto.value.contacts = organizationDto.value.contacts.slice(1);
}

function addRequisites() {
  organizationDto.value.requisites.push(getNewRequisites())
}
function removeRequisites() {
  if(organizationDto.value.requisites.length === 1) return;
  organizationDto.value.requisites = organizationDto.value.requisites.slice(1);
}

function getNewContacts() {
  return {
    //Локальный индекс, бэк его будет не учитывать
    index: ++contactsCount.value,
    id: null,
    isMain: true,
    makeAsMain: false,
    phoneNumber: null,
    email: null,
    site: null,
    address: null,
  }
}

function getNewRequisites() {
  return {
    //Локальный индекс, бэк его будет не учитывать
    index: ++requisitesCount.value,
    id: null,
    isMain: true,
    makeAsMain: false,
    isInternetAcquiringAccount: false,
    checkingAccount: null,
    correspondentAccount: null,
    bankName: null,
    bankKpp: null,
    bankBik: null,
  }
}

onMounted(async () => {
  console.log(organizationStore.editedOrganization)
  if(organizationStore.editedOrganization) {
    Object.keys(organizationDto.value).forEach(field => organizationDto.value[field] = organizationStore.editedOrganization[field])

    if(organizationStore.editedOrganization.contacts) {
      organizationDto.value.contacts = organizationStore.editedOrganization.contacts
    }
    if(organizationStore.editedOrganization.requisites) {
      organizationDto.value.requisites = organizationStore.editedOrganization.requisites
    }
  }
})

</script>

<style scoped>

</style>
