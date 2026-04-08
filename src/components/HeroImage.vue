<script setup lang="ts">
defineProps<{
  src: string
  caption?: string
  description?: string
}>()

defineEmits<{
  click: []
}>()
</script>

<template>
  <div class="hero reveal" @click="$emit('click')">
    <img :src="src" :alt="caption || ''" loading="eager">
    <div class="hero-overlay">
      <div class="hero-info">
        <h2 v-if="caption" class="hero-caption">{{ caption }}</h2>
        <p v-if="description" class="hero-description">{{ description }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.hero {
  position: relative;
  width: 100vw;
  height: 75vh;
  min-height: 400px;
  overflow: hidden;
  cursor: pointer;
  margin-bottom: var(--space-2xl);
}

.hero img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--duration-normal) var(--ease-out);
}

.hero:hover img {
  transform: scale(1.015);
}

/* Touch feedback */
.hero:active img {
  transform: scale(0.98);
  opacity: 0.9;
}

@media (hover: none) {
  .hero:hover img {
    transform: none;
  }
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(10, 10, 10, 0.85) 0%,
    rgba(10, 10, 10, 0.4) 40%,
    rgba(10, 10, 10, 0.1) 70%,
    transparent 100%
  );
  display: flex;
  align-items: flex-end;
  padding: 56px 60px;
}

.hero-caption {
  font-family: var(--font-display);
  font-size: 42px;
  font-weight: 700;
  color: var(--text-accent-light);
  letter-spacing: 0.08em;
  text-shadow: 0 2px 20px rgba(0, 0, 0, 0.5);
}

.hero-description {
  margin-top: 8px;
  font-size: 14px;
  color: var(--text-secondary);
  letter-spacing: 0.04em;
  text-shadow: 0 1px 10px rgba(0, 0, 0, 0.5);
}

@media (max-width: 767px) {
  .hero {
    height: 50vh;
    min-height: 280px;
  }

  .hero-caption {
    font-size: 28px;
  }

  .hero-description {
    font-size: 13px;
  }

  .hero-overlay {
    padding: 32px 24px;
  }
}
</style>
