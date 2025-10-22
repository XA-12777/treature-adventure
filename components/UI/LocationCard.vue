<template>
  <div class="location-card" @click="$emit('click')">
    <div class="location-icon">{{ location.icon }}</div>
    <h3>{{ location.name }}</h3>
    <p>{{ location.description }}</p>
  </div>
</template>

<script>
export default {
  name: 'LocationCard',
  props: {
    location: {
      type: Object,
      required: true
    }
  },
  emits: ['click']
}
</script>

<style scoped>
.location-card {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  backdrop-filter: blur(10px);
}

.location-card:hover {
  transform: translateY(-5px);
  border-color: #ffd700;
  box-shadow: 0 10px 25px rgba(255, 215, 0, 0.3);
}

.location-icon {
  font-size: 3em;
  margin-bottom: 10px;
}

.location-card h3 {
  margin-bottom: 10px;
  color: #ffd700;
}

.location-card p {
  color: #ccc;
  font-size: 0.9em;
}
</style>