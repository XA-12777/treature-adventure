<template>
  <div class="view active">
    <div class="container">
      <button class="back-btn" @click="$emit('back-to-panorama')">← 返回全景</button>
      <h1>{{ locationTitle }}</h1>
      
      <div class="game-area">
        <div class="map-container" :class="currentLocation">
          <div class="adventurer">🧙‍♂️</div>
        </div>
        
        <div class="progress-container">
          <h3>探险进度</h3>
          <ProgressBar :progress="progress" />
          <KeyIndicator :found-keys="foundKeys" />
        </div>
        
        <GameLog :logs="gameLog" />
        
        <div class="treasure-result" v-if="showTreasureResult">
          🎉 恭喜! 你找到了传说中的宝藏!
        </div>
        
        <div class="controls">
          <button @click="$emit('explore-location')">
            {{ exploreButtonText }}
          </button>
          <button @click="$emit('back-to-panorama')">返回全景</button>
          <button @click="$emit('reset-adventure')">重新开始</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ProgressBar from '../ui/ProgressBar.vue'
import KeyIndicator from '../ui/KeyIndicator.vue'
import GameLog from '../ui/GameLog.vue'

export default {
  name: 'GameView',
  components: {
    ProgressBar,
    KeyIndicator,
    GameLog
  },
  props: {
    currentLocation: String,
    progress: Number,
    foundKeys: Array,
    gameLog: Array
  },
  emits: ['back-to-panorama', 'explore-location', 'reset-adventure'],
  computed: {
    locationTitle() {
      const titles = {
        'library': '📚 古老图书馆',
        'waterfall': '🌊 神秘瀑布',
        'ancient-tree': '🌳 千年古树',
        'maze': '🌀 地下迷宫',
        'temple': '🏛️ 古老神庙'
      }
      return titles[this.currentLocation] || '🏴‍☠️ 神秘宝藏探险'
    },
    exploreButtonText() {
      return this.currentLocation === 'temple' ? '开启宝藏' : '探索此地'
    },
    showTreasureResult() {
      return this.progress === 100
    }
  }
}
</script>