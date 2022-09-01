
const routes = [
  {
    path: "/",
    component: () => import('layouts/MainLayout.vue'),

    children: [
      {
        path: 'login',
        component: () => import('pages/auth/PageAuth.vue')
      },
      {
        path: 'productList',
        component: () => import('pages/products/ProductListPage.vue'),
      },
      {
        path: 'productCreate',
        component: () => import('pages/products/ProductCreate.vue'),
      },
      {
        path: 'organizationList',
        component: () => import('pages/organization/OrganizationListPage.vue'),
      },
      {
        path: 'organizationCreate',
        component: () => import('pages/organization/OrganizationCreate.vue'),
      },
      {
        path: 'organizationList/:id/employeeCreate',
        component: () => import('pages/organization/OrganizationEmployeeCreate.vue'),
      },
      {
        path: 'organizationList/:id',
        component: () => import('pages/organization/OrganizationCard.vue'),
      },
      {
        path: 'villageList',
        component: () => import('pages/village/VillageList.vue'),
      },
      {
        path: 'villageCreate',
        component: () => import('pages/village/VillageCreate.vue'),
      },
      {
        path: 'villageList/:id',
        component: () => import('pages/village/VillageCard.vue'),
      },
      {
        path: 'villageList/:id/lands/:landId',
        component: () => import('pages/village/VillageLandCard.vue'),
      },
      {
        path: 'villageList/:id/lands/:landId/ownerCreate',
        component: () => import('pages/village/VillageLandOwnerCreate.vue'),
      },
      {
        path: 'contractTemplateList',
        component: () => import('pages/contractTemplate/ContractTemplateList.vue'),
      },
      {
        path: 'contractTemplateCreate',
        component: () => import('pages/contractTemplate/ContractTemplateCreate.vue'),
      },
      {
        path: 'contractTemplateList/:id',
        component: () => import('pages/contractTemplate/ContractTemplateEdit.vue'),
      },
      {
        path: 'contractTemplateList/:id/product/:productId',
        component: () => import('pages/contractTemplate/ContractTemplateAddFinancialSettings.vue'),
      },
      {
        path: 'contractTemplateCreate/:id/update',
        component: () => import('pages/contractTemplate/ContractTemplateEditFinancialSettings.vue'),
      },
      {
        path: 'personList',
        component: () => import('pages/person/PersonList.vue'),
      },
      {
        path: 'personCreate',
        component: () => import('pages/person/PersonCreate.vue'),
      },

      {
        path: 'home',
        component: () => import('pages/IndexPage.vue')
      },
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  // {
  //   path: '/:catchAll(.*)*',
  //   component: () => import('pages/ErrorNotFound.vue')
  // }
]

export default routes
