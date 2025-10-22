import { ref, computed } from 'vue'

// 游戏状态管理
class GameStateManager {
  static STORAGE_KEY = 'treasureGameState'
  
  static getState() {
    const saved = localStorage.getItem(this.STORAGE_KEY)
    if (saved) {
      const state = JSON.parse(saved)
      return {
        progress: state.progress || 0,
        foundKeys: state.foundKeys || [],
        currentLocation: state.currentLocation || null,
        gameLog: state.gameLog || []
      }
    }
    return {
      progress: 0,
      foundKeys: [],
      currentLocation: null,
      gameLog: []
    }
  }
  
  static saveState(state) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(state))
  }
  
  static resetState() {
    localStorage.removeItem(this.STORAGE_KEY)
  }
}

export function useGameState() {
  const initialState = GameStateManager.getState()
  
  const progress = ref(initialState.progress)
  const foundKeys = ref(initialState.foundKeys)
  const gameLog = ref(initialState.gameLog)
  const currentLocation = ref(initialState.currentLocation)

  const updateProgress = (newProgress) => {
    progress.value = Math.min(100, Math.max(0, newProgress))
  }

  const addFoundKey = (keyNumber) => {
    if (!foundKeys.value.includes(keyNumber)) {
      foundKeys.value.push(keyNumber)
    }
  }

  const addGameLog = (message, type = 'info') => {
    gameLog.value.push({
      message,
      type,
      timestamp: Date.now()
    })
    
    // 只保留最近20条日志
    if (gameLog.value.length > 20) {
      gameLog.value = gameLog.value.slice(-20)
    }
  }

  const resetGameState = () => {
    progress.value = 0
    foundKeys.value = []
    gameLog.value = []
    currentLocation.value = null
    GameStateManager.resetState()
  }

  const saveGameState = () => {
    const state = {
      progress: progress.value,
      foundKeys: foundKeys.value,
      currentLocation: currentLocation.value,
      gameLog: gameLog.value
    }
    GameStateManager.saveState(state)
  }

  // 计算属性
  const completionRate = computed(() => {
    const keyProgress = (foundKeys.value.length / 3) * 60
    const explorationProgress = Math.min(progress.value, 40)
    return keyProgress + explorationProgress
  })

  return {
    progress,
    foundKeys,
    gameLog,
    currentLocation,
    updateProgress,
    addFoundKey,
    addGameLog,
    resetGameState,
    saveGameState,
    completionRate
  }
}