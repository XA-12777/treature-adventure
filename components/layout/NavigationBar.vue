<template>
  <nav class="navigation-bar">
    <div class="nav-brand">
      🏴‍☠️ 宝藏探险
    </div>
    <div class="nav-links">
      <button 
        class="nav-link" 
        :class="{ active: currentView === 'panorama' }"
        @click="$emit('change-view', 'panorama')"
      >
        🗺️ 探险地图
      </button>
      <button 
        class="nav-link" 
        :class="{ active: currentView === 'ranking' }"
        @click="$emit('change-view', 'ranking')"
      >
        🏆 排行榜
      </button>
      <button 
        class="nav-link" 
        :class="{ active: currentView === 'user' }"
        @click="$emit('change-view', 'user')"
      >
        {{ currentUser ? `👤 ${currentUser.username}` : '🔐 登录/注册' }}
      </button>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'NavigationBar',
  props: {
    currentView: {
      type: String,
      default: 'panorama'
    },
    currentUser: {
      type: Object,
      default: null
    }
  },
  emits: ['change-view']
}
</script>

<style scoped>
.navigation-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(0, 0, 0, 0.8);
  padding: 15px 30px;
  border-radius: 15px;
  margin-bottom: 20px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 215, 0, 0.3);
}

.nav-brand {
  font-size: 1.5em;
  font-weight: bold;
  color: #ffd700;
}

.nav-links {
  display: flex;
  gap: 15px;
}

.nav-link {
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid transparent;
  border-radius: 25px;
  padding: 10px 20px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.nav-link:hover {
  background: rgba(255, 215, 0, 0.2);
  transform: translateY(-2px);
}

.nav-link.active {
  background: rgba(255, 215, 0, 0.3);
  border-color: #ffd700;
  box-shadow: 0 0 15px rgba(255, 215, 0, 0.5);
}
</style>