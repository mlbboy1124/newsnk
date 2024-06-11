<template>
  <div class="container mt-5 small-text-table-container">
    <div class="row justify-content-between mb-3">
        <h2 class="mb-4">부동산등기</h2>
        <div class="col-auto">
          <b-input-group>
        <b-form-input v-model="searchQuery" @input="onSearch" placeholder="검색어를 입력하세요"></b-form-input>
      </b-input-group>        </div>
        <div class="col-auto">
          <b-button variant="outline-primary" class="mx-1" @click="createRealreg">부동산등기 작성</b-button>
        </div>
      </div>

    <b-table :items="filteredRealregs" :fields="fields" v-model:sortBy="sortBy" v-model:sortDesc.sync="sortDesc" sort-icon-left @row-clicked="viewRealreg" hover responsive="sm"
      class="small-text-table"></b-table>
    <div class="d-flex justify-content-between align-items-center mt-3">
      <b-pagination id="pagination" v-model="currentPage" :total-rows="realregs.length" :per-page="realregsPerPage" aria-controls="my-table"></b-pagination>
      <span>Showing 1 to 10 of {{ realregs.length }} entries</span>
    </div>
  </div>
</template>

<script>
import axios from '@/axios';


export default {
  data() {
    return {
      sortBy: 'settlement_date',
      sortDesc: true,
      searchQuery: '',
      fields: [
        { key: 'requester', label: '구분', thClass: 'col-requester', tdClass: 'col-requester'  },
        { key: 'division', label: '등기구분', thClass: 'col-division', tdClass: 'col-division'  },
        { key: 'registration_date', label: '등록일', thClass: 'col-registration-date', tdClass: 'col-registration-date', sortable: true },
        { key: 'settlement_date', label: '잔금일', thClass: 'col-settlement-date', tdClass: 'col-settlement-date', sortable: true  },
        { key: 'settlement_time', label: '시간', thClass: 'col-settlement-Time', tdClass: 'col-settlement-Time' },
        { key: 'repayment_status', label: '상환', thClass: 'col-repayment-status', tdClass: 'col-repayment-status' },
        { key: 'transaction_address', label: '거래주소', thClass: 'col-transaction-address', tdClass: 'col-transaction-address' },
        { key: 'buyers', label: '매수인', thClass: 'col-buyer', tdClass: 'col-buyer' },
        { key: 'manager', label: '담당자', thClass: 'col-manager', tdClass: 'col-manager' }
      ],
      realregs: [],
      currentPage: 1,
      realregsPerPage: 10
    };
  },
  computed: {
    filteredRealregs() {
      let filtered = this.realregs.map(realreg => ({
        ...realreg,
        buyers: realreg.buyers.map(buyer => buyer.name).join(', ')
      })).filter(realreg => {
        return Object.values(realreg).some(value =>
          String(value).toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      });
      const start = (this.currentPage - 1) * this.realregsPerPage;
      const end = this.currentPage * this.realregsPerPage;
      return filtered.slice(start, end);
    },
  },
  created(){
  this.fetchRealregs();
},
  methods: {
    async fetchRealregs(){
    try {
      const response = await axios.get('/api/realregs');
      this.realregs = response.data;
    } catch (error) {
      console.error("부동산 등기 불러오는 중에 오류가 발생했습니다:", error.response ? error.response.data : error.message);
    }
  },
    onSearch() {
      this.currentPage = 1;
    },
    viewRealreg(realreg) {
      this.$router.push({ name: 'RealRegDetail', params: { realreg_id : realreg.realreg_id } });
    },
    createRealreg() {
      this.$router.push({ name: 'RealRegEdit' });
    },
    search() {
      this.currentPage = 1;
    }
  }
};
</script>

<style>
.small-text-table-container .table {
    min-width: 1150px;
}

.small-text-table-container .table th,
.small-text-table-container .table td {
  font-size: 14px;/* 작은 글자 크기로 조정 */
  text-align: center;
  padding:16px 5px 16px 5px;
}

span {font-size: 12px !important;}
.col-requester{width: 10%;}
.col-division {width: 10%;}
.col-registration-date {width: 9%;}
.col-settlement-date {width: 9%; }
.col-settlement-time {width: 7%; }
.col-repayment-status {width: 5%;}
.col-transaction-address {width: 30%;font-size: 12px !important;}
.col-buyer {width: 10%}
.col-manager {width: 10%;}

/* b-pagination 스타일 조정 */
.pagination .page-link {
  padding: 0.3rem 0.7rem !important; /* 원하는 크기로 조정 */
  font-size: 1rem !important; /* 글자 크기 조정 */
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
}

.pagination .active .page-link{
  background-color: #6c757d!important;
  border-color:#6c757d!important;
}

.pagination .page-item {
  margin: 0 2px !important;
}

/* Custom styles for sorting icons */
.b-table-sort-icon {
  font-family: "Font Awesome 5 Free";
  font-weight: 900;
}

.b-table-sort-icon::before {
  content: "\f0dc"; /* FontAwesome icon for up and down arrows */
}


</style>
