<template>
  <q-page class="q-pa-md col q-gutter-md" style="max-width: 700px; min-height: 1200px">
    <div class="text-h4">Новое лицо</div>

    <div class="row q-gutter-sm">
      <q-btn-toggle
        v-model="personCreationType"
        toggle-color="primary"
        :options="personCreationTypesForOwnership"></q-btn-toggle>
      <q-select
        v-if="personCreationType === 'FromOrganization'"
        v-model="currentOrganization"
        use-input
        hide-selected
        fill-input
        input-debounce="300"
        label="Организация"
        :options="organizationListOptions"
        @filter="getOrganizations"
        @filter-abort="getOrganizationsAbort"
        style="width: 150px">
      </q-select>
      <q-select
        v-if="personCreationType === 'FromOrganization'"
        v-model="currentEmployee"
        use-input
        hide-selected
        fill-input
        input-debounce="300"
        label="Лицо в организации"
        :options="employeeListOptions"
        @filter="getEmployees"
        @filter-abort="getEmployeesAbort"
        style="width: 150px">
      </q-select>
    </div>
    <div class="row q-gutter-md" style="width: 500px">
      <div class="col q-gutter-xs">
        <q-input :disable="unknownPerson" outlined v-model="lastName" label="Фамилия"/>
        <q-input :disable="unknownPerson" outlined v-model="firstName" label="Имя"/>
        <q-input :disable="unknownPerson" outlined v-model="middleName" label="Отчество"/>
      </div>
      <div class="col q-gutter-xs">
        <q-select outlined v-model="personGroup" :options="personGroups" label="Входит в группу"></q-select>
      </div>
    </div>
    <div v-if="personCreationType === 'NewPerson'">
      <q-toggle v-model="unknownPerson" label="Данные лица неизвестны"/>
      <div class="text-subtitle2">Если вам не известны данные лица, мы можем создать поисковой пропуск, он позволит узнать их и использовать в дальнейшем.</div>
    </div>
    <!--    КОНТРАГЕНТ-->
    <div class="col q-gutter-md fa-border">
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
import { usePersonStore } from "stores/personStore";
import { useCreateOptions } from "composition/options/createOptions";
import { useOrganizationStore } from "stores/organizationStore";
import { useVillageStore } from "stores/villageStore";
import { useRoute, useRouter } from "vue-router/dist/vue-router";
import { getPersonCreationTypeForOwnership } from "composition/options/getPersonCreationTypeForOwnership";
import { useLandStore } from "stores/landStore";
import { getPersonSex } from "composition/options/getPersonSex";

const router = useRouter()
const route = useRoute()

const personStore = usePersonStore()
const organizationStore = useOrganizationStore()
const landStore = useLandStore()

const personId = ref(null);
const firstName = ref(null)
const middleName = ref(null)
const lastName = ref(null)
const personGroup = ref(null)
const unknownPerson = ref(false)

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

const personSexes = getPersonSex()


const personGroups = computed(() => {
  let filteredPersonGroups = personStore.personGroups;
  filteredPersonGroups = filteredPersonGroups.filter(q => q.forOwner)
  return useCreateOptions(filteredPersonGroups);
})

const personCreationTypesForOwnership = getPersonCreationTypeForOwnership();
const personCreationType = ref(personCreationTypesForOwnership[0].value);

const organizationListOptions = ref([])
const currentOrganization = ref(null)

const employeeListOptions = ref([])
const currentEmployee = ref(null)

const phoneNumbers = ref([])
addPhoneNumber()

const emails = ref([])
addEmail()

function addPhoneNumber() {
  phoneNumbers.value.push({
    index: phoneNumbers.value.length + 1,
    value: "",
    isMain: false,
    contactType: 'PhoneNumber'
  })
}
function addEmail() {
  emails.value.push({
    index: emails.value.length + 1,
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
    id: personId.value,
    firstName: firstName.value,
    middleName: middleName.value,
    lastName: lastName.value,

  }
  dto.owner = personStore.person.owner

  if(personStore.person.owner) {
    dto.owner.ownerships.push({
      ownershipGroupId: landStore.land.activeOwnershipId,
    })
  } else {
    dto.owner = {
      ownerships: [
        {
          ownershipGroupId: landStore.land.activeOwnershipId,
        },
      ],
      personGroupId: toRaw(personGroup.value).id,
    }
  }
  if(passportActive.value)
  {
    if(personStore.person.passportDetails) {
      dto.passportDetails = {
        ...personStore.person.passportDetails,
        series: passportSeries.value, number: passportNumber.value,
        departmentCode: passportDepartmentCode.value,
        birthDate: passportBirthDate.value,
        issuer: passportIssuer.value,
        issueDate: passportIssueDate.value,
        sex: passportSex.value.value,
        birthPlace: passportBirthPlace.value,
        registrationAddress: passportRegistrationAddress.value,
      }
    }
    else {
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
  }
  console.log(landStore.land)
  dto.contacts = [...toRaw(phoneNumbers.value), ...toRaw(emails.value)]

  console.log(dto)
  await personStore.createEntity(dto)
  await router.push(`/villageList/${route.params.id}/lands/${route.params.landId}`)
}

async function getOrganizations(val, update, abort) {
  let params = "";
  if(val !== "") params = [params, `searchTerm=${val}`].join('&')
  await organizationStore.fetchOrganizations(params);

  update(() => {
    organizationListOptions.value = useCreateOptions(organizationStore.organizations, 'name');
  })
}
function getOrganizationsAbort() {}

async function getEmployees(val, update, abort) {
  if(currentOrganization.value && currentOrganization.value !== 'undefined') {
    let params = "";
    if(val !== "") params = [params, `searchTerm=${val}`].join('&')

    await organizationStore.fetchEmployees(currentOrganization.value.id, params);
    update(() => {
      const employees = organizationStore.employees.map(function(item) {
        item.name = `${item.lastName} ${item.firstName} ${item.middleName}`
        return item;
      })
      employeeListOptions.value = useCreateOptions(employees, 'name');
    })
  } else {
    abort()
  }
}

function getEmployeesAbort() {}

watch(currentEmployee, async(employee) => {

  if(!employee) return

  await personStore.fetchPerson(employee.id);

  personId.value = personStore.person.id
  firstName.value = personStore.person.firstName
  middleName.value = personStore.person.middleName
  lastName.value = personStore.person.lastName

  if(personStore.person.passportDetails) {
      passportSeries.value = personStore.person.passportDetails.series
      passportNumber.value = personStore.person.passportDetails.number
      passportDepartmentCode.value = personStore.person.passportDetails.departmentCode
      passportBirthDate.value = personStore.person.passportDetails.birthDate
      passportIssuer.value = personStore.person.passportDetails.issuer
      passportIssueDate.value = personStore.person.passportDetails.issueDate
      passportSex.value.value = personStore.person.passportDetails.sex
      passportBirthPlace.value = personStore.person.passportDetails.birthPlace
      passportRegistrationAddress.value = personStore.person.passportDetails.registrationAddress
  }

  if(personStore.person.contacts)
  {
    phoneNumbers.value = []
    const employeePhoneNumbers = personStore.person.contacts.filter(q => q.contactType === 'PhoneNumber');
    for(let i = 0; i < employeePhoneNumbers.length; i++) {
      if(i > 0) {
        addPhoneNumber();
      }
      phoneNumbers.value[i] = employeePhoneNumbers[i]
    }
    emails.value = []
    const employeeEmails = personStore.person.contacts.filter(q => q.contactType === 'Email');
    for(let i = 0; i < employeeEmails.length; i++) {
      if(i > 0) {
        addEmail();
      }
      emails.value[i] = employeeEmails[i]
    }
  }
})

watch(personCreationType, (cur) => {
  if(cur === 'NewPerson') {
    personId.value = null
    firstName.value = null
    middleName.value = null
    lastName.value = null

    phoneNumbers.value = []
    addPhoneNumber()
    emails.value = []
    addEmail()

    currentEmployee.value = null
    currentOrganization.value = null;
  }
})


onMounted( async () => {
  await personStore.fetchPersonGroups()
  await landStore.fetchLand(route.params.landId)
})


</script>

<style scoped>

</style>
