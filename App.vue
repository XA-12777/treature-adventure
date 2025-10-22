<template>
  <div id="app">
    <!-- 新增：音乐提示覆盖层 -->
    <div v-if="showMusicPrompt" class="music-prompt" @click="closeMusicPrompt">
      <div class="prompt-content">
        <h3>🎵 点击开启背景音乐</h3>
        <p>为了更好的游戏体验，建议开启背景音乐</p>
        <button @click="closeMusicPrompt">开始游戏</button>
      </div>
    </div>

    <NavigationBar 
      :currentView="currentView"
      :currentUser="currentUser"
      @change-view="changeView"
    />

    <!-- 全景视图 -->
    <PanoramaView 
      v-if="currentView === 'panorama'"
      :progress="progress"
      :foundKeys="foundKeys"
      @enter-location="enterLocation"
    />

    <!-- 游戏视图 -->
    <GameView 
      v-else-if="currentView === 'game'"
      :currentLocation="currentLocation"
      :progress="progress"
      :foundKeys="foundKeys"
      :gameLog="gameLog"
      @back-to-panorama="backToPanorama"
      @explore-location="exploreLocation"
      @reset-adventure="resetAdventure"
    />

    <!-- 用户管理 -->
    <UserManagement 
      v-else-if="currentView === 'user'"
      :currentUser="currentUser"
      @login="handleLogin"
      @register="handleRegister"
      @logout="handleLogout"
    />

    <!-- 排行榜 -->
    <RankingView 
      v-else-if="currentView === 'ranking'"
      :rankings="rankings"
      :currentUser="currentUser"
    />

    <MusicControl 
      :music-enabled="musicEnabled"
      @toggle-music="toggleMusic"
    />
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useGameState } from './composables/useGameState'
import { useMusicManager } from './composables/useMusicManager'
import { useUserManager } from './composables/useUserManager'

// 组件导入
import NavigationBar from './components/layout/NavigationBar.vue'
import PanoramaView from './components/views/PanoramaView.vue'
import GameView from './components/views/GameView.vue'
import UserManagement from './components/views/UserManagement.vue'
import RankingView from './components/views/RankingView.vue'
import MusicControl from './components/UI/MusicControl.vue'

export default {
  name: 'App',
  components: {
    NavigationBar,
    PanoramaView,
    GameView,
    UserManagement,
    RankingView,
    MusicControl
  },
  setup() {
    const currentView = ref('panorama')
    const currentLocation = ref(null)
    
    // 新增：音乐提示状态
    const showMusicPrompt = ref(true)

    // 使用组合式函数
    const {
      progress,
      foundKeys,
      gameLog,
      updateProgress,
      addFoundKey,
      addGameLog,
      resetGameState,
      saveGameState
    } = useGameState()

    // 修改：添加 resumePlay
    const {
      musicEnabled,
      toggleMusic,
      playMusic,
      resumePlay
    } = useMusicManager()

    const {
      currentUser,
      rankings,
      loginUser,
      registerUser,
      logoutUser,
      updateUserProgress
    } = useUserManager()

    // 计算属性
    const locationTitle = computed(() => {
      const titles = {
        'library': '📚 古老图书馆',
        'waterfall': '🌊 神秘瀑布',
        'ancient-tree': '🌳 千年古树',
        'maze': '🌀 地下迷宫',
        'temple': '🏛️ 古老神庙'
      }
      return titles[currentLocation.value] || '🏴‍☠️ 神秘宝藏探险'
    })

    // 新增：关闭音乐提示并恢复播放
    const closeMusicPrompt = () => {
      showMusicPrompt.value = false
      // 用户交互后恢复音乐播放
      resumePlay()
      if (musicEnabled.value) {
        playMusic('panorama')
      }
    }

    // 修改：处理用户交互
    const handleUserInteraction = () => {
      resumePlay()
    }

    // 方法
    const changeView = (view) => {
      currentView.value = view
      if (view === 'panorama') {
        playMusic('panorama')
      }
    }

    const enterLocation = (location) => {
      currentLocation.value = location
      currentView.value = 'game'
      playMusic(location)
      saveGameState()
    }

    const backToPanorama = () => {
      currentView.value = 'panorama'
      playMusic('panorama')
      saveGameState()
    }

    const exploreLocation = async () => {
      if (!currentLocation.value) return

      const locationName = getLocationName(currentLocation.value)
      addGameLog(`🔍 开始探索${locationName}...`)

      try {
        let result
        
        switch (currentLocation.value) {
          case 'library':
            result = await exploreLibrary()
            addGameLog("📚 " + result)
            updateProgress(progress.value + 10)
            
            if (Math.random() > 0.5) {
              const decoded = await decodeClue(result)
              addGameLog(decoded)
              updateProgress(progress.value + 5)
            }
            break
            
          case 'waterfall':
            result = await exploreWaterfall()
            addGameLog("🌊 " + result)
            if (result.includes("找到了第一把")) {
              addFoundKey(1)
              updateProgress(progress.value + 20)
            }
            break
            
          case 'ancient-tree':
            result = await exploreAncientTree()
            addGameLog("🌳 " + result)
            if (result.includes("找到了第二把")) {
              addFoundKey(2)
              updateProgress(progress.value + 20)
            }
            break
            
          case 'maze':
            result = await exploreMaze()
            addGameLog("🌀 " + result)
            if (result.includes("找到了第三把")) {
              addFoundKey(3)
              updateProgress(progress.value + 20)
            }
            break
            
          case 'temple':
            const keysCount = foundKeys.value.length
            result = await exploreTemple(keysCount)
            addGameLog("🏛️ " + result)
            
            if (result.includes("魔法水晶宝藏")) {
              updateProgress(100)
              // 更新用户进度到排行榜
              if (currentUser.value) {
                updateUserProgress(currentUser.value.username, progress.value)
              }
            }
            break
        }
        
      } catch (error) {
        addGameLog("❌ " + error.message, 'error')
      }
      
      saveGameState()
    }

    const resetAdventure = () => {
      resetGameState()
      addGameLog("游戏已重置，可以重新开始探险!")
    }

    const handleLogin = (userData) => {
      const success = loginUser(userData)
      if (success) {
        addGameLog(`欢迎回来，${userData.username}！`)
      }
      return success
    }

    const handleRegister = (userData) => {
      const success = registerUser(userData)
      if (success) {
        addGameLog(`欢迎加入，${userData.username}！`)
      }
      return success
    }

    const handleLogout = () => {
      logoutUser()
      addGameLog("已退出登录")
    }

    // 游戏逻辑函数
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

    const exploreLibrary = async () => {
      await delay(1000)
      const clues = [
        "在尘封的古书中发现线索：'当三把钥匙齐聚，神庙之门将开启'",
        "破译古老地图：钥匙分别藏在瀑布、古树和迷宫中",
        "解读星象图：满月之夜是寻找宝藏的最佳时机",
        "发现古老日记：'瀑布后的青铜钥匙，古树顶的银制钥匙，迷宫中的金制钥匙'",
        "翻译古老碑文：'三钥合一，神庙现世'"
      ]
      return clues[Math.floor(Math.random() * clues.length)]
    }

    const exploreWaterfall = async () => {
      await delay(1200)
      if (Math.random() < 0.3) {
        throw new Error("瀑布水流太急，无法靠近!")
      }
      return "在瀑布后的洞穴中找到了第一把青铜钥匙!"
    }

    const exploreAncientTree = async () => {
      await delay(1200)
      if (Math.random() < 0.25) {
        throw new Error("古树的守卫鸟群发起了攻击!")
      }
      return "在古树顶端的鸟巢中找到了第二把银制钥匙!"
    }

    const exploreMaze = async () => {
      await delay(1500)
      if (Math.random() < 0.35) {
        throw new Error("在迷宫中迷路了，需要重新探索!")
      }
      return "在迷宫中心的石台上找到了第三把金制钥匙!"
    }

    const exploreTemple = async (keysCount) => {
      await delay(2000)
      
      if (keysCount < 3) {
        throw new Error(`还需要${3 - keysCount}把钥匙才能进入神庙!`)
      }
      
      if (Math.random() < 0.4) {
        throw new Error("触发了神庙的古老机关!")
      }
      
      return "🎉 恭喜! 你成功进入神庙深处，发现了传说中的魔法水晶宝藏!"
    }

    const decodeClue = async (clue) => {
      await delay(1000)
      const decodings = {
        "在尘封的古书中发现线索：'当三把钥匙齐聚，神庙之门将开启'": "🔍 解密：需要集齐三把钥匙才能打开神庙大门",
        "破译古老地图：钥匙分别藏在瀑布、古树和迷宫中": "🔍 解密：明确指出了三把钥匙的藏匿地点",
        "解读星象图：满月之夜是寻找宝藏的最佳时机": "🔍 解密：建议在特定时间进行探索",
        "发现古老日记：'瀑布后的青铜钥匙，古树顶的银制钥匙，迷宫中的金制钥匙'": "🔍 解密：详细描述了每把钥匙的位置和材质",
        "翻译古老碑文：'三钥合一，神庙现世'": "🔍 解密：强调了三把钥匙的重要性"
      }
      return decodings[clue] || "🔍 解密成功! 这条线索很有价值..."
    }

    const getLocationName = (location) => {
      const names = {
        'library': '古老图书馆',
        'waterfall': '神秘瀑布',
        'ancient-tree': '千年古树',
        'maze': '地下迷宫',
        'temple': '古老神庙'
      }
      return names[location] || '未知地点'
    }

    // 修改 onMounted
    onMounted(() => {
      // 添加全局点击事件监听
      document.addEventListener('click', handleUserInteraction, { once: true })
      
      // 初始化音乐（可能被浏览器阻止）
      if (musicEnabled.value) {
        playMusic('panorama')
      }
    })

    return {
      currentView,
      currentLocation,
      progress,
      foundKeys,
      gameLog,
      musicEnabled,
      currentUser,
      rankings,
      // 新增：返回音乐提示状态和方法
      showMusicPrompt,
      closeMusicPrompt,
      // 原有的返回项保持不变
      locationTitle,
      changeView,
      enterLocation,
      backToPanorama,
      exploreLocation,
      resetAdventure,
      toggleMusic,
      handleLogin,
      handleRegister,
      handleLogout
    }
  }
}
</script>

<style scoped>
/* 音乐提示样式 */
.music-prompt {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
}

.prompt-content {
  background: rgba(255, 255, 255, 0.1);
  padding: 30px;
  border-radius: 15px;
  text-align: center;
  backdrop-filter: blur(10px);
  border: 2px solid #ffd700;
  max-width: 400px;
  margin: 20px;
}

.prompt-content h3 {
  color: #ffd700;
  margin-bottom: 15px;
  font-size: 1.5em;
}

.prompt-content p {
  color: #ccc;
  margin-bottom: 20px;
  font-size: 1.1em;
}

.prompt-content button {
  background: linear-gradient(45deg, #4ecdc4, #44a08d);
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 25px;
  cursor: pointer;
  font-size: 1.1em;
  transition: all 0.3s ease;
}

.prompt-content button:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}
</style>
