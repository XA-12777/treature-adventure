import { ref, computed } from 'vue'

class MusicManager {
  static musicFiles = {
    'panorama': 'backgroundBGM.mp3',
    'library': 'libraryBGM.mp3',
    'waterfall': 'waterfall.mp3',
    'ancient-tree': 'treeBGM.mp3',
    'maze': 'mazeBGM.mp3',
    'temple': 'templeBGM.mp3'
  }
  
  static currentAudio = null
  
  static playMusic(location) {
    this.stopMusic()
    
    const musicFile = this.musicFiles[location]
    if (musicFile) {
      this.currentAudio = new Audio(musicFile)
      this.currentAudio.loop = true
      this.currentAudio.volume = 0.3
      this.currentAudio.play().catch(e => console.log('自动播放被阻止，需要用户交互'))
    }
  }
  
  static stopMusic() {
    if (this.currentAudio) {
      this.currentAudio.pause()
      this.currentAudio = null
    }
  }
}

export function useMusicManager() {
  const musicEnabled = ref(true)

  const toggleMusic = () => {
    musicEnabled.value = !musicEnabled.value
    if (!musicEnabled.value) {
      MusicManager.stopMusic()
    } else {
      // 重新播放当前音乐
      MusicManager.playMusic('panorama')
    }
  }

  const playMusic = (location) => {
    if (musicEnabled.value) {
      MusicManager.playMusic(location)
    }
  }

  return {
    musicEnabled,
    toggleMusic,
    playMusic
  }
}
