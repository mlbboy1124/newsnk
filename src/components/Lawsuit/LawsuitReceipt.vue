<template>
  <div class="scale-down">
    <h2 class="text-center my-4">작성된 영수증 목록</h2>
    <div class="table-responsive">
      <table class="table table-bordered table-striped table-hover">
        <thead class="thead-dark">
          <tr>
            <th class="text-center date-column">작성일</th>
            <th class="text-center">의뢰인</th>
            <th class="text-center">사건명</th>
            <th class="text-center">세부내용</th>
            <th class="text-center">법원</th>
            <th class="text-center">합계금액</th>
            <th class="text-center delete-column"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="receipt in filteredReceipts" :key="receipt.id">
            <td @click="loadReceipt(receipt)" class="text-center ellipsis">{{ receipt.createdAt }}</td>
            <td @click="loadReceipt(receipt)" class="text-center ellipsis">{{ lawsuit.clients.join(', ') }}</td>
            <td @click="loadReceipt(receipt)" class="text-center ellipsis">{{ lawsuit.caseName }}</td>
            <td @click="loadReceipt(receipt)" class="text-center ellipsis">{{ receipt.sub_content }}</td>
            <td @click="loadReceipt(receipt)" class="text-center ellipsis">{{ lawsuit.court }}</td>
            <td @click="loadReceipt(receipt)" class="text-right ellipsis">{{ formattedValue(receipt.totalAmount) }}원
            </td>
            <td class="text-center delete-column">
              <b-button class="btn-sm mx-1" variant="outline-danger"
                @click.stop="deleteReceipt(receipt.receipt_id)">삭제</b-button>
              <b-button class="btn-sm mx-1" variant="outline-primary"
                @click.stop="navigateToReport(receipt.receipt_id)">인쇄</b-button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <h2 class="text-center my-4">영수증 작성</h2>
    <div class="table-responsive">
      <table class="table table-bordered">
        <tbody>
          <tr>
            <th class="text-center">사건명</th>
            <td>{{ lawsuit.caseName }}</td>
            <th class="text-center">담당자</th>
            <td>{{ lawsuit.manager }}</td>
          </tr>
          <tr>
            <th class="text-center">의뢰인</th>
            <td>{{ lawsuit.clients.join(', ') }}</td>
            <th class="text-center">상대방</th>
            <td>{{ lawsuit.opponents.join(', ') }}</td>
          </tr>
          <tr>
            <th class="text-center">기초금액</th>
            <td>
  <input :value="formattedValue(courtprice)" @input="updateCourtPrice($event)" class="form-control" style="padding-bottom: 1px; padding-top: 1px;" />
</td>


            <th class="text-center">세부내용</th>
            <td><input v-model="sub_content" class="form-control" style="padding-bottom: 1px; padding-top: 1px;" /></td>
          </tr>
          <tr>
            <th class="text-center">참고사항</th>
            <td colspan="3">
              <textarea v-model="notes" class="form-control notes-textarea"></textarea>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <h3 class="text-center my-4">비용내역서</h3>
    <div class="table-responsive">
      <table class="table table-bordered fixed-width">
        <thead>
          <tr>
            <th colspan="2" class="text-center">공과금</th>
            <th colspan="2" class="text-center">보수료</th>
            <th class="text-center delete-column"></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th class="text-center">항목</th>
            <th class="text-center">금액</th>
            <th class="text-center">항목</th>
            <th class="text-center">금액</th>
            <th></th>
          </tr>
          <tr v-for="index in maxItems" :key="index">
            <td><input v-model="getExpense(expensesLeft, index - 1).name" class="form-control input-fixed" /></td>
            <td><input :value="formattedAmount(expensesLeft, index - 1)"
                @input="updateAmount($event, expensesLeft, index - 1)" class="form-control input-fixed" type="text" />
            </td>
            <td><input v-model="getExpense(expensesRight, index - 1).name" class="form-control input-fixed" /></td>
            <td><input :value="formattedAmount(expensesRight, index - 1)"
                @input="updateAmount($event, expensesRight, index - 1)" class="form-control input-fixed" type="text" />
            </td>
            <td class="text-center">
              <b-button class="btn-sm" variant="outline-danger" @click="removeExpenseItem(index - 1)"
                :disabled="disableRemoveButton">삭제</b-button>
            </td>
          </tr>
          <tr>
            <th colspan="2"></th>
            <th class="text-center">부가세</th>
            <th class="text-center">{{ formattedValue(VAT) }}원</th>
            <th></th>
          </tr>
          <tr>
            <th class="text-center">공과금 소계</th>
            <th class="text-center">{{ formattedValue(LeftAmount) }}원</th>
            <th class="text-center">보수료 소계</th>
            <th class="text-center">{{ formattedValue(rightAmount) }}원</th>
            <th></th>
          </tr>
          <tr>
            <th colspan="2" class="text-center">합계</th>
            <th colspan="2" class="text-center">{{ formattedValue(totalAmount + VAT) }}원</th>
            <th></th>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="text-center my-4">
      <b-button variant="outline-primary mx-1" @click="addExpenseItem">항목 추가</b-button>
      <b-button variant="outline-success mx-1" @click="saveReceipt">저장</b-button>
      <b-button variant="outline-danger mx-1" @click="resetForm">취소</b-button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  props: ['index'],
  data() {
    return {
      lawsuit: {
        caseName: '',
        manager: '',
        clients: [],
        opponents: [],
        court: 0,
      },
      sub_content: '', // 입력받을 내용 추가
      notes: '', // 입력받을 참고사항 추가
      courtprice: 0, // 기초금액 추가
      expensesLeft: [
        { name: '인지', amount: 0 },
        { name: '송달료', amount: 0 },
        { name: '등본등제증명', amount: 0 },
        { name: '우편료', amount: 0 },
        { name: '', amount: 0 },
        { name: '', amount: 0 },
      ],
      expensesRight: [
        { name: '기본보수', amount: 0 },
        { name: '교통비', amount: 0 },
        { name: '서류작성비', amount: 0 },
        { name: '', amount: 0 },
        { name: '', amount: 0 },
        { name: '', amount: 0 },
      ],
      createdAt: '',
      receipts: []
    };
  },
  computed: {
    maxItems() {
      return Math.max(this.expensesLeft.length, this.expensesRight.length);
    },
    rightAmount() {
      const rightSum = this.expensesRight.reduce((sum, item) => sum + (item.amount || 0), 0);
      return rightSum;
    },
    VAT() {
      const rightSum = this.rightAmount;
      return Math.floor(rightSum * 0.1);
    },
    LeftAmount() {
      const leftSum = this.expensesLeft.reduce((sum, item) => sum + (item.amount || 0), 0);
      return leftSum;
    },
    totalAmount() {
      const leftSum = this.LeftAmount;
      const rightSum = this.rightAmount;
      return leftSum + rightSum;
    },
    disableRemoveButton() {
      return this.expensesLeft.length <= 6 && this.expensesRight.length <= 6;
    },
    filteredReceipts() {
      // 작성일을 기준으로 정렬 (오름차순)
      return this.receipts
        .filter(receipt => receipt.lawsuit_id === this.index)
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }
  },
  created() {
    this.fetchLawsuit();
    this.fetchReceipts();
  },
  methods: {
    fetchLawsuit() {
      const lawsuit_id = this.index;
      axios.get(`/api/lawsuits/${lawsuit_id}`)
        .then(response => {
          this.lawsuit = response.data;
        })
        .catch(error => {
          console.error('소송 정보를 불러오는 중에 오류가 발생했습니다', error);
        });
    },
    fetchReceipts() {
      const lawsuit_id = this.index;
      axios.get(`/api/lawsuits/receipts/${lawsuit_id}`)
        .then(response => {
          this.receipts = response.data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        })
        .catch(error => {
          console.error('영수증 목록을 불러오는 중에 오류가 발생했습니다:', error);
        });
    },
    addExpenseItem() {
      this.expensesLeft.push({ name: '', amount: 0 });
      this.expensesRight.push({ name: '', amount: 0 });
    },
    removeExpenseItem(index) {
      if (this.expensesLeft.length > 6) {
        this.expensesLeft.splice(index, 1);
      }
      if (this.expensesRight.length > 6) {
        this.expensesRight.splice(index, 1);
      }
    },
    getExpense(array, index) {
      if (!array[index]) {
        array[index] = { name: '', amount: 0 };
      }
      return array[index];
    },
    formattedAmount(array, index) {
      const value = array[index] ? array[index].amount : 0;
      return new Intl.NumberFormat().format(value);
    },
    updateAmount(event, array, index) {
      const value = event.target.value.replace(/,/g, '');
      array[index].amount = parseInt(value, 10) || 0;
    },
    updateCourtPrice(event) {
    const value = event.target.value.replace(/,/g, '');
    this.courtprice = parseInt(value, 10) || 0;
  },
    formattedValue(value) {
      return new Intl.NumberFormat().format(value);
    },
    saveReceipt() {
      const data = {
        lawsuit_id: this.index,
        expensesLeft: this.expensesLeft.map(expense => ({
          ...expense,
          amount: expense.amount === 0 ? null : expense.amount
        })),
        expensesRight: this.expensesRight.map(expense => ({
          ...expense,
          amount: expense.amount === 0 ? null : expense.amount
        })),
        VAT: this.VAT,
        LeftAmount: this.LeftAmount,
        rightAmount: this.rightAmount,
        totalAmount: this.totalAmount + this.VAT,
        sub_content: this.sub_content, // 입력된 내용 저장
        notes: this.notes === '' ? null : this.notes, // 비어있으면 null로 저장
        courtprice: this.courtprice === 0 ? null : this.courtprice, // 기초금액 저장
      };
      axios.post('/api/lawsuits/receipt/save', data)
        .then(() => {
          this.fetchReceipts();
          this.resetForm(); // 폼 초기화
          window.scrollTo({ top: 0, behavior: 'smooth' }); // 저장 후 페이지 맨위로 스크롤
        })
        .catch(error => {
          console.error('영수증 저장 중 오류가 발생했습니다:', error);
        });
    },
    deleteReceipt(receipt_id) {
      axios.delete(`/api/lawsuits/receipts/${receipt_id}`)
        .then(() => {
          this.fetchReceipts();
        })
        .catch(error => {
          console.error('영수증 삭제 중 오류가 발생했습니다:', error);
        });
    },
    navigateToReport(receipt_id) {
      const url = this.$router.resolve({ name: 'LawsuitReceiptReport', params: { receipt_id } }).href;
      const newWindowName = `newwindow-${receipt_id}`;
      window.open(url, newWindowName, 'width=1050,height=800');
    },
    loadReceipt(receipt) {
      this.expensesLeft = receipt.expensesLeft.map(expense => ({
        ...expense,
        amount: expense.amount === null ? 0 : expense.amount
      }));
      this.expensesRight = receipt.expensesRight.map(expense => ({
        ...expense,
        amount: expense.amount === null ? 0 : expense.amount
      }));
      this.sub_content = receipt.sub_content; // 저장된 내용 불러오기
      this.notes = receipt.notes; // 저장된 참고사항 불러오기
      this.courtprice = receipt.courtprice; // 저장된 기초금액 불러오기
    },
    resetForm() {
      this.expensesLeft = [
        { name: '인지', amount: 0 },
        { name: '송달료', amount: 0 },
        { name: '등본등제증명', amount: 0 },
        { name: '우편료', amount: 0 },
        { name: '', amount: 0 },
        { name: '', amount: 0 },
      ];
      this.expensesRight = [
        { name: '기본보수', amount: 0 },
        { name: '교통비', amount: 0 },
        { name: '서류작성비', amount: 0 },
        { name: '', amount: 0 },
        { name: '', amount: 0 },
        { name: '', amount: 0 },
      ];
      this.sub_content = ''; // 폼 초기화 시 내용도 초기화
      this.notes = ''; // 폼 초기화 시 참고사항도 초기화
      this.courtprice = 0; // 기초금액도 초기화
    },
  },
};
</script>

<style scoped>
.table-responsive {
  margin-bottom: 20px;
}

.table {
  table-layout: fixed;
  max-width: 1000px;
}

.table th,
.table td {
  word-wrap: break-word;
  cursor: pointer;
  padding-top: 0.2rem;
  padding-bottom: 0.2rem;
  background: none;
}

.input-fixed {
  width: 100%;
}

.scale-down {
  transform: scale(0.9);
  transform-origin: top center;
}

h2 {
  max-width: 1000px;
}

h3 {
  max-width: 1000px;
}

.btn-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
  line-height: 1.5;
  border-radius: 0.2rem;
}

.delete-column {
  width: 120px;
  /* 원하는 너비로 설정 */
}

.date-column {
  width: 150px;
  /* 원하는 너비로 설정 */
}

.table-hover tbody tr:hover {
  background-color: rgba(51, 80, 176, 0.1) !important;
}

.thead-dark th {
  background-color: #3384d4;
  color: white;
}

.text-right {
  text-align: right;
}

.text-left {
  text-align: left;
}

.text-center {
  text-align: center;
}

.notes-textarea {
  height: 50px;
  /* 참고사항 칸 높이 설정 */
}

/* Ellipsis styling */
.ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
