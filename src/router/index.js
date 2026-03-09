import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const routes = [
  {
    path: '/',
    name: 'Product',
    component: () => import('../views/ProductPage.vue'),
  },
  {
    path: '/demo',
    name: 'DemoLogin',
    component: () => import('../views/DemoLoginView.vue'),
  },
  {
    path: '/demo/dr/carlos-mendoza',
    name: 'PublicDoctor',
    component: () => import('../views/PublicDoctorPage.vue'),
  },
  {
    path: '/demo/dashboard',
    component: () => import('../components/layout/AppShell.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'Today',
        component: () => import('../views/dashboard/TodayView.vue'),
      },
      {
        path: 'calendario',
        name: 'Calendar',
        component: () => import('../views/dashboard/CalendarView.vue'),
      },
      {
        path: 'citas',
        name: 'Appointments',
        component: () => import('../views/dashboard/AppointmentsView.vue'),
      },
      {
        path: 'pacientes',
        name: 'Patients',
        component: () => import('../views/dashboard/PatientsView.vue'),
      },
      {
        path: 'pacientes/:id',
        name: 'PatientDetail',
        component: () => import('../views/dashboard/PatientDetailView.vue'),
      },
      {
        path: 'notas',
        name: 'ClinicalNotes',
        component: () => import('../views/dashboard/ClinicalNotesView.vue'),
      },
      {
        path: 'mensajes',
        name: 'Messages',
        component: () => import('../views/dashboard/MessagesView.vue'),
      },
      {
        path: 'analytics',
        name: 'Analytics',
        component: () => import('../views/dashboard/AnalyticsView.vue'),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to) {
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    return { top: 0 }
  },
})

router.beforeEach((to) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    const auth = useAuthStore()
    if (!auth.isLoggedIn) {
      return { path: '/demo' }
    }
  }
})

export default router
