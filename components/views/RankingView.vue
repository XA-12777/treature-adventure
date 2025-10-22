<template>
  <div class="view active">
    <div class="container">
      <h1>🏆 探险排行榜</h1>
      
      <div class="ranking-container">
        <!-- 当前用户排名 -->
        <div v-if="currentUser" class="current-user-rank">
          <h3>我的排名</h3>
          <div class="user-rank-card">
            <div class="rank-badge">#{{ getUserRank }}</div>
            <div class="user-info">
              <span class="username">{{ currentUser.username }}</span>
              <span class="progress">进度: {{ currentUser.bestProgress }}%</span>
            </div>
            <div class="completion-count">
              完成: {{ currentUser.completedGames }} 次
            </div>
          </div>
        </div>
        
        <!-- 排行榜 -->
        <div class="ranking-list">
          <h3>全服排行榜</h3>
          <div class="ranking-header">
            <span>排名</span>
            <span>玩家</span>
            <span>进度</span>
            <span>完成次数</span>
          </div>
          <div class="ranking-items">
            <div 
              v-for="(player, index) in topRankings" 
              :key="player.username"
              class="ranking-item"
              :class="{
                'current-user': currentUser && player.username === currentUser.username,
                'top-three': index < 3
              }"
            >
              <div class="rank">
                <span v-if="index < 3" class="medal">
                  {{ ['🥇', '🥈', '🥉'][index] }}
                </span>
                <span v-else>#{{ index + 1 }}</span>
              </div>
              <div class="player-name">{{ player.username }}</div>
              <div class="progress">
                <div class="progress-bar-mini">
                  <div 
                    class="progress-fill" 
                    :style="{ width: player.progress + '%' }"
                  ></div>
                </div>
                <span>{{ player.progress }}%</span>
              </div>
              <div class="completions">{{ player.completedGames }}</div>
            </div>
          </div>
        </div>
        
        <div v-if="rankings.length === 0" class="empty-ranking">
          <p>暂无排行榜数据，开始你的探险吧！</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'RankingView',
  props: {
    rankings: {
      type: Array,
      default: () => []
    },
    currentUser: {
      type: Object,
      default: null
    }
  },
  setup(props) {
    const topRankings = computed(() => {
      return props.rankings.slice(0, 20) // 显示前20名
    })

    const getUserRank = computed(() => {
      if (!props.currentUser) return '-'
      const userIndex = props.rankings.findIndex(
        r => r.username === props.currentUser.username
      )
      return userIndex !== -1 ? userIndex + 1 : '-'
    })

    return {
      topRankings,
      getUserRank
    }
  }
}
</script>

<style scoped>
.ranking-container {
  max-width: 800px;
  margin: 0 auto;
}

.current-user-rank {
  margin-bottom: 30px;
}

.user-rank-card {
  display: flex;
  align-items: center;
  background: rgba(255, 215, 0, 0.1);
  border: 2px solid #ffd700;
  border-radius: 15px;
  padding: 20px;
  margin: 15px 0;
  backdrop-filter: blur(10px);
}

.rank-badge {
  background: #ffd700;
  color: #000;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.2em;
  margin-right: 20px;
}

.user-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.username {
  font-size: 1.3em;
  font-weight: bold;
  color: #ffd700;
}

.progress {
  color: #4ecdc4;
}

.completion-count {
  background: rgba(255, 255, 255, 0.1);
  padding: 8px 15px;
  border-radius: 20px;
  font-weight: bold;
}

.ranking-list {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 20px;
  backdrop-filter: blur(10px);
}

.ranking-header {
  display: grid;
  grid-template-columns: 80px 1fr 150px 100px;
  gap: 15px;
  padding: 15px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  font-weight: bold;
  margin-bottom: 10px;
}

.ranking-items {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.ranking-item {
  display: grid;
  grid-template-columns: 80px 1fr 150px 100px;
  gap: 15px;
  padding: 15px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.ranking-item:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateX(5px);
}

.ranking-item.current-user {
  background: rgba(255, 215, 0, 0.1);
  border-color: #ffd700;
}

.ranking-item.top-three {
  background: linear-gradient(135deg, 
    rgba(255, 215, 0, 0.2), 
    rgba(255, 215, 0, 0.1)
  );
}

.rank {
  font-weight: bold;
  display: flex;
  align-items: center;
}

.medal {
  font-size: 1.5em;
}

.player-name {
  font-weight: 500;
}

.progress {
  display: flex;
  align-items: center;
  gap: 10px;
}

.progress-bar-mini {
  flex: 1;
  height: 8px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #4ecdc4, #44a08d);
  transition: width 0.5s ease;
}

.completions {
  text-align: center;
  font-weight: bold;
  color: #ffd700;
}

.empty-ranking {
  text-align: center;
  padding: 40px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  backdrop-filter: blur(10px);
}

.empty-ranking p {
  font-size: 1.2em;
  color: #ccc;
}
</style>