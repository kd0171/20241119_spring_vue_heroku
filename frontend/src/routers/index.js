import { createRouter, createWebHistory } from "vue-router";
import HomePage from "../views/HomePage.vue";
import LoginPage from "../views/LoginPage.vue";
import AdminPage from "../views/AdminPage.vue";
import DashboardPage from "../views/DashboardPage.vue";
import UserPage from "../views/UserPage.vue";
import DashBoardUserCreate from "../views/DashBoardUserCreate.vue"; // 新規追加
import DashBoardUserEdit from "../views/DashBoardUserEdit.vue"; // 新規追加

const routes = [
  { path: "/", component: HomePage },
  { path: "/login", component: LoginPage },
  { path: "/admin", component: AdminPage, meta: { requiresAuth: true, role: "ROLE_ADMIN" } },
  { path: "/dashboard", component: DashboardPage, meta: { requiresAuth: true, role: "ROLE_ADMIN" } },
  { path: "/user", component: UserPage, meta: { requiresAuth: true, role: "ROLE_USER" } },
  { path: "/dashboard/user-create", component: DashBoardUserCreate, meta: { requiresAuth: true, role: "ROLE_ADMIN" } }, // 新しいルート
  { path: "/dashboard/user-edit/:id", component: DashBoardUserEdit, meta: { requiresAuth: true, role: "ROLE_ADMIN" } }, // 新しいルート
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// グローバルナビゲーションガード
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("accessToken");
  const userRole = localStorage.getItem("userRole");

  if (to.meta.requiresAuth) {
    if (!token) {
      next("/login");
    } else if (to.meta.role && to.meta.role !== userRole) {
      next("/");
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
