<template>
  <div class="container mt-5">
    <h2 class="text-center" style="margin-bottom:60px;">부동산 상세페이지</h2>
    <div v-if="realreg" class="justify-content-center">
      <div>
        <h5 class="text-center" style="margin-bottom:10px;padding-right: 910px;">기초 정보</h5>
        <table id="maintable" class="table table-bordered maintable">
          <tbody>
            <tr>
              <th>구분</th>
              <td>{{ realreg.requester }}</td>
              <th>등기구분</th>
              <td>{{ realreg.division }}</td>
              <th>계약일</th>
              <td>{{ realreg.contract_date }}</td>
              <th>잔금일</th>
              <td>{{ realreg.settlement_date }}</td>
            </tr>
            <tr>
              <th>거래주소</th>
              <td colspan="3">{{ realreg.transaction_address }}</td>
              <th>현장담당자</th>
              <td>{{ realreg.manager }}</td>
              <th>잔금시간</th>
              <td class="lastcol">{{ formatTime(realreg.settlement_time) }}</td>

            </tr>
            <tr>
              <th>기준금액</th>
              <td>{{ formattedValue(realreg.sell_price) }}</td>
              <th>시가표준액</th>
              <td>{{ formattedValue(realreg.public_price) }}</td>
              <th>감면해당</th>
              <td>{{ effectDisplay }}</td>
              <th>상환</th>
              <td>{{ realreg.repayment_status }}</td>
            </tr>
            <tr>
              <th>취득세</th>
              <td>{{ formattedValue(realreg.submitTax) }}</td>
              <th>교육세</th>
              <td>{{ formattedValue(realreg.eduTax) }}</td>
              <th>농특세</th>
              <td>{{ formattedValue(realreg.ruralTax) }}</td>
              <th></th>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>

      <h5 class="text-center" style="margin-bottom:10px;padding-right: 500px;">매도인(등기의무자) 정보</h5>
      <table id="sub_table" class="table table-bordered sub_table">
        <tbody>
          <tr>
            <th>이름</th>
            <td>{{ sellerInfo.names }}</td>
            <th>주민번호</th>
            <td>{{ sellerInfo.numbers }}</td>
          </tr>
          <tr>
            <th>주소</th>
            <td colspan="3">{{ sellerInfo.addresses }}</td>
          </tr>
        </tbody>
      </table>

      <h5 class="text-center" style="margin-bottom:10px;padding-right: 500px;">매수인(등기권리자) 정보</h5>
      <table id="sub_table" class="table table-bordered sub_table">
        <tbody>
          <tr>
            <th>이름</th>
            <td>{{ buyerInfo.names }}</td>
            <th>주민번호</th>
            <td>{{ buyerInfo.numbers }}</td>
          </tr>
          <tr>
            <th>주소</th>
            <td colspan="3">{{ buyerInfo.addresses }}</td>
          </tr>
        </tbody>
      </table>

      <h5 class="text-center" style="margin-bottom:10px;padding-right: 630px;">참고사항</h5>
      <table id="sub_table" class="table table-bordered sub_table">
        <tbody>
          <tr>
            <th>참고사항</th>
            <td class="memo-cell">{{ realreg.memo }}</td>
          </tr>
        </tbody>
      </table>

      <h5 class="text-center" style="margin-bottom:10px;padding-right: 630px;">부동산의 표시</h5>
      <table id="sub_table" class="table table-bordered sub_table">
        <tbody>
          <tr>
            <th>부동산의 표시</th>
            <td class="memo-cell">{{ realreg.realestate_view }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="text-center" style="margin-top:60px; margin-bottom:100px">
      <button class="btn btn-outline-success mx-1" @click="createDocument">서류작성</button>
      <button class="btn btn-outline-dark mx-1" @click="createReceipt">영수증작성</button>
      <button class="btn btn-primary mx-1" @click="editRealreg">수정</button>
      <button class="btn btn-danger mx-1" @click="deleteRealreg">삭제</button>
      <button class="btn btn-secondary mx-1" @click="goBack">뒤로가기</button>
    </div>
  </div>
</template>

<script>
import axios from '@/axios';

export default {
  props: ['realreg_id'],
  data() {
    return {
      realreg: null
    };
  },
  created() {
    this.loadRealregbyid();
  },
  computed: {
    effectDisplay() {
      if (!this.realreg) return '';
      switch (this.realreg.effect) {
        case 'null':
          return '없음';
        case 'first':
          return '생애최초취득감면';
        case 'newborn':
          return '신생아감면';
        default:
          return this.realreg.effect;
      }
    },
    buyerInfo() {
      if (!this.realreg) return { names: '', numbers: '', addresses: '' };
      return {
        names: this.realreg.buyers.map(buyer => buyer.name).join(', '),
        numbers: this.realreg.buyers.map(buyer => buyer.number).join(', '),
        addresses: this.realreg.buyers.map(buyer => buyer.address).join(', ')
      };
    },
    sellerInfo() {
      if (!this.realreg) return { names: '', numbers: '', addresses: '' };
      return {
        names: this.realreg.sellers.map(seller => seller.name).join(', '),
        numbers: this.realreg.sellers.map(seller => seller.number).join(', '),
        addresses: this.realreg.sellers.map(seller => seller.address).join(', ')
      };
    }
  },
  methods: {
    async loadRealregbyid() {
      await axios.get(`/api/realregs/${this.realreg_id}`)
        .then(response => {
          this.realreg = response.data;
        })
        .catch(error => {
          console.error('부동산 등기정보를 불러오는 중에 오류가 발생했습니다:', error);
        });
    },
    createDocument(){
      const url = this.$router.resolve({ name: 'RealRegDocument', params: { realreg_id: this.realreg.realreg_id } }).href;
      window.open(url, 'newwindow', 'width=850,height=1000');
    },
    createReceipt() {
      const url = this.$router.resolve({ name: 'RealRegReceipt', params: { realreg_id: this.realreg.realreg_id } }).href;
      window.open(url, 'newwindow', 'width=1050,height=800');
    },
    goBack() {
      this.$router.push({ path: '/realreg' });
    },
    editRealreg() {
      this.$router.push({ name: 'RealRegEdit', params: { realreg_id: this.realreg.realreg_id, isEdit: true } });
    },
    deleteRealreg() {
      const realreg_id = this.realreg.realreg_id;
      if (confirm("이 부동산 사건을 삭제하시겠습니까?")) {
        try {
          axios.delete(`/api/realregs/${realreg_id}`);
          alert("부동산 사건이 삭제되었습니다.");
          this.$router.push({ path: '/realreg' });
        } catch (error) {
          console.error("부동산사건 삭제 중 오류가 발생했습니다:", error.response ? error.response.data : error.message);
          alert("부동산 사건 삭제 중 오류가 발생했습니다.");
        }
      }
    },
    formattedValue(value) {
      return new Intl.NumberFormat().format(value);
    },
    formatTime(time) {
      if (!time) return '';
      const [hours, minutes] = time.split(':');
      const period = hours >= 12 ? 'PM' : 'AM';
      const formattedHours = hours % 12 || 12;
      return `${period} ${formattedHours.toString().padStart(2, '0')}:${minutes}`;
    },
  }
};
</script>

<style scoped>
.maintable {
  margin: auto;
  font-size: 14px;
  min-width: 1000px;
  width: 65%;
  margin-bottom: 30px;
}

.sub_table {
  margin: auto;
  font-size: 14px;
  min-width: 650px;
  width: 60%;
  margin-bottom: 30px;
}

.table th,
.table td {
  vertical-align: middle;
  text-align: center;
  padding: 10px 3px 10px 3px;
}

.table th {
  background-color: #dadada;
  width: 90px;
}

.table td {
  min-width: 100px;
}

.lastcol {
  width: 100px;
}

.memo-cell {
  padding-left: 50px !important;
  text-align: left !important;
  word-wrap: break-word;
  white-space: pre-wrap;
}
</style>
