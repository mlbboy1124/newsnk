<template>
  <div class="container mt-4 small-text-table-container">
    <div class="row justify-content-between mb-3">
      <div class="col-auto">
        <b-input-group>
          <b-form-input v-model="searchQuery" @input="onSearch" placeholder="검색어를 입력하세요"></b-form-input>
        </b-input-group>
      </div>
      <div class="col-auto">
        <b-button variant="outline-primary" class="mx-1" @click="createCo">법인 추가</b-button>
      </div>
    </div>

    <b-table :items="filteredcompanies" :fields="fields" v-model:sortBy="sortBy" v-model:sortAsc.sync="sortAsc"
      sort-icon-left @row-clicked="viewCompany" hover responsive="sm" class="small-text-table">
    </b-table>
    <div class="d-flex justify-content-between align-items-center mt-3">
      <b-pagination id="pagination" v-model="currentPage" :total-rows="companies.length"
        :per-page="companiesPerPage" aria-controls="my-table"></b-pagination>
      <span>Showing 1 to 10 of {{ companies.length }} entries</span>
    </div>
  </div>
</template>

<script>
import axios from '@/axios';

export default {
    name: 'CoReg_companies',
    data() {
        return {
            sortBy: 'co_name',
            sortAsc: true,
            searchQuery: '',
            fields: [
                { key: 'requester', label: '소개구분', thClass: 'col1-requester', tdClass: 'col1-requester'},
                { key: 'co_category', label: '법인구분', thClass: 'col1-co_category', tdClass: 'col1-co_category'},
                { key: 'co_name', label: '상호', thClass: 'col1-co_name', tdClass: 'col1-co_name', sortable: true },
                { key: 'co_address', label: '본점소재지', thClass: 'col1-co_address', tdClass: 'col1-co_address'},
                { key: 'reg_date', label: '설립일', thClass: 'col1-reg_date', tdClass: 'col1-reg_date'},
                { key: 'manager', label: '담당자', thClass: 'col1-manager', tdClass: 'col1-manager'},
            ],
            companies: [],
            currentPage: 1,
            companiesPerPage: 10
        };
    },
    computed: {
    filteredcompanies() {
        let filtered = this.companies.filter(company => {
            return Object.values(company).some(value =>
                String(value).toLowerCase().includes(this.searchQuery.toLowerCase())
            );
        });
        
        // co_category가 custom일 때 custom_co_category로 대체
        filtered = filtered.map(company => {
            if (company.co_category === 'custom') {
                return { ...company, co_category: company.custom_co_category };
            }
            return company;
        });
        
        const start = (this.currentPage - 1) * this.companiesPerPage;
        const end = this.currentPage * this.companiesPerPage;
        return filtered.slice(start, end);
    },
    },
    created() {
        this.fetchcompanies();
    },
    methods: {
        async fetchcompanies() {
            try {
                const response = await axios.get('/api/co');
                this.companies = response.data;
            } catch (error) {
                console.error("법인 목록을 불러오는 중에 오류가 발생했습니다:", error.response ? error.response.data : error.message);
            }
        },
        formattedValue(value) {
            return value === null || value === undefined ? '' : new Intl.NumberFormat().format(value);
        },
        onSearch() {
            this.currentPage = 1;
        },
        viewCompany(company) {
            this.$router.push({ name: 'CoReg_Co_Detail', params: { company_id: company.company_id} });
        },
        createCo() {
            this.$router.push({ name: 'CoReg_Co_Edit' });
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

span {font-size: 14px !important;}

/* Adjust column widths */
:deep(.col1-requester) {max-width: 150px !important;}
:deep(.col1-co_category) {max-width: 150px !important;}
:deep(.col1-co_name) {min-width: 200px !important;}
:deep(.col1-co_address) {min-width: 300px !important;}
:deep(.col1-reg_date) {max-width: 120px !important;}
:deep(.col1-manager) {max-width: 150px !important;}


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