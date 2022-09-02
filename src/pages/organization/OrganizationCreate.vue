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
                <q-checkbox v-model="organizationDto.contacts[index + 1].makeAsMain"
                            label="Сделать основными данными"/>
                <q-input outlined
                         v-model="organizationDto.contacts[index + 1].phoneNumber"
                         label="Номер телефона"
                         mask="# (###) ### ####"/>
                <q-input outlined
                         v-model="organizationDto.contacts[index + 1].email"
                         label="Email"/>
                <q-input outlined
                         v-model="organizationDto.contacts[index + 1].site"
                         label="Сайт"/>
                <q-input outlined
                         v-model="organizationDto.contacts[index + 1].address"
                         label="Адрес офиса"/>
              </div>
            </div>

          </div>
          <q-btn color="primary" icon="add" @click="addContacts(false)"></q-btn>
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
                  <q-checkbox v-model="organizationDto.requisites[index + 1].makeAsMain"
                              label="Сделать основными реквизитами"/>
                  <q-checkbox v-model="organizationDto.requisites[index + 1].isInternetAcquiringAccount"
                              label="Счет интернет-эквайринга"/>
                </div>
                <q-input outlined
                         v-model="organizationDto.requisites[index + 1].checkingAccount"
                         label="Номер расчетного счета"/>
                <q-input outlined
                         v-model="organizationDto.requisites[index + 1].correspondentAccount"
                         label="Корреспондентский счет"/>
                <q-input outlined
                         v-model="organizationDto.requisites[index + 1].bankName"
                         label="Название банка"/>
                <q-input outlined
                         v-model="organizationDto.requisites[index + 1].bankKpp"
                         label="КПП банка"/>
                <q-input outlined
                         v-model="organizationDto.requisites[index + 1].bankBik"
                         label="БИК банка"/>
              </div>
            </div>

          </div>
          <q-btn color="primary" icon="add" @click="addRequisites(false)"></q-btn>
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
import { onMounted, ref, toRaw } from "vue";
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
  contacts: [getNewContacts(true)],
  requisites: [getNewRequisites(true)]
})

async function createNewEntity() {
  const dto = toRaw(organizationDto.value);
  if(!hasRequisites.value) dto.requisites = null
  if(!hasContacts.value) dto.contacts = null

  dto.commonData.legalType = organizationDto.value.commonData.legalType.value

  await organizationStore.createEntity(dto)
  await router.push('organizationList')
}

function addContacts(isMain = false) {
  organizationDto.value.contacts.push(getNewContacts(isMain))
}
function removeContacts() {
  if(organizationDto.value.contacts.length === 1) return;
  organizationDto.value.contacts.splice(-1);
}

function addRequisites(isMain = false) {
  organizationDto.value.requisites.push(getNewRequisites(isMain))
}
function removeRequisites() {
  if(organizationDto.value.requisites.length === 1) return;
  organizationDto.value.requisites.splice(-1);
}

function getNewContacts(isMain = false) {
  console.log(isMain)
  return {
    //Локальный индекс, бэк его будет не учитывать
    index: ++contactsCount.value,
    id: null,
    isMain: isMain,
    makeAsMain: false,
    phoneNumber: null,
    email: null,
    site: null,
    address: null,
  }
}

function getNewRequisites(isMain = false) {
  return {
    //Локальный индекс, бэк его будет не учитывать
    index: ++requisitesCount.value,
    id: null,
    isMain: isMain,
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
     Object.keys(organizationDto.value).forEach(field =>
       organizationStore.editedOrganization[field]
         ? organizationDto.value[field] = organizationStore.editedOrganization[field]
         : organizationDto.value[field]
     )
     if(organizationStore.editedOrganization.commonData) {
       const legalTypes = getLegalTypeOptions()
       const legalType = legalTypes.find(q => q.value === organizationStore.editedOrganization.commonData.legalType)
       organizationDto.value.commonData.legalType = legalType
     }

    if(organizationStore.editedOrganization.contacts && organizationStore.editedOrganization.contacts.length > 0) {
      hasContacts.value = true
      hasContactsExpanded.value = true
      organizationDto.value.contacts = organizationStore.editedOrganization.contacts
      organizationDto.value.contacts.sort((a, b) => a.isMain === true ? -1 : 1)
      contactsCount.value = organizationDto.value.contacts.length
    } else {
      hasContacts.value = false
      hasContactsExpanded.value = false
      addContacts(true)
    }

    if(organizationStore.editedOrganization.requisites && organizationStore.editedOrganization.requisites.length > 0) {
      hasRequisites.value = true
      hasRequisitesExpanded.value = true
      organizationDto.value.requisites = organizationStore.editedOrganization.requisites
      organizationDto.value.requisites.sort((a, b) => a.isMain === true ? -1 : 1)
      requisitesCount.value = organizationDto.value.requisites.length
    } else {
      hasRequisites.value = false
      hasRequisitesExpanded.value = false
      addRequisites(true)
    }
  }
})

</script>

<style scoped>

</style>
