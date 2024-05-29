import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import BootstrapVue3 from 'bootstrap-vue-3';
import axios from 'axios';

axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

// 부트스트랩 css
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css';

const app = createApp(App);
app.use(BootstrapVue3);
app.use(router);
app.mount('#app');
