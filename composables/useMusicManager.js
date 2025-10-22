import { ref, computed } from 'vue'

class MusicManager {
  static musicFiles = {
    'panorama': './backgroundBGM.mp3',
    'library': './libraryBGM.mp3', 
    'waterfall': './waterfall.mp3',
    'ancient-tree': './treeBGM.mp3',
    'maze': './mazeBGM.mp3',
    'temple': './templeBGM.mp3'
  }
  
  static currentAudio = null
  static pendingAudio = null // 添加等待播放的音频
  
  static playMusic(location) {
    this.stopMusic()
    
    const musicFile = this.musicFiles[location]
    if (musicFile) {
      this.currentAudio = new Audio(musicFile)
      this.currentAudio.loop = true
      this.currentAudio.volume = 0.3
      
      // 添加错误处理
      this.currentAudio.addEventListener('error', (e) => {
        console.error('音乐文件加载失败:', musicFile, e)
        // 使用备用在线音乐
        this.useFallbackMusic(location)
      })
      
      this.currentAudio.play().then(() => {
        console.log('音乐开始播放:', location)
      }).catch(e => {
        console.log('自动播放被阻止，等待用户交互:', e)
        // 保存音频对象，等待用户交互
        this.pendingAudio = this.currentAudio
      })
    }
  }
  
  // 备用在线音乐
  static useFallbackMusic(location) {
    const fallbackMusic = {
      'panorama': 'https://assets.mixkit.co/music/preview/mixkit-tech-house-vibes-130.mp3',
      'library': 'https://assets.mixkit.co/music/preview/mixkit-driving-ambition-32.mp3',
      'waterfall': 'https://assets.mixkit.co/sfx/preview/mixkit-waterfall-in-the-jungle-1212.mp3',
      'ancient-tree': 'https://assets.mixkit.co/music/preview/mixkit-deep-urban-623.mp3',
      'maze': 'https://assets.mixkit.co/music/preview/mixkit-creepy-suspense-740.mp3',
      'temple': 'https://assets.mixkit.co/music/preview/mixkit-epic-orchestra-354.mp3'
    }
    
    const fallbackFile = fallbackMusic[location]
    if (fallbackFile) {
      console.log('使用备用音乐:', fallbackFile)
      this.currentAudio = new Audio(fallbackFile)
      this.currentAudio.loop = true
      this.currentAudio.volume = 0.3
      this.currentAudio.play().catch(e => {
        console.log('备用音乐自动播放被阻止:', e)
        this.pendingAudio = this.currentAudio
      })
    }
  }
  
  // 用户交互后恢复播放
  static resumePlay() {
    if (this.pendingAudio) {
      this.pendingAudio.play().then(() => {
        console.log('用户交互后音乐恢复播放')
        this.pendingAudio = null
      }).catch(e => {
        console.error('恢复播放失败:', e)
      })
    }
  }
  
  static stopMusic() {
    if (this.currentAudio) {
      this.currentAudio.pause()
      this.currentAudio = null
    }
    this.pendingAudio = null
  }
}

export function useMusicManager() {
  const musicEnabled = ref(true)

  const toggleMusic = () => {
    musicEnabled.value = !musicEnabled.value
    if (!musicEnabled.value) {
      MusicManager.stopMusic()
    } else {
      MusicManager.playMusic('panorama')
    }
  }

  const playMusic = (location) => {
    if (musicEnabled.value) {
      MusicManager.playMusic(location)
    }
  }

  // 添加恢复播放方法
  const resumePlay = () => {
    MusicManager.resumePlay()
  }

  return {
    musicEnabled,
    toggleMusic,
    playMusic,
    resumePlay
  }
}
