<template>
  <div class="container">
    <div class="contents">
      <div class="row justify-content-between mb-3">
        <div class="col-auto">
          <input v-model="searchQuery" @input="onSearch" placeholder="검색어를 입력하세요" class="form-control mb-3" />
        </div>
        <div class="col-auto">
          <b-button variant="outline-primary" class="mx-1" @click="showModal">작성</b-button>
        </div>
      </div>

      <!-- 모달 -->
      <b-modal v-model="modalShow" title="소송 작성" @hidden="modalClosed" hide-footer hide-header dialog-class="modal-dialog-centered custom-modal">
        <b-form @submit.prevent="submitLawsuit">
          <b-form-group label="의뢰인구분" label-for="clientType">
            <b-form-input id="clientType" v-model="lawsuit.clientType" required></b-form-input>
          </b-form-group>
          <b-form-group v-for="(client, index) in lawsuit.clients" :key="index" :label="'의뢰인 ' + (index + 1)" :label-for="'client' + index">
            <div class="d-flex">
              <b-form-input :id="'client' + index" v-model="lawsuit.clients[index]" required></b-form-input>
              <b-button variant="outline-success" @click="addClientField(index)" v-if="index === lawsuit.clients.length - 1">+</b-button>
              <b-button variant="outline-danger" @click="removeClientField(index)" v-if="index > 0">-</b-button>
            </div>
          </b-form-group>
          <b-form-group label="상대방구분" label-for="opponentType">
            <b-form-input id="opponentType" v-model="lawsuit.opponentType" required></b-form-input>
          </b-form-group>
          <b-form-group v-for="(opponent, index) in lawsuit.opponents" :key="index" :label="'상대방 ' + (index + 1)" :label-for="'opponent' + index">
            <div class="d-flex">
              <b-form-input :id="'opponent' + index" v-model="lawsuit.opponents[index]" required></b-form-input>
              <b-button variant="outline-success" @click="addOpponentField(index)" v-if="index === lawsuit.opponents.length - 1">+</b-button>
              <b-button variant="outline-danger" @click="removeOpponentField(index)" v-if="index > 0">-</b-button>
            </div>
          </b-form-group>
          <b-form-group label="작성일" label-for="date">
            <b-form-input id="date" type="date" v-model="lawsuit.date" required max="9999-12-31"></b-form-input>
          </b-form-group>
          <b-form-group label="사건명" label-for="caseName">
            <b-form-input id="caseName" v-model="lawsuit.caseName" required></b-form-input>
          </b-form-group>
          <b-form-group label="관할법원" label-for="court">
            <b-form-input id="court" v-model="lawsuit.court" required></b-form-input>
          </b-form-group>
          <div class="d-flex justify-content-end">
            <b-button type="submit" class="mx-1" variant="primary">작성 완료</b-button>
            <b-button variant="secondary" class="mx-1" @click="modalShow = false; resetForm()">닫기</b-button>
          </div>
        </b-form>
      </b-modal>

      <!-- 소송 리스트 테이블 -->
      <div v-if="paginatedLawsuits.length > 0">
        <h3>소송 리스트</h3>
        <table class="table">
          <thead>
            <tr>
              <th>#</th>
              <th>구분</th>
              <th>의뢰인</th>
              <th>구분</th>
              <th>상대방</th>
              <th>작성일</th>
              <th>사건명</th>
              <th>관할법원</th>
              <th>담당자</th>
              <th>작업</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(lawsuit, index) in paginatedLawsuits" :key="index">
              <td>{{ lawsuit.index }}</td>
              <td>{{ lawsuit.clientType }}</td>
              <td>{{ lawsuit.clients.join(', ') }}</td>
              <td>{{ lawsuit.opponentType }}</td>
              <td>{{ lawsuit.opponents.join(', ') }}</td>
              <td>{{ lawsuit.date }}</td>
              <td>{{ lawsuit.caseName }}</td>
              <td>{{ lawsuit.court }}</td>
              <td>{{ lawsuit.manager }}</td>
              <td>
                <b-button size="sm" variant="outline-primary" class="mx-1" @click="editLawsuit(index)">수정</b-button>
                <b-button size="sm" variant="outline-danger" class="mx-1" @click="delLawsuit(index)">삭제</b-button>
                <b-button size="sm" variant="outline-dark" class="mx-1" @click="createReceipt(index)">영수증 작성</b-button>
                <b-button size="sm" variant="outline-success" class="mx-1" @click="createDocument(index)">위임장 작성</b-button>
              </td>
            </tr>
          </tbody>
        </table>
        <b-pagination v-model="currentPage" :total-rows="filteredLawsuits.length" :per-page="pageSize" aria-controls="my-table" class="justify-content-center"></b-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      modalShow: false,
      lawsuit: {
        clientType: '',
        clients: [''],
        opponentType: '',
        opponents: [''],
        date: '',
        caseName: '',
        court: '',
        manager: '',
        index:''
      },
      editIndex: null,
      lawsuits: [],
      currentPage: 1,
      pageSize: 15,
      searchQuery: ''
    };
  },
  computed: {
    filteredLawsuits() {
      if (this.searchQuery) {
        return this.lawsuits.filter(lawsuit => {
          return Object.values(lawsuit).some(value =>
            String(value).toLowerCase().includes(this.searchQuery.toLowerCase())
          );
        });
      } else {
        return this.lawsuits;
      }
    },
    paginatedLawsuits() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.filteredLawsuits.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredLawsuits.length / this.pageSize);
    }
  },
  mounted() {
    this.fetchLawsuits();
  },
  methods: {
    showModal() {
      axios.get('/api/user/me')
      .then(response => {
        const user = response.data;
        this.lawsuit.manager = `${user.role} ${user.name}`;
        this.modalShow = true;
        this.editIndex = null;
      })
      .catch(error => {
        console.error("사용자 정보를 불러오는 중에 오류가 발생했습니다:", error);
      });
    },
    addClientField() {
      this.lawsuit.clients.push('');
    },
    removeClientField(index) {
      if (this.lawsuit.clients.length > 1) {
        this.lawsuit.clients.splice(index, 1);
      }
    },
    addOpponentField() {
      this.lawsuit.opponents.push('');
    },
    removeOpponentField(index) {
      if (this.lawsuit.opponents.length > 1) {
        this.lawsuit.opponents.splice(index, 1);
      }
    },

    async fetchLawsuits() {
      await axios.get('/api/lawsuits')
        .then(response => {
          this.lawsuits = response.data;
        })
        .catch(error => {
          console.error("소송 정보를 불러오는 중에 오류가 발생했습니다:", error);
        });
    },
    async submitLawsuit() {
      try {
        let response;
        if (this.editIndex !== null) {
          response = await axios.put(`/api/lawsuits/${this.lawsuit.lawsuit_id}`, this.lawsuit);
          const index = this.lawsuits.findIndex(l => l.lawsuit_id === this.lawsuit.lawsuit_id);
          this.lawsuits.splice(index, 1, response.data);
          this.editIndex = null;
        } else {
          response = await axios.post('/api/lawsuits', this.lawsuit);
          this.lawsuits.unshift(response.data);
        }
        this.modalShow = false;
        this.resetForm();
      } catch (error) {
        console.error("소송 정보를 저장 또는 업데이트하는 중에 오류가 발생했습니다:", error);
      }
    },
    async modalClosed() {
      try {
        const response = await axios.get('/api/lawsuits');
        this.lawsuits = response.data;
      } catch (error) {
        console.error("소송 정보를 불러오는 중에 오류가 발생했습니다:", error);
      }
    },
    changePage(page) {
      this.currentPage = page;
    },
    onSearch() {
      this.currentPage = 1;
    },
    async editLawsuit(index) {
      this.lawsuit = { ...this.lawsuits[index] };
      this.editIndex = index;
      this.modalShow = true;
    },
    async delLawsuit(index) {
      const lawsuitId = this.lawsuits[index].lawsuit_id;
      try {
        await axios.delete(`/api/lawsuits/${lawsuitId}`);
        this.lawsuits = this.lawsuits.filter(lawsuit => lawsuit.lawsuit_id !== lawsuitId);
      } catch (error) {
        console.error("소송 정보를 삭제하는 중에 오류가 발생했습니다:", error);
      }
    },
    createReceipt(index) {
      const lawsuitId = this.lawsuits[index].lawsuit_id;
      const url = this.$router.resolve({ name: 'LawsuitReceipt', params: { index: lawsuitId } }).href;
      window.open(url, 'newwindow', 'width=1050,height=800');
    },
    createDocument(index) {
      const lawsuitId = this.lawsuits[index].lawsuit_id;
      const url = this.$router.resolve({ name: 'LawsuitDocument', params: { index: lawsuitId } }).href;
      window.open(url, 'newwindow', 'width=800,height=600');
    },
    resetForm() {
      this.lawsuit = {
        clientType: '',
        clients: [''],
        opponentType: '',
        opponents: [''],
        date: '',
        caseName: '',
        court: ''
      };
    }
  }
};
</script>

<style scoped>
.custom-modal .modal-content {
  top: 50%;
  transform: translateY(-50%);
}
</style>
