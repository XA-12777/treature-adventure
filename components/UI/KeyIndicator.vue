<template>
  <div class="keys-container">
    <div 
      v-for="key in 3" 
      :key="key"
      class="key" 
      :class="{ found: foundKeys.includes(key) }"
    >
      {{ key }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'KeyIndicator',
  props: {
    foundKeys: {
      type: Array,
      default: () => []
    }
  }
}
</script>

<style scoped>
.keys-container {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin: 10px 0;
}

.key {
  width: 40px;
  height: 40px;
  background: gold;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  opacity: 0.3;
  transition: all 0.5s ease;
}

.key.found {
  opacity: 1;
  transform: scale(1.2);
  box-shadow: 0 0 20px gold;
}
</style>