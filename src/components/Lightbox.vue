<script setup lang="ts">
import { computed } from 'vue'
import { useSwipe } from '@vueuse/core'
import { ref } from 'vue'
import { useLightbox, type LightboxImage } from '@/composables/useLightbox'

const props = defineProps<{
  images: LightboxImage[]
  initialIndex: number
}>()

const emit = defineEmits<{
  close: []
}>()

const { currentIndex, next, prev } = useLightbox(
  () => props.images,
  props.initialIndex,
)

const current = computed(() => props.images[currentIndex.value])

const swipeTarget = ref<HTMLElement | null>(null)
useSwipe(swipeTarget, {
  onSwipeEnd(_e, direction) {
    if (direction === 'left') next()
    else if (direction === 'right') prev()
  },
})

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') emit('close')
}

// Register Escape separately since useLightbox handles arrows
import { onMounted, onUnmounted } from 'vue'
onMounted(() => document.addEventListener('keydown', onKeydown))
onUnmounted(() => document.removeEventListener('keydown', onKeydown))

function onBackdropClick(e: MouseEvent) {
  if ((e.target as HTMLElement).classList.contains('lightbox')) {
    emit('close')
  }
}
</script>

<template>
  <Teleport to="body">
    <div ref="swipeTarget" class="lightbox" @click="onBackdropClick">
      <button class="lb-close" @click="emit('close')" aria-label="关闭">✕</button>
      <button class="lb-nav lb-prev" @click="prev" aria-label="上一张">‹</button>
      <button class="lb-nav lb-next" @click="next" aria-label="下一张">›</button>

      <img :src="current.src" :alt="current.caption || ''" :key="currentIndex">

      <div v-if="current.caption" class="lb-caption">{{ current.caption }}</div>
      <div class="lb-counter">{{ currentIndex + 1 }} / {{ images.length }}</div>
    </div>
  </Teleport>
</template>

<style scoped>
.lightbox {
  position: fixed;
  inset: 0;
  z-index: 200;
  background: rgba(0, 0, 0, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: zoom-out;
  animation: fade-in var(--duration-fast) ease;
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

.lightbox img {
  max-width: 92vw;
  max-height: 88vh;
  object-fit: contain;
  border-radius: var(--radius-sm);
  cursor: default;
  user-select: none;
  -webkit-user-drag: none;
}

.lb-close {
  position: absolute;
  top: 20px;
  right: 24px;
  color: var(--text-secondary);
  font-size: 22px;
  cursor: pointer;
  background: none;
  border: none;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color var(--duration-fast) ease;
}

.lb-close:hover {
  color: var(--text-primary);
}

.lb-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-muted);
  font-size: 36px;
  cursor: pointer;
  padding: 20px;
  background: none;
  border: none;
  transition: color var(--duration-fast) ease;
}

.lb-nav:hover {
  color: var(--text-secondary);
}

.lb-prev { left: 12px; }
.lb-next { right: 12px; }

.lb-caption {
  position: absolute;
  bottom: 36px;
  left: 50%;
  transform: translateX(-50%);
  font-family: var(--font-display);
  font-size: 14px;
  color: var(--text-secondary);
  letter-spacing: 0.08em;
}

.lb-counter {
  position: absolute;
  bottom: 36px;
  right: 32px;
  font-size: 12px;
  color: var(--text-muted);
  letter-spacing: 0.05em;
}

@media (max-width: 767px) {
  .lb-nav { display: none; }

  .lb-caption {
    bottom: 24px;
    font-size: 13px;
  }

  .lb-counter {
    bottom: 24px;
    right: 20px;
  }
}
</style>
