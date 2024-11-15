<template>
  <div>
    <h1>This is DashBoard</h1>

    <h2>User List</h2>
    <button @click="$router.push('/dashboard/user-create')">Add New User</button> <!-- ユーザー追加リンク -->
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Email</th>
            <th>Role</th>
            <th>Extra Info</th>
            <th>Actions</th> <!-- 新しい列を追加 -->
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td>{{ user.id }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.role }}</td>
            <td>{{ user.extraInfo }}</td>
            <td>
              <!-- 編集ボタン -->
              <button @click="editUser(user.id)">Edit</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "DashBoard",
  data() {
    return {
      users: [], // ユーザー一覧を格納する
    };
  },
  mounted() {
    this.fetchUsers(); // コンポーネントがマウントされたらユーザー一覧を取得
  },
  methods: {
    async fetchUsers() {
      try {
        const response = await axios.get("http://localhost:8080/admin/users", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`, // トークンをヘッダーに追加
          },
        });
        this.users = response.data; // ユーザー一覧を更新
      } catch (error) {
        console.error("Error fetching users:", error);
        alert("Failed to fetch users.");
      }
    },
    // ユーザー編集ページにリダイレクトする
    editUser(userId) {
      this.$router.push(`/dashboard/user-edit/${userId}`);
    },
  },
};
</script>

<style scoped>
.table-container {
  width: 80%; /* テーブル全体を小さめに設定 */
  margin: 0 auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9em; /* テーブル文字のサイズを小さくする */
}

th, td {
  border: 1px solid #ddd;
  padding: 6px; /* パディングを少し小さめに設定 */
}

th {
  background-color: #f4f4f4;
  font-size: 0.9em; /* ヘッダー文字のサイズを小さくする */
}

button {
  padding: 5px 10px;
  background-color: #007BFF;
  color: white;
  border: none;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}
</style>
