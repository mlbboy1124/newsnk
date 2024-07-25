<template>
  <div class="container mt-5">
    <h2 class="text-center" style="margin-bottom:30px;">부동산등기 {{ isEdit ? '수정' : '작성' }}</h2>
    <div class="form-box">
      <form @submit.prevent="saveRealreg" style="width:60%">
        <div class="form-row">
          <div class="form-group col">
            <label for="requester">구분</label>
            <input type="text" class="form-control" id="requester" v-model="realreg.requester" required>
          </div>
          <div class="form-group col">
            <label for="division">등기구분</label>
            <input type="text" class="form-control" id="division" v-model="realreg.division" required>
          </div>
          <div class="form-group col">
            <label for="contract_date">계약일</label>
            <input type="date" class="form-control" id="contract_date" v-model="realreg.contract_date" required
              max="9999-12-31">
          </div>
          <div class="form-group col">
            <label for="settlement_date">잔금일</label>
            <input type="date" class="form-control" id="settlement_date" v-model="realreg.settlement_date" required
              max="9999-12-31">
          </div>
        </div>
        <div class="form-row">
          <div class="form-group col">
            <label for="sell_price">기준금액</label>
            <input type="text" class="form-control" id="sell_price" :value="formatNumber(realreg.sell_price)"
              @input="updateSellPrice" required>
          </div>
          <div class="form-group col">
            <label for="public_price">시가표준액</label>
            <input type="text" class="form-control" id="public_price" :value="formatNumber(realreg.public_price)"
              @input="updatePublicPrice" required>
          </div>
          <div class="form-group col">
            <label for="settlement_time">잔금시간</label>
            <input type="time" class="form-control" id="settlement_time" v-model="realreg.settlement_time" required>
          </div>
          <div class="form-group col">
            <label for="repayment_status">상환</label>
            <select class="form-control" id="repayment_status" v-model="realreg.repayment_status" required>
              <option value="">선택하세요</option>
              <option value="O">상환있음</option>
              <option value="X">상환없음</option>
            </select>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group col">
            <label for="submitTax">취득세</label>
            <input type="text" class="form-control" id="submitTax" :value="formatNumber(realreg.submitTax)"
              @input="updateSubmitTax" required>
          </div>
          <div class="form-group col">
            <label for="eduTax">교육세</label>
            <input type="text" class="form-control" id="eduTax" :value="formatNumber(realreg.eduTax)"
              @input="updateEduTax" required>
          </div>
          <div class="form-group col">
            <label for="ruralTax">농특세</label>
            <input type="text" class="form-control" id="ruralTax" :value="formatNumber(realreg.ruralTax)"
              @input="updateRuralTax">
          </div>
        </div>
        <div class="form-row">
          <div class="form-group col">
            <label for="manager">담당자</label>
            <input type="text" class="form-control" id="manager" v-model="realreg.manager" required>
          </div>
          <div class="form-group col">
            <label for="registration_date">등록일</label>
            <input type="date" class="form-control" id="registration_date" v-model="realreg.registration_date" max="9999-12-31" required>
          </div>
          <div class="form-group col">
            <label for="effect">감면사항</label>
            <select class="form-control" id="effect" v-model="realreg.effect" required>
              <option value="">선택하세요</option>
              <option value="null">없음</option>
              <option value="first">생애최초주택</option>
              <option value="newborn">신생아감면</option>
            </select>
          </div>
        </div>
        <div class="form-group">
          <label for="transaction_address">거래주소</label>
          <input type="text" class="form-control" id="transaction_address" v-model="realreg.transaction_address"
            required>
        </div>
        <div class="form-group">
          <label for="realestate_view">부동산의 표시</label>
          <textarea class="form-control" id="realestate_view" v-model="realreg.realestate_view"></textarea>
        </div>
        <div class="form-group">
          <label for="memo">참고사항</label>
          <textarea class="form-control" id="memo" v-model="realreg.memo"></textarea>
        </div>
        <hr>
        <div class="seller-group">
          <h5 class="text-center" style="margin-bottom:10px;">매도인(등기의무자) 정보</h5>
          <div v-for="(seller, index) in realreg.sellers" :key="index" class="seller-info">
            <div class="form-row">
              <div class="form-group col">
                <label for="seller">매도인</label>
                <input type="text" class="form-control" v-model="seller.name" required>
              </div>
              <div class="form-group col">
                <label for="seller_number">매도인 주민번호</label>
                <input type="text" class="form-control" v-model="seller.number" required>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group col">
                <label for="seller_address">주소</label>
                <input type="text" class="form-control" v-model="seller.address" required>
              </div>
              <div class="form-group col-1 d-flex align-items-center">
                <button v-if="realreg.sellers.length > 1" type="button" class="btn btn-outline-danger btn-sm"
                  @click="removeSeller(index)">삭제</button>
              </div>
            </div>
          </div>
          <div class="d-flex justify-content-end">
            <button type="button" class="btn btn-outline-primary btn-sm" @click="addSeller">매도인(등기의무자) 추가</button>
          </div>
        </div>
        <hr>
        <div class="buyer-group">
          <h5 class="text-center">매수인(등기권리자) 정보</h5>
          <div v-for="(buyer, index) in realreg.buyers" :key="index" class="buyer-info">
            <div class="form-row">
              <div class="form-group col">
                <label for="buyer">이름</label>
                <input type="text" class="form-control" v-model="buyer.name" required>
              </div>
              <div class="form-group col">
                <label for="buyer_number">주민번호</label>
                <input type="text" class="form-control" v-model="buyer.number" required>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group col">
                <label for="buyer_address">주소</label>
                <input type="text" class="form-control" v-model="buyer.address" required>
              </div>
              <div class="form-group col-1 d-flex align-items-center">
                <button v-if="realreg.buyers.length > 1" type="button" class="btn btn-outline-danger btn-sm"
                  @click="removeBuyer(index)">삭제</button>
              </div>
            </div>
          </div>
          <div class="d-flex justify-content-end">
            <button type="button" class="btn btn-outline-primary btn-sm" @click="addBuyer">매수인(등기권리자) 추가</button>
          </div>
        </div>
        <hr>

        <div class="d-flex justify-content-end">
          <button type="submit" class="btn btn-primary mx-1">{{ isEdit ? '수정' : '작성' }}</button>
          <button type="button" class="btn btn-secondary mx-1" @click="goBack">취소</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue';
import axios from '@/axios';
import { useRouter } from 'vue-router';


export default {
  props: ['realreg_id'],
  setup(props) {
    const router = useRouter();
    const isEdit = ref(false);
    const realreg = reactive({
      requester: '',
      division: '',
      registrationDate: new Date().toISOString().substr(0, 10), // 오늘 날짜로 기본값 설정
      contract_date: '',
      settlement_date: '',
      settlement_time: '',
      repayment_status: '',
      sell_price: '',
      public_price: '',
      transaction_address: '',
      buyers: [{ name: '', number: '', address: '' }],
      sellers: [{ name: '', number: '', address: '' }],
      manager: '',
      effect: '',
      memo: '',
      realestate_view: '',
      submitTax: 0,
      eduTax: 0,
      ruralTax: 0,
    });

    if (props.realreg_id) {
      isEdit.value = true;
      loadRealregbyid(props.realreg_id);
    }

    async function loadRealregbyid(realreg_id) {
      try {
        const response = await axios.get(`/api/realregs/${realreg_id}`);
        Object.assign(realreg, response.data);
      } catch (error) {
        console.error('부동산 등기정보를 불러오는 중에 오류가 발생했습니다:', error);
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

    function updateSellPrice(event) {
      const value = parseNumber(event.target.value);
      realreg.sell_price = isNaN(value) ? 0 : value;
    }

    function updatePublicPrice(event) {
      const value = parseNumber(event.target.value);
      realreg.public_price = isNaN(value) ? 0 : value;
    }

    function updateSubmitTax(event) {
      const value = parseNumber(event.target.value);
      realreg.submitTax = isNaN(value) ? 0 : value;
    }

    function updateEduTax(event) {
      const value = parseNumber(event.target.value);
      realreg.eduTax = isNaN(value) ? 0 : value;
    }

    function updateRuralTax(event) {
      const value = parseNumber(event.target.value);
      realreg.ruralTax = isNaN(value) ? 0 : value;
    }

    function addBuyer() {
      realreg.buyers.push({ name: '', number: '', address: '' });
    }

    function removeBuyer(index) {
      if (realreg.buyers.length > 1) {
        realreg.buyers.splice(index, 1);
      }
    }

    function addSeller() {
      realreg.sellers.push({ name: '', number: '', address: '' });
    }

    function removeSeller(index) {
      if (realreg.sellers.length > 1) {
        realreg.sellers.splice(index, 1);
      }
    }

    async function saveRealreg() {
      try {
        if (realreg.submitTax === 0) {
          realreg.submitTax = null;
        }
        if (realreg.eduTax === 0) {
          realreg.eduTax = null;
        }
        if (realreg.ruralTax === 0) {
          realreg.ruralTax = null;
        }

        let response;
        if (isEdit.value) {
          response = await axios.put(`/api/realregs/${realreg.realreg_id}`, realreg);
          if (response.status === 200) {
            alert('부동산등기 수정 완료');
          } else {
            alert('부동산등기 수정 실패');
          }
        } else {
          response = await axios.post('/api/realregs', realreg);
          if (response.status === 201) {
            alert('부동산등기 작성 완료');
          } else {
            alert('부동산등기 작성 실패');
          }
        }
        const realreg_id = isEdit.value ? realreg.realreg_id : response.data.realreg_id;
        router.push({ name: 'RealRegDetail', params: { realreg_id } });
      } catch (error) {
        console.error('Error saving realreg:', error);
        alert('부동산등기 저장 중 오류가 발생했습니다.');
      }
    }

    function goBack() {
      router.go(-1);
    }

    return {
      isEdit,
      realreg,
      formatNumber,
      updateSellPrice,
      updatePublicPrice,
      updateSubmitTax,
      updateEduTax,
      updateRuralTax,
      addBuyer,
      removeBuyer,
      addSeller,
      removeSeller,
      saveRealreg,
      goBack,
    };
  },
};
</script>

<style scoped>
.container{
  min-width: 1000px;
}
.form-box {
  padding: 50px 0px 50px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 50px;
  background-color: #fbfbfb;
  min-width: 1000px;
}

.buyer-group,
.seller-group {
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
</style>