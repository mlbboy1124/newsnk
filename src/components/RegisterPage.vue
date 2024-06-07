<template>
  <div class="register-container">
    <div class="register-box">
      <h1>회원가입</h1>
      <form @submit.prevent="register">
        <div class="input-group">
          <input type="text" v-model="username" required placeholder="아이디" autocomplete="username" />
        </div>
        <div class="input-group">
          <input type="password" v-model="password" required placeholder="비밀번호" autocomplete="new-password" />
        </div>
        <div class="input-group">
          <input type="password" v-model="confirmPassword" required placeholder="비밀번호 확인" autocomplete="new-password" />
        </div>
        <div class="input-group">
          <input type="text" v-model="officeName" required placeholder="사무실 이름" readonly />
          <button type="button" @click="openModal">검색</button>
        </div>
        <div class="input-group">
          <input type="text" v-model="officeCode" required placeholder="사무실 인증코드" />
        </div>
        <div class="input-group">
          <input type="text" v-model="role" required placeholder="직책" />
        </div>
        <div class="input-group">
          <input type="text" v-model="name" required placeholder="이름" />
        </div>
        <div class="input-group">
          <input type="text" v-model="phoneNumber" required placeholder="전화번호" />
        </div>
        <div class="input-group">
          <input type="email" v-model="email" required placeholder="이메일" autocomplete="email" />
        </div>
        <button type="submit" class="register-button">회원가입</button>
      </form>
    </div>

    <b-modal v-model="isModalOpen" title="사무실 이름 검색" @hide="closeModal">
      <input type="text" v-model="searchQuery" placeholder="검색어를 입력하세요" @input="searchOffices" class="form-control mb-3" />
      <ul class="list-group search-results">
        <li v-for="office in filteredOffices" :key="office.id" @click="selectOffice(office)" class="list-group-item">
          {{ office.office_name }}
        </li>
      </ul>
      <template v-slot:modal-footer>
        <b-button variant="secondary" @click="closeModal">닫기</b-button>
      </template>
    </b-modal>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      username: '',
      password: '',
      confirmPassword: '',
      officeName: '',
      officeCode: '',
      role: '',
      name: '',
      phoneNumber: '',
      email: '',
      isModalOpen: false,
      searchQuery: '',
      offices: [],
    };
  },
  computed: {
    filteredOffices() {
      console.log('Filtering offices with searchQuery:', this.searchQuery);
      console.log('Offices:', this.offices);
      const filtered = this.offices.filter(office => office.office_name && office.office_name.includes(this.searchQuery)).slice(0, 10);
      console.log('Filtered offices:', filtered);
      return filtered;
    }
  },
  methods: {
    async register() {
      if (this.password !== this.confirmPassword) {
        alert('비밀번호가 일치하지 않습니다.');
        return;
      }
      try {
        console.log('Registering user:', this.username);
        await axios.post('/api/register', {
          username: this.username,
          password: this.password,
          officeName: this.officeName,
          officeCode: this.officeCode,
          role: this.role,
          name: this.name,
          phoneNumber: this.phoneNumber,
          email: this.email
        });
        alert('회원가입이 완료되었습니다.');
        this.$router.push('/');
      } catch (error) {
        console.error('Error during registration:', error);
        alert('회원가입 중 오류가 발생했습니다.');
      }
    },
    openModal() {
      this.isModalOpen = true;
      console.log('Modal opened');
      this.searchOffices(); // 모달이 열릴 때 초기 검색
    },
    closeModal() {
      this.isModalOpen = false;
      console.log('Modal closed');
    },
    async searchOffices() {
      if (!this.searchQuery) {
        this.offices = [];
        return;
      }
      try {
        console.log('Searching offices with query:', this.searchQuery);
        const response = await axios.get(`/api/offices?q=${this.searchQuery}`);
        this.offices = response.data;
        console.log('Offices found:', this.offices);
      } catch (error) {
        console.error('Error during office search:', error);
        alert('사무실 목록을 불러오는 중 오류가 발생했습니다.');
      }
    },
    selectOffice(office) {
      this.officeName = office.office_name;
      console.log('Office selected:', office);
      this.closeModal();
    },
  }
};
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5;
}

.register-box {
  background: #fff;
  padding: 40px;
  box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  text-align: center;
  width: 500px;
}

h1 {
  margin-bottom: 20px;
  font-size: 24px;
  color: #333;
}

.input-group {
  margin-bottom: 20px;
}

.input-group input {
  width: calc(100% - 50px);
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  outline: none;
}

.input-group button {
  width: 50px;
  padding: 10px;
  margin-left: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.register-button {
  background: #3064bf;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 10px;
  width: 100%;
  cursor: pointer;
  font-size: 16px;
  transition: background 0.3s ease;
}

.register-button:hover {
  background: #002c69;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  width: 400px;
  text-align: center;
}

.modal h2 {
  margin-bottom: 20px;
  font-size: 20px;
}

.modal input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-bottom: 20px;
}

.modal ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.modal li {
  padding: 10px;
  cursor: pointer;
  border-bottom: 1px solid #ccc;
}

.modal li:hover {
  background-color: #f0f0f0;
}

.modal button {
  background: #3064bf;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 10px;
  cursor: pointer;
}

.modal button:hover {
  background: #002c69;
}

.search-results {
  max-height: 300px;
  overflow-y: auto;
}

.list-group-item {
  transition: background-color 0.3s ease;
}

.list-group-item:hover {
  background-color: #e0e0e0;
}
</style>
