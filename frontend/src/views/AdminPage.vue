<template>
  <div>
    <h2>I am Admin</h2>

    <!-- 画面上にuserRoleを表示 -->
    <p>User Role: {{ userRole }}</p>

    <div v-if="isAdmin">
      <!-- 管理者専用のコンテンツをここに記述 -->
      <p>Welcome to the admin dashboard!</p>
    </div>
    <div v-else>
      <h2>Access Denied</h2>
      <p>You do not have permission to view this page.</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isAdmin: false, // 初期状態では管理者でないと仮定
      userRole: '',   // userRoleをデータに格納
    };
  },
  mounted() {
    // コンポーネントがマウントされた時にlocalStorageからuserRoleを取得
    const role = localStorage.getItem('userRole');
    this.userRole = role; // 取得したuserRoleをデータに格納

    // 管理者の場合のみコンテンツを表示
    if (role === 'ROLE_ADMIN') {
      this.isAdmin = true;
    }
  }
};
</script>

<style scoped>
/* スタイルを追加する場合 */
</style>
