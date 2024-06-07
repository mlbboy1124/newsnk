import { createRouter, createWebHashHistory } from 'vue-router';
import HomePage from '@/components/HomePage.vue';

import CoReg_Page from '@/components/Co-Reg/CoReg_Page.vue';
import RealReg_Page from '@/components/RE-Reg/RealReg_Page.vue';
import RealRegDetail from '@/components/RE-Reg/RealRegDetail.vue';
import RealRegEdit from '@/components/RE-Reg/RealRegEdit.vue';
import RealRegReceipt from '@/components/RE-Reg/RealRegReceipt.vue';
import RealRegReceiptReport from '@/components/RE-Reg/RealRegReceiptReport.vue';
import LawsuitPage from '@/components/Lawsuit/LawsuitPage.vue';
import LawsuitDocument from '@/components/Lawsuit/LawsuitDocument.vue';
import LawsuitReceipt from '@/components/Lawsuit/LawsuitReceipt.vue';
import LawsuitReceiptReport from '@/components/Lawsuit/LawsuitReceiptReport.vue';
import LoginPage from '@/components/LoginPage.vue';
import RegisterPage from '@/components/RegisterPage.vue'; // 추가된 부분

const routes = [
  { path: '/', component: LoginPage },
  { path: '/home', component: HomePage, meta: { requiresAuth: true } },
  { path: '/coreg', component: CoReg_Page, meta: { requiresAuth: true } },
  { path: '/realreg', component: RealReg_Page, meta: { requiresAuth: true } },
  { path: '/realreg/:realreg_id', component: RealRegDetail, name: 'RealRegDetail', props: true, meta: { requiresAuth: true } },
  { path: '/realreg/edit/:realreg_id?', component: RealRegEdit, name: 'RealRegEdit', props: true, meta: { requiresAuth: true } },
  { path: '/realreg/receipt/:realreg_id', name: 'RealRegReceipt', component: RealRegReceipt, props: true, meta: { requiresAuth: true } },
  { path: '/realreg/receiptReport/:receipt_id', name: 'RealRegReceiptReport', component: RealRegReceiptReport, props: true, meta: { requiresAuth: true } },
  { path: '/lawsuit', component: LawsuitPage, meta: { requiresAuth: true } },
  { path: '/lawsuit/document/:index', name: 'LawsuitDocument', component: LawsuitDocument, props: true, meta: { requiresAuth: true } },
  { path: '/lawsuit/receipt/:index', name: 'LawsuitReceipt', component: LawsuitReceipt, props: true, meta: { requiresAuth: true } },
  { path: '/lawsuit/receiptReport/:receipt_id', name: 'LawsuitReceiptReport', component: LawsuitReceiptReport, props: true, meta: { requiresAuth: true } },
  { path: '/register', component: RegisterPage } // 추가된 부분
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  if (to.path === '/' && token) {
    next('/home');
  } else if (requiresAuth && !token) {
    next('/');
  } else {
    next();
  }
});

export default router;
