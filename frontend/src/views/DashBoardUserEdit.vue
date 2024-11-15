<template>
  <div>
    <h2>Edit User</h2>
    <form @submit.prevent="updateUser">
      <div>
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="user.email" required />
      </div>
      <div>
        <label for="extraInfo">Extra Info:</label>
        <input type="text" id="extraInfo" v-model="user.extraInfoRaw" />
      </div>
      <div>
        <label for="role">Role:</label>
        <select id="role" v-model="user.role" required>
          <option value="ROLE_USER">User</option>
          <option value="ROLE_ADMIN">Admin</option>
        </select>
      </div>
      <button type="submit">Save Changes</button>
      <!-- パスワード再設定ボタンはIDが1のユーザーには表示しない -->
      <button type="button" v-if="userId !== 1" @click="resetPassword">Reset Password</button>
    </form>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "DashBoardUserEdit",
  data() {
    return {
      user: {
        email: "",
        extraInfoRaw: "", // ユーザーが記入する情報
        extraInfo: "", // サーバーに送信する情報
        role: "",
        password: "", // 新しいパスワードを格納
      },
    };
  },
  mounted() {
    this.userId = parseInt(this.$route.params.id, 10); // URLからユーザーIDを取得
    this.fetchUser();
  },
  methods: {
    // ユーザー情報の取得
    async fetchUser() {
      try {
        const userId = this.$route.params.id; // URLパラメータからユーザーIDを取得
        const response = await axios.get(`http://localhost:8080/admin/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`, // トークンをヘッダーに追加
          },
        });
        const userData = response.data;
        this.user.email = userData.email;
        this.user.extraInfoRaw = userData.extraInfo; // ユーザーが編集できる情報のみ
        this.user.role = userData.role;
        this.user.password = ""; // パスワードフィールドは空で初期化
      } catch (error) {
        console.error("Error fetching user:", error);
        alert("Failed to fetch user.");
      }
    },
    // ランダムな10文字のパスワードを生成する関数
    generatePassword() {
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      let password = "";
      for (let i = 0; i < 10; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return password;
    },
    // パスワードリセット
    resetPassword() {
      const newPassword = this.generatePassword();
      this.user.password = newPassword;
      this.user.extraInfoRaw += ` [Reset Pass: ${newPassword}]`; // extraInfoRawに追加
    },
    // ユーザー情報の更新
    async updateUser() {
      try {
        // 更新するユーザー情報を構築
        const updatedUser = {
          email: this.user.email,
          extraInfo: this.user.extraInfoRaw, // パスワードリセット情報が含まれたものを送信
          role: this.user.role,
          password: this.user.password ? this.user.password : null, // パスワードが設定されていれば送信
        };

        const userId = this.$route.params.id;
        await axios.put(`http://localhost:8080/admin/users/${userId}`, updatedUser, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
        // 成功したらダッシュボードへリダイレクト
        this.$router.push("/dashboard");
      } catch (error) {
        console.error("Error updating user:", error);
        alert("Failed to update user.");
      }
    },
  },
};
</script>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 400px;
  margin: 0 auto;
}

label {
  font-weight: bold;
}

input, select {
  padding: 8px;
  font-size: 1em;
  width: 100%;
}

button {
  padding: 10px;
  margin-top: 10px;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 1em;
}

button[type="submit"] {
  background-color: #4CAF50;
}

button[type="button"] {
  background-color: #f44336;
}

button[type="submit"]:hover {
  background-color: #45a049;
}

button[type="button"]:hover {
  background-color: #d32f2f;
}
</style>
