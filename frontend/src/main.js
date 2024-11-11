import { createApp } from 'vue';
import App from './App.vue';
import router from './routers'; // ルーティング設定をインポート

createApp(App).use(router).mount('#app');
