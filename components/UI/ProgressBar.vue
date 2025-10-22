<template>
  <div class="progress-container">
    <div class="progress-bar">
      <div 
        class="progress" 
        :style="{ width: progress + '%' }"
      ></div>
    </div>
    <div class="progress-text">{{ progress }}%</div>
  </div>
</template>

<script>
export default {
  name: 'ProgressBar',
  props: {
    progress: {
      type: Number,
      default: 0,
      validator: (value) => value >= 0 && value <= 100
    }
  }
}
</script>

<style scoped>
.progress-container {
  margin: 10px 0;
}

.progress-bar {
  height: 20px;
  background: #333;
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 5px;
}

.progress {
  height: 100%;
  background: linear-gradient(90deg, #ff6b6b, #ffd93d, #6bcf7f);
  transition: width 0.5s ease;
  border-radius: 10px;
}

.progress-text {
  text-align: center;
  font-size: 0.9em;
  color: #ccc;
}
</style>