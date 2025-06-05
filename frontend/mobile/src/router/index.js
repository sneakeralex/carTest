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
        path: 'test-sites',
        name: 'TestSites',
        component: () => import('../views/TestSites.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'test-sites/:id',
        name: 'TestSiteDetail',
        component: () => import('../views/TestSiteDetail.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'test-tasks',
        name: 'TestTasks',
        component: () => import('../views/TestTasks.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'test-tasks/:id',
        name: 'TestTaskDetail',
        component: () => import('../views/TestTaskDetail.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'bookings',
        name: 'Bookings',
        component: () => import('../views/Bookings.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'bookings/new',
        name: 'NewBooking',
        component: () => import('../views/NewBooking.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'bookings/:id',
        name: 'BookingDetail',
        component: () => import('../views/BookingDetail.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'appointments',
        name: 'TestConsultationAppointments',
        component: () => import('../views/Appointments.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'appointments/new',
        name: 'NewTestConsultationAppointment',
        component: () => import('../views/NewAppointment.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'appointments/:id',
        name: 'TestConsultationAppointmentDetail',
        component: () => import('../views/AppointmentDetail.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'my-registrations',
        name: 'MyTestRegistrations',
        component: () => import('../views/MyTestRegistrations.vue'),
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