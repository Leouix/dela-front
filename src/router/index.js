import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/Home.vue')
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('@/views/Dashboard.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/account',
    name: 'profile.edit',
    component: () => import('@/views/Account.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/mode',
    name: 'mode',
    component: () => import('@/views/Mode.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/mode/company',
    name: 'mode.company',
    component: () => import('@/views/ModeCompany.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/mode/candidate',
    name: 'mode.candidate',
    component: () => import('@/views/ModeCandidate.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/task-orders',
    name: 'taskOrders',
    component: () => import('@/views/TaskOrders.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/task-order/:slug',
    name: 'getTaskOrder',
    component: () => import('@/views/TaskOrder.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/top-up-balance',
    name: 'payments',
    component: () => import('@/views/Payments.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/balance',
    name: 'balance',
    component: () => import('@/views/Balance.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/withdraw',
    name: 'withdraw',
    component: () => import('@/views/Withdraw.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/my/specialist/profile',
    name: 'candidate.dashboard',
    component: () => import('@/views/candidate/Profile.vue'),
    meta: { requiresAuth: true, mode: 'candidate' }
  },
  {
    path: '/my/specialist/my-job-responses',
    name: 'myJobResponses',
    component: () => import('@/views/candidate/JobResponses.vue'),
    meta: { requiresAuth: true, mode: 'candidate' }
  },
  {
    path: '/my/specialist/my-task-responses',
    name: 'myTaskResponses',
    component: () => import('@/views/candidate/TaskResponses.vue'),
    meta: { requiresAuth: true, mode: 'candidate' }
  },
  {
    path: '/my/specialist/favorite-companies',
    name: 'favoriteCompanies',
    component: () => import('@/views/candidate/FavoriteCompanies.vue'),
    meta: { requiresAuth: true, mode: 'candidate' }
  },
  {
    path: '/my/specialist/favorite-vacancies',
    name: 'favoriteVacancies',
    component: () => import('@/views/candidate/FavoriteVacancies.vue'),
    meta: { requiresAuth: true, mode: 'candidate' }
  },
  {
    path: '/my/specialist/favorite-tasks',
    name: 'favoriteTasks',
    component: () => import('@/views/candidate/FavoriteTasks.vue'),
    meta: { requiresAuth: true, mode: 'candidate' }
  },
  {
    path: '/my/company/new-vacancy',
    name: 'newPostItem',
    component: () => import('@/views/company/NewVacancy.vue'),
    meta: { requiresAuth: true, mode: 'company' }
  },
  {
    path: '/my/company/new-task',
    name: 'newTask',
    component: () => import('@/views/company/NewTask.vue'),
    meta: { requiresAuth: true, mode: 'company' }
  },
  {
    path: '/my/company/edit-vacancy/:slug',
    name: 'editVacancy',
    component: () => import('@/views/company/EditVacancy.vue'),
    meta: { requiresAuth: true, mode: 'company' }
  },
  {
    path: '/my/company/edit-task/:slug',
    name: 'editTask',
    component: () => import('@/views/company/EditTask.vue'),
    meta: { requiresAuth: true, mode: 'company' }
  },
  {
    path: '/my/company/my-vacancies',
    name: 'myVacancies',
    component: () => import('@/views/company/MyVacancies.vue'),
    meta: { requiresAuth: true, mode: 'company' }
  },
  {
    path: '/my/company/my-tasks',
    name: 'myTasks',
    component: () => import('@/views/company/MyTasks.vue'),
    meta: { requiresAuth: true, mode: 'company' }
  },
  {
    path: '/my/company/profile',
    name: 'company.dashboard',
    component: () => import('@/views/company/Profile.vue'),
    meta: { requiresAuth: true, mode: 'company' }
  },
  {
    path: '/my/company/my-responses',
    name: 'myCompanyResponses',
    component: () => import('@/views/company/MyResponses.vue'),
    meta: { requiresAuth: true, mode: 'company' }
  },
  {
    path: '/my/company/overview/candidate/:slug',
    name: 'candidate.overview',
    component: () => import('@/views/company/OverviewCandidate.vue'),
    meta: { requiresAuth: true, mode: 'company' }
  },
  {
    path: '/my/company/favorite-candidates',
    name: 'favoriteCandidates',
    component: () => import('@/views/company/FavoriteCandidates.vue'),
    meta: { requiresAuth: true, mode: 'company' }
  },
  {
    path: '/overview/specialist/:slug',
    name: 'specialist.overview',
    component: () => import('@/views/OverviewSpecialist.vue')
  },
  {
    path: '/company/new-partner-vacancy',
    name: 'newPostItemPartner',
    component: () => import('@/views/company/NewPartnerVacancy.vue'),
    meta: { requiresAuth: true, mode: 'company' }
  },
  {
    path: '/company/edit-partner-vacancy/:id',
    name: 'editVacancyPartner',
    component: () => import('@/views/company/EditPartnerVacancy.vue'),
    meta: { requiresAuth: true, mode: 'company' }
  },
  {
    path: '/moderation-vacancies',
    name: 'moderationVacancies',
    component: () => import('@/views/admin/ModerationVacancies.vue'),
    meta: { requiresAuth: true, admin: true }
  },
  {
    path: '/moderation-tasks',
    name: 'moderationTasks',
    component: () => import('@/views/admin/ModerationTasks.vue'),
    meta: { requiresAuth: true, admin: true }
  },
  {
    path: '/withdraw-requests',
    name: 'withdrawRequests',
    component: () => import('@/views/admin/WithdrawRequests.vue'),
    meta: { requiresAuth: true, admin: true }
  },
  {
    path: '/administrator-page',
    name: 'adminPage',
    component: () => import('@/views/admin/AdminPage.vue'),
    meta: { requiresAuth: true, admin: true }
  },
  {
    path: '/overview/company-profile/:slug',
    name: 'company.overview',
    component: () => import('@/views/OverviewCompany.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/overview/vacancy/:slug',
    name: 'overviewVacancy',
    component: () => import('@/views/OverviewVacancy.vue')
  },
  {
    path: '/overview/task/:slug',
    name: 'overviewTask',
    component: () => import('@/views/OverviewTask.vue')
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('@/Pages/About.vue')
  },
  {
    path: '/how-to-pay',
    name: 'howToPay',
    component: () => import('@/views/HowToPay.vue')
  },
  {
    path: '/all-tasks',
    name: 'allTasks',
    component: () => import('@/views/AllTasks.vue')
  },
  {
    path: '/all-vacancies',
    name: 'allVacancies',
    component: () => import('@/views/AllVacancies.vue')
  },
  {
    path: '/rss',
    name: 'rss',
    component: () => import('@/views/Rss.vue')
  },
  {
    path: '/view-vacancy/:id',
    name: 'overviewPartnerVacancy',
    component: () => import('@/views/OverviewPartnerVacancy.vue')
  },
  {
    path: '/freelance-tgb/:slug',
    name: 'overviewFreelanceTG',
    component: () => import('@/views/OverviewFreelanceTG.vue')
  },
  {
    path: '/oferta',
    name: 'oferta',
    component: () => import('@/views/Oferta.vue')
  },
  {
    path: '/add-catalog',
    name: 'addCatalog',
    component: () => import('@/views/AddCatalog.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router