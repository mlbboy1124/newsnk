<template>
  <div>
    <h2>영수증 미리보기</h2>
    <div v-if="receiptreportfiltered.receipt && receiptreportfiltered.lawsuit">
      <!-- receipt 정보를 표시하는 HTML 코드 -->
      <p>작성일: {{ receiptreportfiltered.receipt.createdAt }}</p>
      <p>의뢰인: {{ receiptreportfiltered.lawsuit.clients.join(', ') }}</p>
      <p>사건명: {{ receiptreportfiltered.lawsuit.caseName }}</p>
      <p>세부내용: {{ receiptreportfiltered.receipt.sub_content }}</p>
      <p>법원: {{ receiptreportfiltered.lawsuit.court }}</p>
      <p>공과금: {{ receiptreportfiltered.receipt.expensesLeft.join(', ')}}</p>
      <p>보수료: {{ receiptreportfiltered.receipt.expensesLeft.join(', ')}}</p>
      <p>세부내용: {{ receiptreportfiltered.receipt.sub_content }}</p>
      <p>합계금액: {{ receiptreportfiltered.receipt.totalAmount }}원</p>
    </div>
    <b-button @click="generateReport('pdf')">PDF로 출력</b-button>
    <b-button @click="generateReport('xlsx')">Excel로 출력</b-button>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  props: ['receipt_id'],
  data() {
    return {
      receiptreportfiltered: {
        receipt: null,
        lawsuit: null
      }
    };
  },
  created() {
    this.loadReceipt();
  },
  methods: {
    loadReceipt() {
      axios.get(`/api/lawsuits/receipts/reportpage/${this.receipt_id}`)
        .then(response => {
          this.receiptreportfiltered.receipt = response.data;
          console.log(response.data);
          return axios.get(`/api/lawsuits/${response.data.lawsuit_id}`);
        })
        .then(response => {
          this.receiptreportfiltered.lawsuit = response.data;

        })
        .catch(error => {
          console.error('영수증 정보를 불러오는 중에 오류가 발생했습니다:', error);
        });
    },
    generateReport() {
      
    }
  }
};
</script>

<style scoped>
/* 스타일링 코드 */
</style>
