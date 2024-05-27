<template>
  <div id="app">
    <HeaderPage v-if="showHeader" @logout="logout" />
    <div class="contents">
      <router-view />
    </div>
  </div>
</template>

<script>
import HeaderPage from './components/HeaderPage.vue';

export default {
  data() {
    return {
      showHeader: !!localStorage.getItem('token')
    };
  },
  watch: {
    '$route'(to) {
      if (to.name === 'LawsuitDocument' || to.name === 'LawsuitReceipt' || to.name === 'LawsuitReceiptReport') {
        this.showHeader = false;
      } else {
        this.showHeader = !!localStorage.getItem('token');
      }
    }
  },
  methods: {
    logout() {
      localStorage.removeItem('token');
      this.showHeader = false;
      this.$router.push('/');
    }
  },
  components: {
    HeaderPage
  }
};
</script>

<style>
#app {
  font-family: "Noto Sans KR", sans-serif;
  font-optical-sizing: auto;
  font-style: normal;
}
</style>
