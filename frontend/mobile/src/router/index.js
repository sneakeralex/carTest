import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/',
    component: () => import('../components/Layout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('../views/Home.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'vehicles',
        name: 'Vehicles',
        component: () => import('../views/Vehicles.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'vehicles/:id',
        name: 'VehicleDetail',
        component: () => import('../views/VehicleDetail.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'appointments',
        name: 'Appointments',
        component: () => import('../views/Appointments.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'appointments/new',
        name: 'NewAppointment',
        component: () => import('../views/NewAppointment.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'appointments/:id',
        name: 'AppointmentDetail',
        component: () => import('../views/AppointmentDetail.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'maintenance',
        name: 'Maintenance',
        component: () => import('../views/Maintenance.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'maintenance/new',
        name: 'NewMaintenance',
        component: () => import('../views/NewMaintenance.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'maintenance/:id',
        name: 'MaintenanceDetail',
        component: () => import('../views/MaintenanceDetail.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'profile',
        name: 'Profile',
        component: () => import('../views/Profile.vue'),
        meta: { requiresAuth: true }
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFound.vue')
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  if (requiresAuth && !token) {
    next('/login');
  } else if (to.path === '/login' && token) {
    next('/');
  } else {
    next();
  }
});

export default router;