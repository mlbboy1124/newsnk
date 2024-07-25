<template>
  <div class="container mt-5">
    <h2 class="text-center" style="margin-bottom:30px;">법인내용 {{ isEdit ? '수정' : '작성' }}</h2>
    <div class="form-box">
      <form @submit.prevent="saveCompany" style="width:70%">
        <div class="form-row">
          <div class="form-group col">
            <label for="requester">소개구분</label>
            <input type="text" class="form-control" id="requester" v-model="company.requester" required>
          </div>
          <div class="form-group col">
            <label for="co_category">법인구분</label>
            <div v-if="company.co_category !== 'custom'">
              <select class="form-control" id="co_category" v-model="company.co_category" required>
                <option value="" disabled>선택하세요</option>
                <option value="주식회사">주식회사</option>
                <option value="유한회사">유한회사</option>
                <option value="농업회사법인">농업회사법인</option>
                <option value="사단법인">사단법인</option>
                <option value="재단법인">재단법인</option>
                <option value="custom">직접입력</option>
              </select>
            </div>
            <div v-else style="display: flex; align-items: center;">
              <input type="text" class="form-control" v-model="company.custom_co_category" placeholder="직접입력" />
              <button type="button" class="btn btn-outline-danger btn-sm" @click="resetCategory">X</button>
            </div>
          </div>
          <div class="form-group col">
            <label for="reg_number">등기번호</label>
            <input type="text" class="form-control" id="reg_number" v-model="company.reg_number">
          </div>
          <div class="form-group col">
            <label for="co_number">법인등록번호</label>
            <input type="text" class="form-control" id="co_number" v-model="company.co_number">
          </div>
          <div class="form-group col-md-1">
            <label for="branchoffice_active">지점유무</label>
            <div class="form-check">
              <input type="checkbox" class="form-check-input large-checkbox" v-model="company.branchoffice_active">
            </div>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group col-md-2">
            <label for="co_name">법인구분위치</label>
            <select class="form-control" id="category_rocation" v-model="company.category_rocation" required>
              <option value="" disabled>선택</option>
              <option value="front">앞</option>
              <option value="back">뒤</option>
            </select>
          </div>
          <div class="form-group col">
            <label for="co_name">상호</label>
            <input type="text" class="form-control" id="co_name" v-model="company.co_name" required>
          </div>
          <div class="form-group col">
            <label for="eng_name">영문상호</label>
            <input type="text" class="form-control" id="eng_name" v-model="company.eng_name">
          </div>
          <div class="form-group col-md-2">
            <label for="reg_date">회사 설립일</label>
            <input type="date" class="form-control" id="reg_date" v-model="company.reg_date" max="9999-12-31" required>
          </div>
        </div>
        <div class="form-group">
          <label for="co_address">본점주소</label>
          <input type="text" class="form-control" id="co_address" v-model="company.co_address" required>
        </div>
        <div class="form-group">
          <label for="announcement">공고방법</label>
          <input type="text" class="form-control" id="announcement" v-model="company.announcement" required>
        </div>
        <hr>
        <div class="form-row">
          <div class="form-group col">
            <label for="stock_price">1주의 금액</label>
            <input type="text" class="form-control" id="stock_price" :value="formatNumber(company.stock_price)"
              @input="update_stock_price" required>
          </div>
          <div class="form-group col">
            <label for="stock_total_amount">발행할 주식의 총수</label>
            <input type="text" class="form-control" id="stock_total_amount"
              :value="formatNumber(company.stock_total_amount)" @input="update_stock_total_amount" required>
          </div>
          <div class="form-group col">
            <label for="stock_amount">발행주식의 총수</label>
            <input type="text" class="form-control" id="stock_amount" :value="formatNumber(company.stock_amount)"
              @input="update_stock_amount" required>
          </div>
          <div class="form-group col">
            <label for="capital">자본금의 액</label>
            <input type="text" class="form-control" id="capital" :value="formatNumber(company.capital)"
              @input="update_capital" required>
          </div>
        </div>
        <hr>
        <div class="form-group">
          <label for="purpose">사업목적</label>
          <textarea class="form-control" id="purpose" v-model="company.purpose" required></textarea>
        </div>
        <hr>
        <div class="form-row">
          <div class="form-group col">
            <label for="manager">담당자</label>
            <input type="text" class="form-control" id="manager" v-model="company.manager" required>
          </div>
          <div class="form-group col">
            <label for="manager_mail">담당자 이메일</label>
            <input type="text" class="form-control" id="manager_mail" v-model="company.manager_mail">
          </div>
          <div class="form-group col">
            <label for="manager_tel">담당자 연락처</label>
            <input type="text" class="form-control" id="manager_tel" v-model="company.manager_tel" required>
          </div>
        </div>
        <hr>
        <div class="form-row">
          <div class="form-group col">
            <label for="co_settlement_month">정관상 결산월</label>
            <select class="form-control" id="co_settlement_month" v-model="company.co_settlement_month" required>
              <option value="1">1월</option>
              <option value="2">2월</option>
              <option value="3">3월</option>
              <option value="4">4월</option>
              <option value="5">5월</option>
              <option value="6">6월</option>
              <option value="7">7월</option>
              <option value="8">8월</option>
              <option value="9">9월</option>
              <option value="10">10월</option>
              <option value="11">11월</option>
              <option value="12">12월</option>
            </select>
          </div>
          <div class="form-group col">
            <label for="co_period">정관상 임원임기</label>
            <div v-if="company.co_period !== 'custom'">
              <select class="form-control" id="co_period" v-model="company.co_period" required>
                <option value="1">1년</option>
                <option value="2">2년</option>
                <option value="3">3년</option>
                <option value="custom">직접입력</option>
              </select>
            </div>
            <div v-else style="display: flex; align-items: center;">
              <input type="text" class="form-control" v-model="company.co_custom_period" placeholder="직접입력(숫자만 입력)" />
              <button type="button" class="btn btn-outline-danger btn-sm" @click="resetPeriod">X</button>
            </div>
          </div>
        </div>
        <hr>
        <div class="executive-group">
          <h5 class="text-center" style="margin-bottom:30px;">임원 정보</h5>
          <div v-for="(executive, index) in company.executives" :key="index" class="executive-info">
            <div class="form-row">
              <div class="form-group col">
                <label for="executive_role">직책</label>
                <select class="form-control" v-model="executive.role" required>
                  <option value="사내이사">사내이사</option>
                  <option value="대표이사">대표이사</option>
                  <option value="감사">감사</option>
                  <option value="사외이사">사외이사</option>
                  <option value="기타비상무이사">기타비상무이사</option>
                  <option value="청산인">청산인</option>
                </select>
              </div>
              <div class="form-group col">
                <label for="executive_name">성명</label>
                <input type="text" class="form-control" v-model="executive.name" required>
              </div>
              <div class="form-group col">
                <label for="executive_number">주민번호</label>
                <input type="text" class="form-control" v-model="executive.number" required>
              </div>
              <div class="form-group col">
                <label for="executive_reg_date">취임일</label>
                <input type="date" class="form-control" id="executive_reg_date" v-model="executive.reg_date"
                  max="9999-12-31" required>
              </div>
              <div class="form-group col-md-1">
                <label for="executive_representation">대표권</label>
                <div class="form-check">
                  <input type="checkbox" class="form-check-input large-checkbox" v-model="executive.representation">
                </div>
              </div>
              <div class="form-group col-1 d-flex align-items-center">
                <button v-if="company.executives.length > 1" type="button" class="btn btn-outline-danger btn-sm"
                  @click="removeExecutive(index)">삭제</button>
              </div>
            </div>
            <div class="form-row" v-if="executive.representation">
              <div class="form-group col">
                <label for="executive_address">주소</label>
                <input type="text" class="form-control" v-model="executive.address" required>
              </div>
              <div class="form-group col-md-1"></div>
            </div>
          </div>
          <div class="d-flex justify-content-end">
            <button type="button" class="btn btn-outline-primary btn-sm" @click="addExecutive">임원 추가</button>
          </div>
        </div>
        <hr>
        <div class="shareholder-group">
          <h5 class="text-center" style="margin-bottom:30px;">주주 정보</h5>
          <div v-for="(shareholder, index) in company.shareholders" :key="index" class="shareholder-info">
            <div class="form-row">
              <div class="form-group col">
                <label for="shareholder_name">이름</label>
                <input type="text" class="form-control" v-model="shareholder.name" required>
              </div>
              <div class="form-group col">
                <label for="shareholder_number">주민번호</label>
                <input type="text" class="form-control" v-model="shareholder.number">
              </div>
              <div class="form-group col">
                <label for="shareholder_stockamount">보유주식수</label>
                <input type="text" class="form-control" :value="formatNumber(shareholder.stockamount)"
                  @input="update_sh_stock_amount(index, $event.target.value)" required>
              </div>
              <div class="form-group col-md-1"></div>
            </div>
            <div class="form-row">
              <div class="form-group col">
                <label for="shareholder_address">주소</label>
                <input type="text" class="form-control" v-model="shareholder.address">
              </div>
              <div class="form-group col-1 d-flex align-items-center">
                <button v-if="company.shareholders.length > 1" type="button" class="btn btn-outline-danger btn-sm"
                  @click="removeShareholder(index)">삭제</button>
              </div>
            </div>
          </div>
          <div class="d-flex justify-content-end">
            <button type="button" class="btn btn-outline-primary btn-sm" @click="addShareholder">주주 추가</button>
          </div>
        </div>
        <hr>
        <div class="branchoffice-group" v-if="company.branchoffice_active">
          <h5 class="text-center" style="margin-bottom:30px;">지점 정보</h5>
          <div v-for="(branchoffice, index) in company.branchoffices" :key="index" class="branchoffice-info">
            <div class="form-row">
              <div class="form-group col">
                <label for="branchoffice_name">이름</label>
                <input type="text" class="form-control" v-model="branchoffice.name" required>
              </div>
              <div class="form-group col">
                <label for="branchoffice_reg_date">설치일</label>
                <input type="date" class="form-control" id="branchoffice_reg_date" v-model="branchoffice.reg_date"
                  max="9999-12-31" required>
              </div>
              <div class="form-group col-md-1"></div>
              <div class="form-group col-1 d-flex align-items-center">
                <button type="button" class="btn btn-outline-danger btn-sm"
                  @click="removeBranchoffice(index)">삭제</button>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group col">
                <label for="branchoffice_address">주소</label>
                <input type="text" class="form-control" v-model="branchoffice.address">
              </div>
            </div>
          </div>
          <div class="d-flex justify-content-end">
            <button type="button" class="btn btn-outline-primary btn-sm" @click="addBranchoffice">지점 추가</button>
          </div>
          <hr>
        </div>
        <div class="d-flex justify-content-end">
          <button type="submit" class="btn btn-primary mx-1">{{ isEdit ? '수정' : '작성' }}</button>
          <button type="button" class="btn btn-secondary mx-1" @click="goBack">취소</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, reactive, watch } from 'vue';
import axios from '@/axios';
import { useRouter } from 'vue-router';


export default {
  props: ['company_id'],
  setup(props) {
    const router = useRouter();
    const isEdit = ref(false);
    const company = reactive({
      requester: '',
      co_category: '', // 기본값을 빈 문자열로 설정
      custom_co_category: '',
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
      co_settlement_month: '12',  // 기본 값 설정
      co_period: '3',  // 기본 값 설정
      co_custom_period: '',
      executives: [{ role: '', name: '', number: '', reg_date: '', address: '', representation: false }],
      shareholders: [{ name: '', number: '', stockamount: '', address: '' }],
      branchoffices: [{ name: '', reg_date: '', address: '' }],
    });

    watch(() => company.co_period, (newVal) => {
      if (newVal !== 'custom') {
        company.co_custom_period = null;
      }
    });

    watch(() => company.co_category, (newVal) => {
      if (newVal !== 'custom') {
        company.custom_co_category = null;
      }
    });

    if (props.company_id) {
      isEdit.value = true;
      loadCompanybyid(props.company_id);
    }

    async function loadCompanybyid(company_id) {
      try {
        const response_co = await axios.get(`/api/co/${company_id}`);
        const response_ex = await axios.get(`/api/co/${company_id}/executives`);
        const response_sh = await axios.get(`/api/co/${company_id}/shareholders`);

        let response_br = { data: [] };
        if (response_co.data.branchoffice_active) {
          response_br = await axios.get(`/api/co/${company_id}/branchoffices`);
        }

        Object.assign(company, response_co.data);
        company.branchoffice_active = !!company.branchoffice_active; // 숫자를 불리언으로 변환
        company.executives = response_ex.data;
        company.shareholders = response_sh.data;
        company.branchoffices = response_br.data;

      } catch (error) {
        console.error('법인 정보를 불러오는 중에 오류가 발생했습니다:', error);
      }
    }


    function formatNumber(value) {
      if (value === undefined || value === null) {
        return '';
      }
      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    function parseNumber(value) {
      return parseInt(value.replace(/,/g, ''), 10);
    }

    function update_stock_price(event) {
      const value = parseNumber(event.target.value);
      company.stock_price = isNaN(value) ? 0 : value;
    }

    function update_stock_total_amount(event) {
      const value = parseNumber(event.target.value);
      company.stock_total_amount = isNaN(value) ? 0 : value;
    }

    function update_stock_amount(event) {
      const value = parseNumber(event.target.value);
      company.stock_amount = isNaN(value) ? 0 : value;
    }

    function update_capital(event) {
      const value = parseNumber(event.target.value);
      company.capital = isNaN(value) ? 0 : value;
    }

    function update_sh_stock_amount(index, value) {
      const parsedValue = parseNumber(value);
      company.shareholders[index].stockamount = isNaN(parsedValue) ? '' : parsedValue;
      event.target.value = formatNumber(company.shareholders[index].stockamount);
    }

    function addExecutive() {
      company.executives.push({ role: '', name: '', number: '', reg_date: '', address: '', representation: false });
    }

    function removeExecutive(index) {
      if (company.executives.length > 1) {
        company.executives.splice(index, 1);
      }
    }

    function addShareholder() {
      company.shareholders.push({ name: '', number: '', stockamount: '', address: '' });
    }

    function removeShareholder(index) {
      if (company.shareholders.length > 1) {
        company.shareholders.splice(index, 1);
      }
    }

    function addBranchoffice() {
      company.branchoffices.push({ name: '', reg_date: '', address: '' });
    }

    function removeBranchoffice(index) {
      company.branchoffices.splice(index, 1);
    }

    function resetCategory() {
      company.co_category = '';
    }

    function resetPeriod() {
      company.co_period = '';
    }

    async function saveCompany() {
      try {
        let response;
        let company_id = company.company_id;

        if (isEdit.value) {
          // 법인 정보 수정
          response = await axios.put(`/api/co/${company.company_id}`, company);
          // 임원 정보 수정
          response = await axios.put(`/api/co/${company.company_id}/executives`, { company_id: company.company_id, executives: company.executives });
          // 주주 정보 수정
          response = await axios.put(`/api/co/${company.company_id}/shareholders`, { company_id: company.company_id, shareholders: company.shareholders });
          // 지점 정보 수정
          if (company.branchoffice_active) {
            response = await axios.put(`/api/co/${company.company_id}/branchoffices`, { company_id: company.company_id, branchoffices: company.branchoffices });
          }
          if (response.status === 200) {
            alert('법인 정보 수정 완료');
          } else {
            alert('법인 정보 수정 실패');
          }
        } else {
          // 법인 정보 저장
          response = await axios.post('/api/co', company);
          company_id = response.data.company_id;
          // 임원 정보 저장
          response = await axios.post(`/api/co/${company_id}/executives`, { company_id, executives: company.executives });
          // 주주 정보 저장
          response = await axios.post(`/api/co/${company_id}/shareholders`, { company_id, shareholders: company.shareholders });
          // 지점 정보 저장
          if (company.branchoffice_active) {
            response = await axios.post(`/api/co/${company_id}/branchoffices`, { company_id, branchoffices: company.branchoffices });
          }
          if (response.status === 201) {
            alert('법인 정보 저장 완료');
          } else {
            alert('법인 정보 저장 실패');
          }
        }

        router.push({ name: 'CoReg_Co_Detail', params: { company_id } });
      } catch (error) {
        console.error('Error saving company:', error);
        alert('법인 저장 중 오류가 발생했습니다.');
      }
    }

    function goBack() {
      router.go(-1);
    }

    return {
      isEdit,
      company,
      formatNumber,
      update_stock_price,
      update_stock_total_amount,
      update_stock_amount,
      update_capital,
      update_sh_stock_amount,
      addExecutive,
      removeExecutive,
      addShareholder,
      removeShareholder,
      addBranchoffice,
      removeBranchoffice,
      saveCompany,
      goBack,
      resetCategory,
      resetPeriod,
    };
  },
};
</script>

<style scoped>
.container {
  min-width: 1200px;
}

.form-box {
  padding: 30px 0 30px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 50px;
  background-color: #fbfbfb;
  min-width: 1200px;
}

.executive-group,
.shareholder-group {
  margin-top: 30px;
}

.form-row {
  display: flex;
}

.col {
  padding: 5px;
}

.form-group {
  margin-bottom: 5px;
  padding: 0 5px 0 5px;
}

hr {
  margin: 30px 0 30px 0;
}

.large-checkbox {
  width: 25px;
  height: 25px;
}

.form-row {
  display: flex;
}

.form-check {
  margin-left: 10px;
}
</style>