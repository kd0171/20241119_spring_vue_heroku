import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../views/HomePage.vue';
import LoginPage from '../views/LoginPage.vue';
import AdminPage from '../views/AdminPage.vue';
import DashboardPage from '../views/DashboardPage.vue';
import UserPage from '../views/UserPage.vue';

const routes = [
  { path: '/', component: HomePage },
  { path: '/login', component: LoginPage },
  { path: '/admin', component: AdminPage, meta: { requiresAuth: true, role: 'ROLE_ADMIN' } },
  { path: '/dashboard', component: DashboardPage, meta: { requiresAuth: true, role: 'ROLE_ADMIN' } },  // 修正
  { path: '/user', component: UserPage, meta: { requiresAuth: true, role: 'ROLE_USER' } },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// グローバルナビゲーションガード
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('accessToken');
  const userRole = localStorage.getItem('userRole');
  
  // ルートが認証を必要とする場合
  if (to.meta.requiresAuth) {
    if (!token) {
      // ログインしていない場合、ログインページにリダイレクト
      next('/login');
    } else if (to.meta.role && to.meta.role !== userRole) {
      // ユーザーが適切なロールでない場合、アクセスを拒否
      next('/'); // ホームページなどにリダイレクト
    } else {
      // アクセスが許可された場合、次のルートへ
      next();
    }
  } else {
    next(); // 認証が不要なページにはそのまま進む
  }
});

export default router;
