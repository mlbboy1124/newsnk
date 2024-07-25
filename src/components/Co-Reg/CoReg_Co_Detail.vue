<template>
    <div class="container mt-5">
        <h2 class="text-center mb-4">법인 상세 정보</h2>
        <div class="table-responsive rounded shadow-sm p-4">
            <table class="table table-borderless">
                <tbody>
                    <tr>
                        <th><label for="manager">담당자</label></th>
                        <td>{{ company.manager }}</td>
                        <th><label for="manager_mail">담당자 이메일</label></th>
                        <td>{{ company.manager_mail }}</td>
                        <th><label for="manager_tel">담당자 연락처</label></th>
                        <td>{{ company.manager_tel }}</td>
                    </tr>
                </tbody>
            </table>
            <hr>
            <h5 class="text-center mb-4">기본사항</h5>
            <table class="table table-borderless">
                <tbody>
                    <tr>
                        <th><label for="requester">소개구분</label></th>
                        <td>{{ company.requester }}</td>
                        <th><label for="co_category">법인구분</label></th>
                        <td>{{ company.co_category }}</td>
                        <th><label for="reg_date">회사 설립일</label></th>
                        <td>{{ company.reg_date }}</td>
                    </tr>
                    <tr>
                        <th><label for="reg_number">등기번호</label></th>
                        <td>{{ company.reg_number }}</td>
                        <th><label for="co_number">법인등록번호</label></th>
                        <td>{{ company.co_number }}</td>
                        <th><label for="branchoffice_active">지점유무</label></th>
                        <td>{{ company.branchoffice_active ? '있음' : '없음' }}</td>
                    </tr>
                    <tr>
                        <th><label for="co_name">상호</label></th>
                        <td colspan="3">
                            <span style="font-size:14px !important" v-if="company.category_rocation === 'front'">{{
                                company.co_category }}&nbsp;</span>{{ company.co_name }}
                            <span style="font-size:14px !important" v-if="company.category_rocation === 'back'">&nbsp;{{
                                company.co_category }}</span>
                        </td>
                        <th><label for="eng_name">영문상호</label></th>
                        <td>{{ company.eng_name }}</td>
                    </tr>
                    <tr>
                        <th><label for="co_address">본점주소</label></th>
                        <td colspan="5">{{ company.co_address }}</td>
                    </tr>
                    <tr>
                        <th><label for="announcement">공고방법</label></th>
                        <td colspan="5">{{ company.announcement }}</td>
                    </tr>
                </tbody>
            </table>
            <hr>
            <table class="table table-borderless">
                <tbody>
                    <tr>
                        <th><label for="stock_total_amount">발행할 주식의 총수</label></th>
                        <td>{{ formatNumber(company.stock_total_amount) }}</td>
                        <th><label for="stock_price">1주의 금액</label></th>
                        <td>{{ formatNumber(company.stock_price) }}</td>
                    </tr>
                    <tr>
                        <th><label for="stock_amount">발행주식의 총수</label></th>
                        <td>{{ formatNumber(company.stock_amount) }}</td>
                        <th><label for="capital">자본금의 액</label></th>
                        <td>{{ formatNumber(company.capital) }}</td>
                    </tr>
                </tbody>
            </table>
            <hr>
            <table class="table table-borderless">
                <tbody>
                    <tr>
                        <th class="purpose"><label for="purpose">사업목적</label></th>
                        <td class="purpose_cell" colspan="7">{{ company.purpose }}</td>
                    </tr>
                </tbody>
            </table>
            <hr>
            <table class="table table-borderless">
                <tbody>
                    <tr>
                        <td></td>
                        <th><label for="co_settlement_month">정관상 결산월</label></th>
                        <td>{{ company.co_settlement_month }}</td>
                        <td style="text-align: left;">월</td>
                        <th><label for="purpose">정관상 임기</label></th>
                        <td>{{ company.co_period }}</td>
                        <td style="text-align: left;">년</td>
                        <td></td>
                    </tr>
                </tbody>
            </table>
            <hr>
            <div class="executive-group">
                <h5 class="text-center mb-4">임원 정보</h5>
                <ul class="list-group mb-2">
                    <li v-for="(executive, index) in company.executives" :key="index" class="list-group-item">
                        <b-row>
                            <b-col md="1"><label><strong>직책</strong></label>
                                <p>{{ executive.role }}</p>
                            </b-col>
                            <b-col md="1"><label><strong>성명</strong></label>
                                <p>{{ executive.name }}</p>
                            </b-col>
                            <b-col md="2"><label><strong>주민번호</strong></label>
                                <p>{{ executive.number }}</p>
                            </b-col>
                            <b-col md="2"><label><strong>취임일</strong></label>
                                <p>{{ executive.reg_date }}</p>
                            </b-col>
                            <b-col md="2"><label><strong>임기만료일</strong></label>
                                <p>{{ executive.end_date }}</p>
                            </b-col>
                            <b-col md="2"><label><strong>남은기간(일)</strong></label>
                                <p :class="getRemainingTermClass(executive.remaining_term)">{{ executive.remaining_term }}</p>
                            </b-col>
                            <b-col md="1"><label><strong>대표권</strong></label>
                                <p>{{ executive.representation ? '있음' : '없음' }}</p>
                            </b-col>
                        </b-row>
                        <b-row v-if="executive.representation">
                            <b-col style="padding-left: 30px;" md="12"><label><strong>주소</strong></label>
                                <p>{{ executive.address }}</p>
                            </b-col>
                        </b-row>
                    </li>
                </ul>
            </div>
            <hr>
            <div class="shareholder-group">
                <h5 class="text-center mb-4">주주 정보</h5>
                <ul class="list-group mb-3">
                    <li v-for="(shareholder, index) in company.shareholders" :key="index" class="list-group-item">
                        <b-row>
                            <b-col md="1"><label><strong>이름</strong></label>
                                <p>{{ shareholder.name }}</p>
                            </b-col>
                            <b-col md="2"><label><strong>주민번호</strong></label>
                                <p>{{ shareholder.number }}</p>
                            </b-col>
                            <b-col md="2"><label><strong>보유주식수</strong></label>
                                <p>{{ formatNumber(shareholder.stockamount) }}</p>
                            </b-col>
                            <b-col md="7"><label><strong>주소</strong></label>
                                <p>{{ shareholder.address }}</p>
                            </b-col>
                        </b-row>
                    </li>
                </ul>
            </div>
            <hr>
            <div class="branchoffice-group" v-if="company.branchoffice_active">
                <h5 class="text-center mb-4">지점 정보</h5>
                <ul class="list-group mb-3">
                    <li v-for="(branchoffice, index) in company.branchoffices" :key="index" class="list-group-item">
                        <b-row>
                            <b-col md="2"><label><strong>이름</strong></label>
                                <p>{{ branchoffice.name }}</p>
                            </b-col>
                            <b-col md="2"><label><strong>설치일</strong></label>
                                <p>{{ branchoffice.reg_date }}</p>
                            </b-col>
                            <b-col md="8"><label><strong>주소</strong></label>
                                <p>{{ branchoffice.address }}</p>
                            </b-col>
                        </b-row>
                    </li>
                </ul>
            </div>

            <div class="d-flex justify-content-end">
                <button type="button" class="btn btn-primary mx-1" @click="editCompany">수정</button>
                <button class="btn btn-danger mx-1" @click="deleteCompany">삭제</button>
                <button type="button" class="btn btn-secondary mx-1" @click="goBack">뒤로가기</button>
                
            </div>
        </div>
    </div>
</template>

<script>
import { reactive } from 'vue';
import axios from '@/axios';
import { useRouter } from 'vue-router';
import { format } from 'date-fns'; // date-fns 임포트


export default {
    props: ['company_id'],
    setup(props) {
        const router = useRouter();
        const company = reactive({
            requester: '',
            co_category:'',
            custom_co_category:'',
            reg_number: '',
            co_number: '',
            category_rocation: '',
            co_name: '',
            eng_name: '',
            reg_date: '',
            co_address: '',
            announcement: '',
            stock_price: '',
            stock_total_amount: '',
            stock_amount: '',
            capital: '',
            purpose: '',
            manager: '',
            manager_mail: '',
            manager_tel: '',
            branchoffice_active: false,
            co_settlement_month: '',
            co_period:'',
            co_custom_period:'',
            executives: [],
            shareholders: [],
            branchoffices: [],
        });

        loadCompanybyid(props.company_id);

        async function loadCompanybyid(company_id) {
            try {
                const response_co = await axios.get(`/api/co/${company_id}`);
                const response_ex = await axios.get(`/api/co/${company_id}/executives`);
                const response_sh = await axios.get(`/api/co/${company_id}/shareholders`);
                const response_br = await axios.get(`/api/co/${company_id}/branchoffices`);

                Object.assign(company, response_co.data);
                Object.assign(company, { executives: response_ex.data });
                Object.assign(company, { shareholders: response_sh.data });
                Object.assign(company, { branchoffices: response_br.data });

                if (company.co_category === 'custom') {
                    company.co_category = company.custom_co_category;
                }

                if (company.co_period === 'custom') {
                    company.co_period = company.co_custom_period;
                }

                // Calculate end dates for executives
                company.executives.forEach(executive => {
                    if (executive.role === '감사') {
                        executive.end_date = format(calculateAuditorEndDate(executive.reg_date), 'yyyy-MM-dd');
                    } else {
                        executive.end_date = format(calculateEndDate(executive.reg_date), 'yyyy-MM-dd');
                    }
                    executive.remaining_term = calculateRemainingTerm(executive.end_date);
                });

            } catch (error) {
                console.error('법인 정보를 불러오는 중에 오류가 발생했습니다:', error);
            }
        }

        function calculateEndDate(startDate) {
            const start = new Date(startDate);
            start.setFullYear(start.getFullYear() + parseInt(company.co_period));
            return start;
}

        function calculateAuditorEndDate(startDate) {
            const start = new Date(startDate);
            start.setFullYear(start.getFullYear() + parseInt(company.co_period));
            if(company.co_settlement_month > 9){
                const settlement_month = company.co_settlement_month - 12
                start.setMonth(parseInt(settlement_month) + 3); // co_settlement_month의 3개월을 더함
            }
            else{
                start.setMonth(parseInt(company.co_settlement_month) + 3); // co_settlement_month의 3개월을 더함
            } 
            start.setDate(0); // 해당 월의 말일
            return start;
        }

        function calculateRemainingTerm(endDate) {
            const end = new Date(endDate);
            const now = new Date();
            // diffTime이 음수인 경우 이미 임기가 종료된 것이므로 남은 기간을 계산하지 않음
            const diffTime = end - now;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return diffDays > 0 ? `${diffDays}일 남음` : '임기 종료';
        }

        function formatNumber(value) {
            if (value === undefined || value === null) {
                return '';
            }
            return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        }

        function goBack() {
            router.push({ name: 'CoReg_Companies' });
        }

        function getRemainingTermClass(remainingTerm) {
            const daysRemaining = parseInt(remainingTerm.split('일 남음')[0], 10);
            if (remainingTerm === '임기 종료') {
                return 'text-danger font-weight-bold';
            } else if (daysRemaining <= 15) {
                return 'text-orange font-weight-bold';
            }
            return '';
        }

        function deleteCompany() {
            const company_id = props.company_id;
            console.log(company_id);
            if (confirm("이 법인을 삭제하시겠습니까?")) {
                try {
                    axios.delete(`/api/co/${company_id}`);
                    alert("법인이 삭제되었습니다.");
                    router.push({ name: 'CoReg_Companies' });
                } catch (error) {
                    console.error("법인 삭제 중 오류가 발생했습니다:", error.response ? error.response.data : error.message);
                    alert("법인 삭제 중 오류가 발생했습니다.");
                }
            }
        }

        function editCompany() {
            router.push({ name: 'CoReg_Co_Edit', params: { company_id: props.company_id } });
        }

        return {
            company,
            formatNumber,
            goBack,
            editCompany,
            getRemainingTermClass,
            deleteCompany,
        };
    },
};
</script>

<style scoped>
.container {
    max-width: 1000px;
    min-width: 800px;
    font-size: 14px;
}

h5 {
    margin-bottom: 1.5rem;
}

hr {
    margin: 2rem 0;
}

.table th,
.table td {
    vertical-align: middle;
    text-align: center;
    padding: 10px 3px 10px 3px;
}

.table th {
    background-color: #e9e9e9;
    width: 117px;
}

.table td {
    min-width: 100px;
}

.purpose_cell {
    padding-left: 60px !important;
    text-align: left !important;
    word-wrap: break-word;
    white-space: pre-wrap;
}

.text-danger {
    color: red;
}

.text-orange {
    color: orange;
}

.font-weight-bold {
    font-weight: bold;
}
</style>
