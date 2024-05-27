<template>
  <div class="register-container">
    <div class="register-box">
      <h1>회원가입</h1>
      <form @submit.prevent="register">
        <div class="input-group">
          <input type="text" v-model="username" required placeholder="아이디" />
        </div>
        <div class="input-group">
          <input type="password" v-model="password" required placeholder="비밀번호" />
        </div>
        <div class="input-group">
          <input type="password" v-model="confirmPassword" required placeholder="비밀번호 확인" />
        </div>
        <div class="input-group">
          <input type="text" v-model="officeName" required placeholder="사무실 이름" />
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
          <input type="email" v-model="email" required placeholder="이메일" />
        </div>
        <button type="submit" class="register-button">회원가입</button>
      </form>
    </div>
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
      role: '',
      name: '',
      phoneNumber: '',
      email: ''
    };
  },
  methods: {
    async register() {
      if (this.password !== this.confirmPassword) {
        alert('비밀번호가 일치하지 않습니다.');
        return;
      }
      try {
        await axios.post('/api/register', {
          username: this.username,
          password: this.password,
          officeName: this.officeName,
          role: this.role,
          name: this.name,
          phoneNumber: this.phoneNumber,
          email: this.email
        });
        alert('회원가입이 완료되었습니다.');
        this.$router.push('/');
      } catch (error) {
        alert('회원가입 중 오류가 발생했습니다.');
      }
    }
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
  width: 400px;
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
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  outline: none;
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
</style>
