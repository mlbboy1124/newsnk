<template>
  <div class="container mt-4 small-text-table-container">
    <div class="row justify-content-between mb-3">
      <div class="col-auto">
        <b-input-group>
          <b-form-input v-model="searchQuery" @input="onSearch" placeholder="검색어를 입력하세요"></b-form-input>
        </b-input-group>
      </div>
    </div>

    <b-table :items="filteredExecutives" :fields="fields" v-model:sortBy="sortBy" v-model:sortAsc.sync="sortAsc"
      sort-icon-left @row-clicked="viewCompany" hover responsive="sm" class="small-text-table">
    </b-table>
    <div class="d-flex justify-content-between align-items-center mt-3">
      <b-pagination id="pagination" v-model="currentPage" :total-rows="executives.length" :per-page="executivesPerPage"
        aria-controls="my-table"></b-pagination>
      <span>Showing 1 to 10 of {{ executives.length }} entries</span>
    </div>
  </div>
</template>

<script>
import axios from '@/axios';
import { format } from 'date-fns';

export default {
  name: 'CoReg_Executives',
  data() {
    return {
      sortBy: 'co_name',
      sortAsc: true,
      searchQuery: '',
      fields: [
        { key: 'requester', label: '소개구분', thClass: 'col1-requester', tdClass: 'col1-requester' },
        { key: 'co_category', label: '법인구분', thClass: 'col1-co_category', tdClass: 'col1-co_category' },
        { key: 'co_name', label: '상호', thClass: 'col1-co_name', tdClass: 'col1-co_name', sortable: true },
        { key: 'role', label: '직책', thClass: 'col1-role', tdClass: 'col1-role'},
        { key: 'name', label: '임원이름', thClass: 'col1-executive_name', tdClass: 'col1-executive_name' },
        { key: 'reg_date', label: '취임일', thClass: 'col1-reg_date', tdClass: 'col1-reg_date' },
        { key: 'end_date', label: '임기만료일', thClass: 'col1-end_date', tdClass: 'col1-end_date', sortable: true  },
        { key: 'remaining_period', label: '남은기간', thClass: 'col1-remaining_period', tdClass: 'col1-remaining_period', sortable: true  },
      ],
      executives: [],
      currentPage: 1,
      executivesPerPage: 10
    };
  },
  computed: {
    filteredExecutives() {
      let filtered = this.executives.filter(executive => {
        return Object.values(executive).some(value =>
          String(value).toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      });

      const start = (this.currentPage - 1) * this.executivesPerPage;
      const end = this.currentPage * this.executivesPerPage;
      return filtered.slice(start, end);
    },
  },
  created() {
    this.fetchExecutives();
  },
  methods: {
    async fetchExecutives() {
      try {
        const response = await axios.get('/api/executives');
        const executivesWithCompanyData = await Promise.all(response.data.map(async (executive) => {
          const companyResponse = await axios.get(`/api/co/${executive.company_id}`);
          const company = companyResponse.data;
          const expiryDate = executive.role === '감사' 
            ? this.calculateAuditorEndDate(executive.reg_date, company.co_period, company.co_settlement_month)
            : this.calculateEndDate(executive.reg_date, company.co_period);
          const remainingPeriod = Math.ceil((new Date(expiryDate) - new Date()) / (1000 * 60 * 60 * 24));

          return {
            ...executive,
            requester: company.requester,
            co_category: company.co_category === 'custom' ? company.custom_co_category : company.co_category,
            co_name: company.co_name,
            manager: company.manager,
            role: executive.role,
            end_date: expiryDate,
            remaining_period: `${remainingPeriod}일`,
          };
        }));

        this.executives = executivesWithCompanyData;
      } catch (error) {
        console.error("임원 목록을 불러오는 중에 오류가 발생했습니다:", error.response ? error.response.data : error.message);
      }
    },
    calculateEndDate(startDate, period) {
      const start = new Date(startDate);
      start.setFullYear(start.getFullYear() + parseInt(period));
      return format(start, 'yyyy-MM-dd');
    },
    calculateAuditorEndDate(startDate, period, settlementMonth) {
      const start = new Date(startDate);
      start.setFullYear(start.getFullYear() + parseInt(period));
      if (settlementMonth > 9) {
        const adjustedMonth = settlementMonth - 12;
        start.setMonth(adjustedMonth + 3); // Add 3 months to the adjusted settlement month
      } else {
        start.setMonth(settlementMonth + 3); // Add 3 months to the settlement month
      }
      start.setDate(0); // Set to the last day of the month
      return format(start, 'yyyy-MM-dd');
    },
    formattedValue(value) {
      return value === null || value === undefined ? '' : new Intl.NumberFormat().format(value);
    },
    onSearch() {
      this.currentPage = 1;
    },
    viewCompany(executive) {
      this.$router.push({ name: 'CoReg_Co_Detail', params: { company_id: executive.company_id } });
    },
  }
};
</script>

<style scoped>
.small-text-table-container .table {
  min-width: 1150px;
}

.small-text-table-container .table th,
.small-text-table-container .table td {
  font-size: 14px;
  /* 작은 글자 크기로 조정 */
  text-align: center;
  padding: 16px 5px 16px 5px;
}

span {
  font-size: 14px !important;
}

/* Adjust column widths */
:deep(.col1-requester) {
  max-width: 150px !important;
}

:deep(.col1-co_category) {
  max-width: 150px !important;
}

:deep(.col1-co_name) {
  min-width: 200px !important;
}

:deep(.col1-co_address) {
  min-width: 300px !important;
}

:deep(.col1-reg_date) {
  max-width: 120px !important;
}

:deep(.col1-role) {
  max-width: 100px !important;
}

:deep(.col1-manager) {
  max-width: 150px !important;
}

:deep(.col1-executive_name) {
  max-width: 150px !important;
}

:deep(.col1-end_date) {
  max-width: 120px !important;
}

:deep(.col1-remaining_period) {
  max-width: 120px !important;
}

/* b-pagination 스타일 조정 */
.pagination .page-link {
  padding: 0.3rem 0.7rem !important;
  /* 원하는 크기로 조정 */
  font-size: 1rem !important;
  /* 글자 크기 조정 */
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
}

.pagination .active .page-link {
  background-color: #6c757d !important;
  border-color: #6c757d !important;
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
  content: "\f0dc";
  /* FontAwesome icon for up and down arrows */
}
</style>
