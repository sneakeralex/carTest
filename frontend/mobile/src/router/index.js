import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: { requiresAuth: false }
  },
  { path: '/register', 
    name: 'Register',
    component: () => import('../views/Register.vue'),
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
        path: 'test-tasks/new',
        name: 'NewTestTask',
        component: () => import('../views/NewTestTask.vue'),
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
      // 设备领用相关路由
      {
        path: 'equipment/applications',
        name: 'EquipmentApplications',
        component: () => import('../views/EquipmentApplications.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'equipment/ledger',
        name: 'EquipmentLedger',
        component: () => import('../views/EquipmentLedger.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'equipment/apply',
        name: 'EquipmentApply',
        component: () => import('../views/EquipmentApply.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'equipment/application/:id',
        name: 'EquipmentApplicationDetail',
        component: () => import('../views/EquipmentApplicationDetail.vue'),
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
      },
      {
        path: 'staff',
        name: 'StaffManagement',
        component: () => import('../views/StaffManagement.vue'),
        meta: { 
          requiresAuth: true,
          requiresAdmin: true
        }
      },
      {
        path: 'staff/:id',
        name: 'StaffDetail',
        component: () => import('../views/StaffDetail.vue'),
        meta: { 
          requiresAuth: true,
          requiresAdmin: true
        }
      },
      {
        path: 'contracts',
        name: 'Contracts',
        component: () => import('../views/Contracts.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'contracts/:id',
        name: 'ContractDetail',
        component: () => import('../views/ContractDetail.vue'),
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
        path: 'equipment/applications',
        name: 'EquipmentApplications',
        component: () => import('../views/EquipmentApplications.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'equipment/apply',
        name: 'EquipmentApply',
        component: () => import('../views/EquipmentApply.vue'),
        meta: { requiresAuth: true }
      },
      // 通知消息相关路由
      {
        path: 'notifications',
        name: 'NotificationList',
        component: () => import('../views/NotificationList.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'notifications/:id',
        name: 'NotificationDetail',
        component: () => import('../views/NotificationDetail.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'profile/notifications',
        name: 'NotificationSettings',
        component: () => import('../views/NotificationSettings.vue'),
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
  history: createWebHistory('/cartest/'),
  routes
});

// 路由导航守卫
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  // 检查是否需要登录
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!token) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      });
      return;
    }

    // 检查是否需要管理员权限
    if (to.matched.some(record => record.meta.requiresAdmin)) {
      if (user?.role !== 'ADMIN') {
        next({ path: '/' });
        return;
      }
    }
  }

  next();
});

export default router;