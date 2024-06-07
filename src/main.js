import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import BootstrapVue3 from 'bootstrap-vue-3';
import axios from '@/axios'; // Axios 인스턴스를 가져옵니다.

// 부트스트랩 css
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css';

//FontAwesome css
import '@fortawesome/fontawesome-free/css/all.css';
import '@fortawesome/fontawesome-free/js/all.js';

const app = createApp(App);
app.use(BootstrapVue3);
app.use(router);
app.config.globalProperties.$axios = axios; // Axios 인스턴스를 글로벌 속성으로 추가합니다.
app.mount('#app');
