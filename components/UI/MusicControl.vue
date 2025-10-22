<template>
  <button 
    class="music-control" 
    @click="$emit('toggle-music')"
    :title="musicEnabled ? '关闭音乐' : '开启音乐'"
  >
    {{ musicEnabled ? '🔊' : '🔇' }}
  </button>
</template>

<script>
export default {
  name: 'MusicControl',
  props: {
    musicEnabled: {
      type: Boolean,
      default: true
    }
  },
  emits: ['toggle-music']
}
</script>

<style scoped>
.music-control {
  position: fixed;
  top: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  color: white;
  font-size: 1.2em;
  cursor: pointer;
  backdrop-filter: blur(10px);
  z-index: 1000;
  transition: all 0.3s ease;
}

.music-control:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}
</style>