<template>
  <header class="header">
    <nav>
      <router-link to="/">Home</router-link>
      <router-link v-if="!isLoggedIn" to="/login">Login</router-link>
      <a v-else @click="logout" style="cursor: pointer;">Logout</a>
      <!-- 管理者の場合にのみ表示されるリンク -->
      <router-link v-if="isLoggedIn && userRole === 'ROLE_ADMIN'" to="/dashboard" style="cursor: pointer;">Admin Dashboard</router-link>
    </nav>

    <!-- 右端にWelcome メッセージとユーザー情報を表示 -->
    <div v-if="isLoggedIn" class="user-info">
      <p>Welcome {{ userEmail }} ({{ userRole }})</p>
    </div>
  </header>
</template>

<script>
export default {
  name: 'HeaderComponent',
  data() {
    return {
      isLoggedIn: false,
      userEmail: '',  // ユーザーのメールアドレス
      userRole: ''    // ユーザーの役職
    };
  },
  mounted() {
    // マウント時にトークンをチェック
    this.isLoggedIn = !!localStorage.getItem('accessToken');

    // ユーザー情報をlocalStorageから取得
    this.userEmail = localStorage.getItem('userEmail') || '';
    this.userRole = localStorage.getItem('userRole') || '';

    // カスタムイベントのリスナーを追加
    window.addEventListener('authChanged', this.updateAuthStatus);
  },
  beforeUnmount() {
    // コンポーネントがアンマウントされる際にイベントリスナーを削除
    window.removeEventListener('authChanged', this.updateAuthStatus);
  },
  methods: {
    logout() {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('userEmail');  // メールアドレスもログアウト時に削除
      localStorage.removeItem('userRole');   // ロールもログアウト時に削除
      this.isLoggedIn = false;
      window.dispatchEvent(new Event('authChanged')); // ログアウト後にカスタムイベントを発火
      this.$router.push('/'); // ログアウト後にホームページにリダイレクト
    },
    updateAuthStatus() {
      this.isLoggedIn = !!localStorage.getItem('accessToken');
      // ログイン状態が変わったときに、メールアドレスとロールを更新
      this.userEmail = localStorage.getItem('userEmail') || '';
      this.userRole = localStorage.getItem('userRole') || '';
    }
  }
};
</script>

<style scoped>
.header {
  padding: 20px;
  background-color: #42b983;
  color: white;
  text-align: center;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

nav {
  display: flex;
  gap: 20px;
}

a {
  color: white;
  text-decoration: none;
  font-weight: bold;
}

a:hover {
  text-decoration: underline;
}

/* 右端にユーザー情報を表示 */
.user-info {
  text-align: right;
  font-size: 14px;
}
</style>
