<script setup lang="ts">
defineProps<{
  content: string
}>()
</script>

<template>
  <div class="narrative reveal">
    <div class="narrative-inner">
      <span class="line-left"></span>
      <p class="narrative-content">{{ content }}</p>
      <span class="line-right"></span>
    </div>
  </div>
</template>

<style scoped>
.narrative {
  padding: var(--space-4xl) 20px;
  text-align: center;
}

.narrative-inner {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
  max-width: 600px;
  margin: 0 auto;
}

.narrative-content {
  font-family: var(--font-display);
  font-size: 20px;
  color: var(--text-accent);
  letter-spacing: 0.15em;
  line-height: 2;
  white-space: nowrap;
}

.line-left,
.line-right {
  display: block;
  flex: 1;
  max-width: 80px;
  height: 1px;
  background: linear-gradient(to right, transparent, var(--text-accent, rgba(180,150,110,0.3)));
}

.line-right {
  background: linear-gradient(to left, transparent, var(--text-accent, rgba(180,150,110,0.3)));
}

@media (max-width: 767px) {
  .narrative-content {
    font-size: 17px;
    letter-spacing: 0.12em;
  }

  .narrative-inner {
    gap: 16px;
  }

  .line-left,
  .line-right {
    max-width: 40px;
  }
}
</style>
