<template>
  <div class="log-container">
    <div 
      v-for="(log, index) in logs" 
      :key="index"
      class="log-entry"
    >
      {{ log.message }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'GameLog',
  props: {
    logs: {
      type: Array,
      default: () => []
    }
  },
  updated() {
    this.scrollToBottom()
  },
  methods: {
    scrollToBottom() {
      const container = this.$el
      container.scrollTop = container.scrollHeight
    }
  }
}
</script>

<style scoped>
.log-container {
  background: rgba(0, 0, 0, 0.8);
  border-radius: 10px;
  padding: 15px;
  height: 200px;
  overflow-y: auto;
  border: 1px solid #444;
}

.log-entry {
  margin: 8px 0;
  padding: 8px;
  border-radius: 5px;
  animation: fadeIn 0.5s ease;
  background: rgba(255, 255, 255, 0.05);
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>