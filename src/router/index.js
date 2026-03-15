import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/Pages/Auth/Login.vue'),
    meta: { guest: true }
  },
  {
    path: '/',
    name: 'home',
    component: () => import('@/Pages/AllWithRss.vue')
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('@/Pages/Dashboard.vue'),
    meta: { requiresAuth: true, verified: true, mode: true }
  },
  {
    path: '/account',
    name: 'profile.edit',
    component: () => import('@/Pages/Profile/Edit.vue'),
    meta: { requiresAuth: true, verified: true, mode: true }
  },
  {
    path: '/mode',
    name: 'mode',
    component: () => import('@/Pages/Mode.vue'),
    meta: { requiresAuth: true, verified: true }
  },
  {
    path: '/mode/company',
    name: 'mode.company',
    component: () => import('@/Pages/Mode.vue'),
    meta: { requiresAuth: true, verified: true }
  },
  {
    path: '/mode/candidate',
    name: 'mode.candidate',
    component: () => import('@/Pages/Mode.vue'),
    meta: { requiresAuth: true, verified: true }
  },
  {
    path: '/task-orders',
    name: 'taskOrders',
    component: () => import('@/Pages/TaskOrder/TaskOrders.vue'),
    meta: { requiresAuth: true, verified: true }
  },
  {
    path: '/task-order/:slug',
    name: 'getTaskOrder',
    component: () => import('@/Pages/TaskOrder/TaskOrder.vue'),
    meta: { requiresAuth: true, verified: true }
  },
  {
    path: '/top-up-balance',
    name: 'payments',
    component: () => import('@/Pages/Payments/TopUpBalance.vue'),
    meta: { requiresAuth: true, verified: true }
  },
  {
    path: '/balance',
    name: 'balance',
    component: () => import('@/Pages/Payments/Balance.vue'),
    meta: { requiresAuth: true, verified: true }
  },
  {
    path: '/withdraw',
    name: 'withdraw',
    component: () => import('@/Pages/Payments/Withdraw.vue'),
    meta: { requiresAuth: true, verified: true }
  },
  {
    path: '/my/specialist/profile',
    name: 'candidate.dashboard',
    component: () => import('@/Pages/Candidate/UserCandidateProfile.vue'),
    meta: { requiresAuth: true, verified: true, mode: 'candidate' }
  },
  {
    path: '/my/specialist/my-job-responses',
    name: 'myJobResponses',
    component: () => import('@/Pages/Candidate/MyJobResponses.vue'),
    meta: { requiresAuth: true, verified: true, mode: 'candidate' }
  },
  {
    path: '/my/specialist/my-task-responses',
    name: 'myTaskResponses',
    component: () => import('@/Pages/Candidate/MyTaskResponses.vue'),
    meta: { requiresAuth: true, verified: true, mode: 'candidate' }
  },
  {
    path: '/my/specialist/favorite-companies',
    name: 'favoriteCompanies',
    component: () => import('@/Pages/Candidate/MyFavoriteCompanies.vue'),
    meta: { requiresAuth: true, verified: true, mode: 'candidate' }
  },
  {
    path: '/my/specialist/favorite-vacancies',
    name: 'favoriteVacancies',
    component: () => import('@/Pages/Candidate/MyFavoriteVacancies.vue'),
    meta: { requiresAuth: true, verified: true, mode: 'candidate' }
  },
  {
    path: '/my/specialist/favorite-tasks',
    name: 'favoriteTasks',
    component: () => import('@/Pages/Candidate/MyFavoriteTasks.vue'),
    meta: { requiresAuth: true, verified: true, mode: 'candidate' }
  },
  {
    path: '/my/company/new-vacancy',
    name: 'newPostItem',
    component: () => import('@/Pages/PostItems/Create.vue'),
    meta: { requiresAuth: true, verified: true, mode: 'company' }
  },
  {
    path: '/my/company/new-task',
    name: 'newTask',
    component: () => import('@/Pages/Tasks/Create.vue'),
    meta: { requiresAuth: true, verified: true, mode: 'company' }
  },
  {
    path: '/my/company/edit-vacancy/:slug',
    name: 'editVacancy',
    component: () => import('@/Pages/PostItems/Edit.vue'),
    meta: { requiresAuth: true, verified: true, mode: 'company' }
  },
  {
    path: '/my/company/edit-task/:slug',
    name: 'editTask',
    component: () => import('@/Pages/Tasks/Edit.vue'),
    meta: { requiresAuth: true, verified: true, mode: 'company' }
  },
  {
    path: '/my/company/my-vacancies',
    name: 'myVacancies',
    component: () => import('@/Pages/PostItems/MyPostItems.vue'),
    meta: { requiresAuth: true, verified: true, mode: 'company' }
  },
  {
    path: '/my/company/my-tasks',
    name: 'myTasks',
    component: () => import('@/Pages/Tasks/MyTasks.vue'),
    meta: { requiresAuth: true, verified: true, mode: 'company' }
  },
  {
    path: '/my/company/profile',
    name: 'company.dashboard',
    component: () => import('@/Pages/Company/CompanyProfile.vue'),
    meta: { requiresAuth: true, verified: true, mode: 'company' }
  },
  {
    path: '/my/company/my-responses',
    name: 'myCompanyResponses',
    component: () => import('@/Pages/Company/MyResponses.vue'),
    meta: { requiresAuth: true, verified: true, mode: 'company' }
  },
  {
    path: '/my/company/overview/candidate/:slug',
    name: 'candidate.overview',
    component: () => import('@/Pages/Candidate/OverviewCandidate.vue'),
    meta: { requiresAuth: true, verified: true, mode: 'company', modeAndMyselfCandidate: true }
  },
  {
    path: '/my/company/favorite-candidates',
    name: 'favoriteCandidates',
    component: () => import('@/Pages/Company/MyFavoriteCandidates.vue'),
    meta: { requiresAuth: true, verified: true, mode: 'company' }
  },
  {
    path: '/overview/specialist/:slug',
    name: 'specialist.overview',
    component: () => import('@/Pages/Candidate/OverviewCandidate.vue')
  },
  {
    path: '/company/new-partner-vacancy',
    name: 'newPostItemPartner',
    component: () => import('@/Pages/PostItems/CreatePartner.vue'),
    meta: { requiresAuth: true, verified: true, mode: 'company' }
  },
  {
    path: '/company/edit-partner-vacancy/:id',
    name: 'editVacancyPartner',
    component: () => import('@/Pages/PostItems/EditPartner.vue'),
    meta: { requiresAuth: true, verified: true, mode: 'company' }
  },
  {
    path: '/moderation-vacancies',
    name: 'moderationVacancies',
    component: () => import('@/Pages/PostItems/ModerationVacancies.vue'),
    meta: { requiresAuth: true, verified: true, admin: true }
  },
  {
    path: '/moderation-tasks',
    name: 'moderationTasks',
    component: () => import('@/Pages/Tasks/ModerationTasks.vue'),
    meta: { requiresAuth: true, verified: true, admin: true }
  },
  {
    path: '/withdraw-requests',
    name: 'withdrawRequests',
    component: () => import('@/Pages/Payments/WithdrawRequests.vue'),
    meta: { requiresAuth: true, verified: true, admin: true }
  },
  {
    path: '/administrator-page',
    name: 'adminPage',
    component: () => import('@/Pages/Admin/Index.vue'),
    meta: { requiresAuth: true, verified: true, admin: true }
  },
  {
    path: '/overview/company-profile/:slug',
    name: 'company.overview',
    component: () => import('@/Pages/Company/OverviewCompany.vue'),
    meta: { requiresAuth: true, verified: true }
  },
  {
    path: '/overview/vacancy/:slug',
    name: 'overviewVacancy',
    component: () => import('@/Pages/PostItems/Overview.vue'),
    meta: { vacIsModerated: true }
  },
  {
    path: '/overview/task/:slug',
    name: 'overviewTask',
    component: () => import('@/Pages/Tasks/Task.vue'),
    meta: { taskMiddleware: true }
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('@/Pages/About.vue')
  },
  {
    path: '/how-to-pay',
    name: 'howToPay',
    component: () => import('@/Pages/HowToPay.vue')
  },
  {
    path: '/all-tasks',
    name: 'allTasks',
    component: () => import('@/Pages/Tasks/AllTasks.vue')
  },
  {
    path: '/all-vacancies',
    name: 'allVacancies',
    component: () => import('@/Pages/PostItems/Overview.vue')
  },
  {
    path: '/rss',
    name: 'rss',
    component: () => import('@/Pages/Rss.vue')
  },
  {
    path: '/view-vacancy/:id',
    name: 'overviewPartnerVacancy',
    component: () => import('@/Pages/PostItems/OverviewPartnerVacancy.vue')
  },
  {
    path: '/freelance-tgb/:slug',
    name: 'overviewFreelanceTG',
    component: () => import('@/Pages/PostItems/PostFreelanceTG.vue')
  },
  {
    path: '/oferta',
    name: 'oferta',
    component: () => import('@/Pages/Oferta.vue')
  },
  {
    path: '/add-catalog',
    name: 'addCatalog',
    component: () => import('@/Pages/AddCatalog.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isAuth) {
    return next({ name: 'login' })
  }

  if (to.meta.guest && authStore.isAuth) {
    return next({ name: 'dashboard' })
  }

  if (to.meta.verified && !authStore.isVerified) {
    return next({ name: 'home' })
  }

  if (to.meta.mode === true && !authStore.userMode) {
    return next({ name: 'mode' })
  }

  if (to.meta.mode === 'candidate' && authStore.userMode !== 'candidate') {
    return next({ name: 'mode' })
  }

  if (to.meta.mode === 'company' && authStore.userMode !== 'company') {
    return next({ name: 'mode' })
  }

  if (to.meta.admin && !authStore.isAdmin) {
    return next({ name: 'home' })
  }

  return next()
})

export default router
