<template>
  <div>
    <h2>Login</h2>
    <form @submit.prevent="handleLogin">
      <input v-model="email" placeholder="Email" type="email" />
      <input v-model="password" placeholder="Password" type="password" />
      <button type="submit">Login</button>
    </form>
    
    <!-- トークンの表示 -->
    <div v-if="token">Token: {{ token }}</div>

    <!-- /admin エンドポイントのテストボタン -->
    <button @click="accessAdminEndpoint" :disabled="!token || userRole !== 'ROLE_ADMIN'">Access Admin Endpoint</button>

    <!-- /secured エンドポイントのテストボタン -->
    <button @click="accessSecuredEndpoint" :disabled="!token">Access Secured Endpoint</button>

    <!-- エンドポイントからの応答メッセージを表示 -->
    <div v-if="adminData">Admin Data: {{ adminData }}</div>
    <div v-if="securedData">Secured Data: {{ securedData }}</div>
    <div v-if="errorMessage" style="color: red;">Error: {{ errorMessage }}</div>
  </div>
</template>

<script>
import api from "@/api/axios"; // ここでインポートします

// JWTデコード関数
function decodeJWT(token) {
  const base64Url = token.split('.')[1]; // Payload部分
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  );

  return JSON.parse(jsonPayload);
}

export default {
  data() {
    return {
      email: '',
      password: '',
      token: '',
      userRole: '',  // ユーザーロール
      adminData: '',
      securedData: '',
      errorMessage: ''
    };
  },
  methods: {
    // ログインを試み、トークンを取得
    async handleLogin() {
      try {
        const response = await api.post('/auth/login', {
          email: this.email,
          password: this.password
        });

        this.token = response.data.accessToken;
        localStorage.setItem('accessToken', this.token); // トークンをlocalStorageに保存

        // JWTトークンをデコードしてメールアドレスとロールを取得
        const decoded = decodeJWT(this.token);
        const userEmail = decoded.e;  // メールアドレス
        const userRole = decoded.a[0]; // ロール（配列の最初の要素）

        // メールアドレスとロールをlocalStorageに保存
        localStorage.setItem('userEmail', userEmail);
        localStorage.setItem('userRole', userRole);

        this.userRole = userRole;  // ロールをセット

        window.dispatchEvent(new Event('authChanged')); // カスタムイベントを発火して、HeaderComponentに状態を伝える
        this.errorMessage = '';
        
        // ロールに基づいてリダイレクト先を変更
        if (userRole === 'ROLE_ADMIN') {
          this.$router.push('/admin');
        } else {
          this.$router.push('/user');
        }
      } catch (error) {
        console.error("Login failed:", error);
        this.errorMessage = "Invalid email or password.";
        this.token = '';
      }
    },
    // 管理者エンドポイントにアクセス
    async accessAdminEndpoint() {
      if (!this.token || this.userRole !== 'ROLE_ADMIN') {
        this.errorMessage = "Access denied. Admins only.";
        return;
      }

      try {
        const response = await api.get('/admin', {
          headers: {
            'Authorization': `Bearer ${this.token}`
          }
        });
        this.adminData = response.data;
        this.errorMessage = '';
      } catch (error) {
        console.error("Access to admin endpoint failed:", error);
        this.errorMessage = "Access denied or insufficient permissions.";
        this.adminData = "Access denied";
      }
    },

    // /secured エンドポイントにアクセス
    async accessSecuredEndpoint() {
      if (!this.token) return;
      try {
        const response = await api.get('/secured', {
          headers: {
            'Authorization': `Bearer ${this.token}`
          }
        });
        this.securedData = response.data;
        this.errorMessage = '';
      } catch (error) {
        console.error("Access to secured endpoint failed:", error);
        this.errorMessage = "Access denied or insufficient permissions.";
        this.securedData = "Access denied";
      }
    }
  },
  // コンポーネントがマウントされたときにlocalStorageからトークンを取得
  mounted() {
    const storedToken = localStorage.getItem('accessToken');
    const storedUserRole = localStorage.getItem('userRole');
    if (storedToken) {
      this.token = storedToken; // localStorageから取得したトークンをセット
      this.userRole = storedUserRole; // localStorageから取得したロールをセット
    }
  }
};
</script>
