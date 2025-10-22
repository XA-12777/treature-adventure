<template>
  <div class="view active">
    <div class="container">
      <h1>{{ currentUser ? '用户信息' : '用户登录/注册' }}</h1>
      
      <div class="user-management">
        <!-- 已登录状态 -->
        <div v-if="currentUser" class="user-info">
          <div class="user-card">
            <div class="user-avatar">👤</div>
            <div class="user-details">
              <h2>{{ currentUser.username }}</h2>
              <p>注册时间: {{ formatDate(currentUser.createdAt) }}</p>
              <p>最佳进度: {{ currentUser.bestProgress }}%</p>
              <p>完成游戏: {{ currentUser.completedGames }} 次</p>
            </div>
          </div>
          <button class="logout-btn" @click="$emit('logout')">
            退出登录
          </button>
        </div>
        
        <!-- 未登录状态 -->
        <div v-else class="auth-forms">
          <div class="form-container">
            <h3>登录</h3>
            <form @submit.prevent="handleLogin" class="auth-form">
              <input 
                v-model="loginData.username" 
                type="text" 
                placeholder="用户名" 
                required
              >
              <input 
                v-model="loginData.password" 
                type="password" 
                placeholder="密码" 
                required
              >
              <button type="submit">登录</button>
            </form>
          </div>
          
          <div class="form-divider">或</div>
          
          <div class="form-container">
            <h3>注册</h3>
            <form @submit.prevent="handleRegister" class="auth-form">
              <input 
                v-model="registerData.username" 
                type="text" 
                placeholder="用户名" 
                required
                minlength="3"
              >
              <input 
                v-model="registerData.password" 
                type="password" 
                placeholder="密码" 
                required
                minlength="4"
              >
              <input 
                v-model="registerData.confirmPassword" 
                type="password" 
                placeholder="确认密码" 
                required
              >
              <button type="submit">注册</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserManagement',
  props: {
    currentUser: {
      type: Object,
      default: null
    }
  },
  emits: ['login', 'register', 'logout'],
  data() {
    return {
      loginData: {
        username: '',
        password: ''
      },
      registerData: {
        username: '',
        password: '',
        confirmPassword: ''
      }
    }
  },
  methods: {
    handleLogin() {
      const success = this.$emit('login', this.loginData)
      if (success) {
        this.loginData = { username: '', password: '' }
      }
    },
    
    handleRegister() {
      if (this.registerData.password !== this.registerData.confirmPassword) {
        alert('密码不匹配！')
        return
      }
      
      const success = this.$emit('register', this.registerData)
      if (success) {
        this.registerData = { username: '', password: '', confirmPassword: '' }
      }
    },
    
    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString('zh-CN')
    }
  }
}
</script>

<style scoped>
.user-management {
  max-width: 600px;
  margin: 0 auto;
}

.user-info {
  text-align: center;
}

.user-card {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 30px;
  margin: 20px 0;
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 215, 0, 0.3);
}

.user-avatar {
  font-size: 4em;
  margin-bottom: 15px;
}

.user-details h2 {
  color: #ffd700;
  margin-bottom: 15px;
}

.user-details p {
  margin: 8px 0;
  font-size: 1.1em;
}

.logout-btn {
  background: linear-gradient(45deg, #ff6b6b, #ee5a24);
  color: white;
  border: none;
  border-radius: 25px;
  padding: 12px 30px;
  font-size: 1.1em;
  cursor: pointer;
  transition: all 0.3s ease;
}

.logout-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.auth-forms {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 30px;
  align-items: start;
}

.form-container {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 25px;
  backdrop-filter: blur(10px);
}

.form-divider {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffd700;
  font-weight: bold;
  font-size: 1.2em;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.auth-form input {
  padding: 12px 15px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  font-size: 1em;
  transition: all 0.3s ease;
}

.auth-form input:focus {
  outline: none;
  border-color: #ffd700;
  box-shadow: 0 0 10px rgba(255, 215, 0, 0.3);
}

.auth-form button {
  padding: 12px;
  border: none;
  border-radius: 10px;
  background: linear-gradient(45deg, #4ecdc4, #44a08d);
  color: white;
  font-size: 1.1em;
  cursor: pointer;
  transition: all 0.3s ease;
}

.auth-form button:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}
</style>