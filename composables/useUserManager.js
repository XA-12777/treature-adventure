import { ref, computed } from 'vue'

class UserManager {
  static STORAGE_KEY = 'treasureGameUsers'
  static RANKING_KEY = 'treasureGameRankings'
  
  static getUsers() {
    const saved = localStorage.getItem(this.STORAGE_KEY)
    return saved ? JSON.parse(saved) : []
  }
  
  static saveUsers(users) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(users))
  }
  
  static getRankings() {
    const saved = localStorage.getItem(this.RANKING_KEY)
    return saved ? JSON.parse(saved) : []
  }
  
  static saveRankings(rankings) {
    localStorage.setItem(this.RANKING_KEY, JSON.stringify(rankings))
  }
}

export function useUserManager() {
  const currentUser = ref(null)
  const users = ref(UserManager.getUsers())
  const rankings = ref(UserManager.getRankings())

  const loginUser = (userData) => {
    const user = users.value.find(u => 
      u.username === userData.username && u.password === userData.password
    )
    
    if (user) {
      currentUser.value = { ...user }
      return true
    }
    return false
  }

  const registerUser = (userData) => {
    const existingUser = users.value.find(u => u.username === userData.username)
    if (existingUser) {
      return false
    }
    
    const newUser = {
      id: Date.now().toString(),
      username: userData.username,
      password: userData.password,
      createdAt: new Date().toISOString(),
      bestProgress: 0,
      completedGames: 0
    }
    
    users.value.push(newUser)
    UserManager.saveUsers(users.value)
    
    currentUser.value = { ...newUser }
    return true
  }

  const logoutUser = () => {
    currentUser.value = null
  }

  const updateUserProgress = (username, progress) => {
    const userIndex = users.value.findIndex(u => u.username === username)
    if (userIndex !== -1) {
      const user = users.value[userIndex]
      if (progress > user.bestProgress) {
        user.bestProgress = progress
        
        if (progress === 100) {
          user.completedGames += 1
          user.lastCompletionTime = new Date().toISOString()
          
          // 更新排行榜
          updateRanking(user, progress)
        }
        
        UserManager.saveUsers(users.value)
        
        // 更新当前用户信息
        if (currentUser.value && currentUser.value.username === username) {
          currentUser.value = { ...user }
        }
      }
    }
  }

  const updateRanking = (user, progress) => {
    const existingIndex = rankings.value.findIndex(r => r.username === user.username)
    
    const rankingEntry = {
      username: user.username,
      progress: progress,
      completedGames: user.completedGames,
      lastCompletion: user.lastCompletionTime,
      updatedAt: new Date().toISOString()
    }
    
    if (existingIndex !== -1) {
      rankings.value[existingIndex] = rankingEntry
    } else {
      rankings.value.push(rankingEntry)
    }
    
    // 按进度和完成时间排序
    rankings.value.sort((a, b) => {
      if (b.progress !== a.progress) {
        return b.progress - a.progress
      }
      return new Date(b.lastCompletion) - new Date(a.lastCompletion)
    })
    
    // 只保留前50名
    rankings.value = rankings.value.slice(0, 50)
    
    UserManager.saveRankings(rankings.value)
  }

  // 计算属性
  const topRankings = computed(() => {
    return rankings.value.slice(0, 10)
  })

  const userRanking = computed(() => {
    if (!currentUser.value) return null
    return rankings.value.findIndex(r => r.username === currentUser.value.username) + 1
  })

  return {
    currentUser,
    users,
    rankings,
    loginUser,
    registerUser,
    logoutUser,
    updateUserProgress,
    topRankings,
    userRanking
  }
}