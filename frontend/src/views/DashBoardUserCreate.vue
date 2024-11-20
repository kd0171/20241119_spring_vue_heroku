<template>
  <div>
    <h2>Create New User</h2>
    <form @submit.prevent="createUser">
      <div>
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="user.email" required />
      </div>
      <div>
        <label for="extraInfoRaw">Extra Info:</label>
        <input type="text" id="extraInfoRaw" v-model="user.extraInfoRaw" />
      </div>
      <div>
        <label for="role">Role:</label>
        <select id="role" v-model="user.role" required>
          <option value="ROLE_USER">User</option>
          <option value="ROLE_ADMIN">Admin</option>
        </select>
      </div>
      <button type="submit">Done</button>
    </form>
  </div>
</template>

<script>
import api from "@/api/axios"; // ここでインポートします

export default {
  name: "DashBoardUserCreate",
  data() {
    return {
      user: {
        email: "",
        extraInfoRaw: "", // ユーザーが入力する情報
        extraInfo: "", // 初期パスワードを含めて送信する情報
        role: "ROLE_USER", // デフォルトで"User"が選択される
        password: "", // 生成されたパスワードを格納
      },
    };
  },
  mounted() {
    this.generatePassword();
  },
  methods: {
    // ランダムな10文字のパスワードを生成する関数
    generatePassword() {
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      let password = "";
      for (let i = 0; i < 10; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      this.user.password = password;
      // extraInfoに初期パスワード情報を含め、extraInfoRawも含める
      this.user.extraInfo = `[Init Pass: ${password}] ${this.user.extraInfoRaw}`;
    },
    async createUser() {
      // extraInfoを更新して送信
      this.user.extraInfo = `[Init Pass: ${this.user.password}] ${this.user.extraInfoRaw}`;
      
      try {
        // 新しいユーザーを追加するAPIリクエスト
        await api.post("/admin/users", {
          email: this.user.email,
          extraInfo: this.user.extraInfo,
          role: this.user.role,
          password: this.user.password,
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`, // トークンをヘッダーに追加
          },
        });
        // 成功したらダッシュボードへリダイレクト
        this.$router.push("/dashboard");
      } catch (error) {
        console.error("Error creating user:", error);
        alert("Failed to create user.");
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
  background-color: #4CAF50;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 1em;
}

button:hover {
  background-color: #45a049;
}
</style>
