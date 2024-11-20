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
            <th>Actions</th> <!-- 編集列 -->
            <th>Delete</th> <!-- 削除列 -->
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
            <td>
              <!-- 削除ボタン: IDが1のユーザーには表示しない -->
              <button v-if="user.id !== 1" @click="deleteUser(user.id)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import api from "@/api/axios"; // ここでインポートします

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
        const response = await api.get("/admin/users", {
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
    // ユーザー削除処理
    async deleteUser(userId) {
      if (confirm("Are you sure you want to delete this user?")) {
        try {
          await api.delete(`/admin/users/${userId}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`, // トークンをヘッダーに追加
            },
          });
          alert("User deleted successfully.");
          this.fetchUsers(); // ユーザー一覧を再取得
        } catch (error) {
          console.error("Error deleting user:", error);
          alert("Failed to delete user.");
        }
      }
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

button[type="button"] {
  background-color: #f44336;
}

button[type="button"]:hover {
  background-color: #d32f2f;
}
</style>
