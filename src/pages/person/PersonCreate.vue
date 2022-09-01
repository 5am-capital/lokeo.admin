<template>
  <q-page class="q-pa-md col q-gutter-md" style="max-width: 700px; min-height: 1200px">
    <div class="text-h4">Новое лицо</div>
    <div>
      <q-btn-toggle
        v-model="personType"
        toggle-color="primary"
        :options="personTypeOptions"></q-btn-toggle>
    </div>

    <div class="row q-gutter-md" style="width: 500px">
      <div class="col q-gutter-xs">
        <q-input :disable="unknownPerson" outlined v-model="lastName" label="Фамилия"/>
        <q-input :disable="unknownPerson" outlined v-model="firstName" label="Имя"/>
        <q-input :disable="unknownPerson" outlined v-model="middleName" label="Отчество"/>
      </div>
      <div class="col q-gutter-xs">
        <q-select outlined v-model="personGroup" :options="personGroups" label="Входит в группу"></q-select>
        <q-input v-if="personType === 'Employee'" outlined v-model="position" label="Должность"/>
        <q-select v-if="personType === 'Employee'" outlined v-model="organization" :options="organizations" label="Ваша организация"></q-select>
      </div>
    </div>
    <div v-if="personType === 'Owner'">
      <q-toggle v-model="unknownPerson" label="Данные лица неизвестны"/>
      <div class="text-subtitle2">Если вам не известны данные лица, мы можем создать поисковой пропуск, он позволит узнать их и использовать в дальнейшем.</div>

    </div>
    <!--    ДОСТУПЫ-->
    <div class="col" v-if="personType === 'Employee'">
      <div class="text-weight-bold">
        Доступы
      </div>
      <div class="text-weight-bold">
        TODO
      </div>
    </div>

<!--    ДОБАВИТЬ К ВЛАДЕНИЮ-->
    <div v-if="personType === 'Owner'" class="col q-gutter-md fa-border">
      <div class="text-weight-bold">
        Добавить к владению
      </div>
      <div class="col q-gutter-sm" style="width: 250px">
        <q-select outlined v-model="village" :options="villages" label="Посёлок"></q-select>
        <q-select outlined v-model="ownershipGroup" :options="ownershipGroups" label="Участок"></q-select>

        <div>Владение: {{ownershipGroup ? ownershipGroup.ownershipName : ""}}</div>
      </div>

    </div>





<!--    КОНТРАГЕНТ-->
    <div v-if="personType === 'Owner'" class="col q-gutter-md fa-border">
      <q-toggle :disable="unknownPerson" v-model="passportActive" label="Контрагент"/>
      <div v-if="passportActive && !unknownPerson">
        <div class="row q-gutter-xs">
          <div class="col">
            <q-input outlined
                     v-model="passportSeries"
                     label="Серия"
                     mask="## ##"
            />
          </div>
          <div class="col">
            <q-input outlined
                     v-model="passportNumber"
                     label="Номер"
                     mask="#####"
            />
          </div>
          <div class="col">
            <q-input outlined
                     v-model="passportDepartmentCode"
                     label="Код подразделения"
                     mask="###-###"
            />
          </div>
        </div>
        <div class="row items-stretch q-gutter-xs">
          <div class="col">
            <q-input outlined
                     v-model="passportBirthDate"
                     label="Дата рождения"
                     type="date"
            />
          </div>
          <div class="col">
            <q-input outlined
                     v-model="passportIssuer"
                     label="Кем выдан"/>
          </div>

        </div>
        <div class="row q-gutter-xs">
          <div class="col">
            <q-input outlined
                     v-model="passportIssueDate"
                     label="Дата выдачи"
                     type="date"
            />
          </div>
          <div class="col">
            <q-select outlined
                      v-model="passportSex"
                      :options="personSexes"
                      label="Пол"></q-select>
          </div>
        </div>
        <div class="row q-gutter-xs">
          <div class="col">
            <q-input outlined v-model="passportBirthPlace" label="Место рождения"/>
          </div>
          <div class="col">
            <q-input outlined v-model="passportRegistrationAddress" label="Адрес регистрации"/>
          </div>
        </div>
      </div>
    </div>
<!--    КОНТАКТЫ-->
    <div>
      <div class="text-weight-bold">Контакты</div>
      <div class="row">
        <div class="col q-gutter-sm">
          <div class="row" v-for="(item, index) in phoneNumbers" :key="item.id">
            <q-input outlined
                     v-model="phoneNumbers[index].value"
                     label="Номер телефона"
                     mask="# (###) ### ####"/>
            <q-checkbox v-model="phoneNumbers[index].isMain" label="Основной" @update:model-value="(input, evt) => changeMainPhoneNumber(index, input)"></q-checkbox>
          </div>
          <q-btn color="primary" icon="add" @click="addPhoneNumber"></q-btn>
        </div>
        <div class="col q-gutter-sm">
          <div class="row" v-for="(item, index) in emails" :key="item.id">
            <q-input outlined
                     v-model="emails[index].value"
                     label="Почта"/>
            <q-checkbox v-model="emails[index].isMain" label="Основной" @update:model-value="(input, evt) => changeMainEmail(index, input)"></q-checkbox>
          </div>
          <q-btn color="primary" icon="add" @click="addEmail"></q-btn>
        </div>
      </div>
    </div>

    <q-btn color="primary" icon="add" @click="createPerson" label="Создать лицо"></q-btn>

  </q-page>
</template>

<script setup>

import { computed, onMounted, ref, toRaw, watch } from "vue";
import { getPersonTypeOptions } from "composition/options/getPersonTypeOptions";
import { usePersonStore } from "stores/personStore";
import { useCreateOptions } from "composition/options/createOptions";
import { getPersonSex } from "composition/options/getPersonSex";
import { useOrganizationStore } from "stores/organizationStore";
import { useVillageStore } from "stores/villageStore";
import { useRouter } from "vue-router/dist/vue-router";

const router = useRouter()

const personStore = usePersonStore()
const organizationStore = useOrganizationStore()
const villageStore = useVillageStore()

const personTypeOptions = getPersonTypeOptions()
const personType = ref(personTypeOptions[0].value)
const personSexes = getPersonSex()


const firstName = ref(null)
const middleName = ref(null)
const lastName = ref(null)
const personGroup = ref(null)
const unknownPerson = ref(false)

const position = ref()
const organization = ref()

const organizations = computed(() => {
  return organizationStore.organizations.map(function(item) {
    item.label = item.name;
    return item;
  })
})


const village = ref()
const villages = computed(() => {
  return villageStore.entities.map(function(item) {
    item.label = item.name;
    return item;
  })
})

const ownershipGroup = ref()
const ownershipGroups = computed(() => {
  return villageStore.ownershipGroups.map(function(item) {
    item.label = item.landName;
    return item;
  })
})

const passportActive = ref(true)
const passportSeries = ref()
const passportNumber = ref()
const passportDepartmentCode = ref()
const passportBirthDate = ref()
const passportIssuer = ref()
const passportIssueDate = ref()
const passportSex = ref()
const passportBirthPlace = ref()
const passportRegistrationAddress = ref()

const personGroups = computed(() => {
  let filteredPersonGroups = personStore.personGroups;
  if(personType.value === 'Owner') {
    filteredPersonGroups = filteredPersonGroups.filter(q => q.forOwner)
  }
  else if(personType.value === 'Employee') {
    filteredPersonGroups = filteredPersonGroups.filter(q => q.forOrganization)
  }
  return useCreateOptions(filteredPersonGroups);
})


const phoneNumbers = ref([])
addPhoneNumber()

const emails = ref([])
addEmail()

function addPhoneNumber() {
  phoneNumbers.value.push({
    id: phoneNumbers.value.length + 1,
    value: "",
    isMain: false,
    contactType: 'PhoneNumber'
  })
}
function addEmail() {
  emails.value.push({
    id: emails.value.length + 1,
    value: "",
    isMain: false,
    contactType: 'Email'
  })
}

function changeMainPhoneNumber(index, input) {
  if(input) {
    for(let i = 0; i < phoneNumbers.value.length; i++) {
      if(i === index) continue;
      phoneNumbers.value[i].isMain = false
    }
  }
}

function changeMainEmail(index, input) {
  if(input) {
    for(let i = 0; i < emails.value.length; i++) {
      if(i === index) continue;
      emails.value[i].isMain = false
    }
  }
}

async function createPerson() {
  let dto = {
    personType: personType.value,
    firstName: firstName.value,
    middleName: middleName.value,
    lastName: lastName.value,

  }

  if(personType.value === 'Owner')
  {
    dto.unknownPerson = unknownPerson.value
  }

  if(passportActive.value && personType.value === 'Owner') {
    dto.passportDetails = {
      series: passportSeries.value,
      number: passportNumber.value,
      departmentCode: passportDepartmentCode.value,
      birthDate: passportBirthDate.value,
      issuer: passportIssuer.value,
      issueDate: passportIssueDate.value,
      sex: passportSex.value.value,
      birthPlace: passportBirthPlace.value,
      registrationAddress: passportRegistrationAddress.value,
    }
  }

  if(personType.value === 'Employee') {
    dto.jobs = [
      {
        organizationId: toRaw(organization.value).id,
        position: position.value,
        personGroupId: toRaw(personGroup.value).id,
      }
    ]
  }

  if(personType.value === 'Owner') {
    dto.owner = {
      ownerships: [
        toRaw(ownershipGroup.value)
      ],
      personGroupId: toRaw(personGroup.value).id,
    }
  }

  dto.contacts = [...toRaw(phoneNumbers.value), ...toRaw(emails.value)]

  console.log(dto)
  await personStore.createEntity(dto)

  router.push('personList')
}

watch(village, async (current) => {
  if(current != null) {

    await villageStore.fetchVillageOwnershipGroups(current.id)
  }
})


onMounted( async () => {
  await personStore.fetchPersonGroups()
  await organizationStore.fetchOrganizations()
  await villageStore.fetchEntities()
})


</script>

<style scoped>

</style>
