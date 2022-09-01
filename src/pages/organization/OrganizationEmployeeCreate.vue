<template>
  <q-page class="q-pa-md col q-gutter-md" style="max-width: 700px; min-height: 1200px">
    <div class="text-h4">Новый сотрудник</div>

    <div class="row q-gutter-sm">
      <q-btn-toggle
        v-model="personCreationType"
        toggle-color="primary"
        :options="personCreationTypesForOrganization"></q-btn-toggle>
      <q-select
        v-if="personCreationType === 'FromOwner'"
        v-model="currentLand"
        use-input
        hide-selected
        fill-input
        input-debounce="300"
        label="Участок"
        :options="landListOptions"
        @filter="getLands"
        @filter-abort="getLandsAbort"
        style="width: 150px">
      </q-select>
      <q-select
        v-if="personCreationType === 'FromOwner'"
        v-model="currentOwner"
        use-input
        hide-selected
        fill-input
        input-debounce="300"
        label="Лицо на участке"
        :options="ownerListOptions"
        @filter="getOwners"
        @filter-abort="getOwnersAbort"
        style="width: 150px">
      </q-select>
    </div>
    <div class="row q-gutter-md" style="width: 500px">
      <div class="col q-gutter-xs">
        <q-input outlined v-model="lastName" label="Фамилия"/>
        <q-input outlined v-model="firstName" label="Имя"/>
        <q-input outlined v-model="middleName" label="Отчество"/>
      </div>
      <div class="col q-gutter-xs">
        <q-select outlined v-model="personGroup" :options="personGroups" label="Входит в группу"></q-select>
        <q-input outlined v-model="position" label="Должность"/>
      </div>
    </div>
    <!--    ДОСТУПЫ-->
    <div class="col">
      <div class="text-weight-bold">
        Доступы
      </div>
      <div class="text-weight-bold">
        TODO
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
import { getPersonCreationTypeForOrganization } from "composition/options/getPersonCreationTypeForOrganization";
import { useLandStore } from "stores/landStore";

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

const position = ref()

const personGroups = computed(() => {
  let filteredPersonGroups = personStore.personGroups;
  filteredPersonGroups = filteredPersonGroups.filter(q => q.forOrganization)
  return useCreateOptions(filteredPersonGroups);
})

const personCreationTypesForOrganization = getPersonCreationTypeForOrganization();
const personCreationType = ref(personCreationTypesForOrganization[0].value);

const landListOptions = ref([])
const currentLand = ref(null)

const ownerListOptions = ref([])
const currentOwner = ref(null)

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
  dto.passportDetails = personStore.person.passportDetails
  dto.jobs = personStore.person.jobs
  if(personStore.person.jobs) {
    dto.jobs.push({
      organizationId: route.params.id,
      position: position.value,
      personGroupId: toRaw(personGroup.value).id,
    })
  } else {
    dto.jobs = [
      {
        organizationId: route.params.id,
        position: position.value,
        personGroupId: toRaw(personGroup.value).id,
      }
    ]
  }

  dto.contacts = [...toRaw(phoneNumbers.value), ...toRaw(emails.value)]

  await personStore.createEntity(dto)

  await router.push(`/organizationList/${route.params.id}`)
}

async function getLands(val, update, abort) {
  let params = "";
  if(val !== "") params = [params, `searchTerm=${val}`].join('&')
  params = [params, `fields=id,fullname`].join('&')
  await landStore.fetchLands(params);
  console.log(params)
  update(() => {
    landListOptions.value = useCreateOptions(landStore.lands, 'fullName');
  })
}
function getLandsAbort() {}

async function getOwners(val, update, abort) {
  if(currentLand.value && currentLand.value !== 'undefined') {
    let params = "";
    if(val !== "") params = [params, `searchTerm=${val}`].join('&')

    await landStore.fetchOwners(currentLand.value.id, params);
    update(() => {
      const owners = landStore.owners.map(function(item) {
        item.name = `${item.lastName} ${item.firstName} ${item.middleName}`
        return item;
      })
      ownerListOptions.value = useCreateOptions(owners, 'name');
    })
  } else {
    abort()
  }
}

function getOwnersAbort() {}

watch(currentOwner, async(owner) => {

  if(!owner) return

  await personStore.fetchPerson(owner.id);

  personId.value = personStore.person.id
  firstName.value = personStore.person.firstName
  middleName.value = personStore.person.middleName
  lastName.value = personStore.person.lastName

  if(personStore.person.contacts)
  {
    phoneNumbers.value = []
    const ownerPhoneNumbers = personStore.person.contacts.filter(q => q.contactType === 'PhoneNumber');
    for(let i = 0; i < ownerPhoneNumbers.length; i++) {
      if(i > 0) {
        addPhoneNumber();
      }
      phoneNumbers.value[i] = ownerPhoneNumbers[i]
    }
    emails.value = []
    const ownerEmails = personStore.person.contacts.filter(q => q.contactType === 'Email');
    console.log(ownerEmails)
    for(let i = 0; i < ownerEmails.length; i++) {
      if(i > 0) {
        addEmail();
      }
      emails.value[i] = ownerEmails[i]
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

    currentOwner.value = null
    currentLand.value = null;
  }
})


onMounted( async () => {
  await personStore.fetchPersonGroups()
  // await organizationStore.fetchOrganizations()
})


</script>

<style scoped>

</style>
