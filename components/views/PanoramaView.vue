<template>
  <div class="view active">
    <div class="container">
      <h1>🏴‍☠️ 神秘宝藏探险</h1>
      
      <div class="locations-grid">
        <LocationCard 
          v-for="location in locations" 
          :key="location.id"
          :location="location"
          @click="$emit('enter-location', location.id)"
        />
      </div>
      
      <div class="game-progress-preview">
        <h3>当前进度</h3>
        <ProgressBar :progress="progress" />
        <KeyIndicator :found-keys="foundKeys" />
      </div>
    </div>
  </div>
</template>

<script>
import LocationCard from '../ui/LocationCard.vue'
import ProgressBar from '../ui/ProgressBar.vue'
import KeyIndicator from '../ui/KeyIndicator.vue'

export default {
  name: 'PanoramaView',
  components: {
    LocationCard,
    ProgressBar,
    KeyIndicator
  },
  props: {
    progress: {
      type: Number,
      default: 0
    },
    foundKeys: {
      type: Array,
      default: () => []
    }
  },
  emits: ['enter-location'],
  data() {
    return {
      locations: [
        {
          id: 'library',
          icon: '📚',
          name: '古老图书馆',
          description: '获取线索和解密'
        },
        {
          id: 'waterfall',
          icon: '🌊',
          name: '神秘瀑布',
          description: '寻找第一把钥匙'
        },
        {
          id: 'ancient-tree',
          icon: '🌳',
          name: '千年古树',
          description: '寻找第二把钥匙'
        },
        {
          id: 'maze',
          icon: '🌀',
          name: '地下迷宫',
          description: '寻找第三把钥匙'
        },
        {
          id: 'temple',
          icon: '🏛️',
          name: '古老神庙',
          description: '开启最终宝藏'
        }
      ]
    }
  }
}
</script>

<style scoped>
.locations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin: 30px 0;
}

.game-progress-preview {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 20px;
  margin-top: 30px;
  backdrop-filter: blur(10px);
}
</style>