<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useSwipe } from '@vueuse/core'
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

function preventScroll(e: TouchEvent) {
  e.preventDefault()
}

onMounted(() => {
  document.addEventListener('keydown', onKeydown)
  document.addEventListener('touchmove', preventScroll, { passive: false })
})
onUnmounted(() => {
  document.removeEventListener('keydown', onKeydown)
  document.removeEventListener('touchmove', preventScroll)
})

function onBackdropClick(e: MouseEvent) {
  const el = e.target as HTMLElement
  if (el.classList.contains('lightbox') || el.classList.contains('lb-image-area')) {
    emit('close')
  }
}
</script>

<template>
  <Teleport to="body">
    <div ref="swipeTarget" class="lightbox" @click="onBackdropClick">
      <!-- Close button -->
      <button class="lb-close" @click="emit('close')" aria-label="关闭">✕</button>

      <!-- Desktop nav -->
      <button class="lb-nav lb-prev" @click="prev" aria-label="上一张">‹</button>
      <button class="lb-nav lb-next" @click="next" aria-label="下一张">›</button>

      <!-- Centered content block -->
      <div class="lb-image-area">
        <div class="lb-card">
          <img :src="current.src" :alt="current.caption || ''" :key="currentIndex">
          <div class="lb-info">
            <div class="lb-text">
              <span v-if="current.caption" class="lb-caption">{{ current.caption }}</span>
              <span v-if="current.description" class="lb-description">{{ current.description }}</span>
            </div>
            <span class="lb-counter">{{ currentIndex + 1 }} / {{ images.length }}</span>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.lightbox {
  position: fixed;
  inset: 0;
  z-index: 200;
  background: #000;
  touch-action: none;
  overscroll-behavior: contain;
  animation: fade-in var(--duration-fast) ease;
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

.lb-close {
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 10;
  color: var(--text-secondary);
  font-size: 20px;
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

/* ── Image area: fills the screen, centers content ── */
.lb-image-area {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px 60px;
  cursor: zoom-out;
}

/* ── Card: image + info grouped together ── */
.lb-card {
  max-width: 100%;
  max-height: 100%;
  display: flex;
  flex-direction: column;
  cursor: default;
}

.lb-card img {
  max-width: 100%;
  max-height: calc(100vh - 140px);
  object-fit: contain;
  border-radius: var(--radius-sm);
  user-select: none;
  -webkit-user-drag: none;
}

.lb-info {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-top: 14px;
  gap: 16px;
}

.lb-text {
  display: flex;
  align-items: baseline;
  gap: 10px;
  min-width: 0;
}

.lb-caption {
  font-family: var(--font-display);
  font-size: 15px;
  color: var(--text-accent);
  letter-spacing: 0.06em;
  flex-shrink: 0;
}

.lb-description {
  font-size: 13px;
  color: var(--text-secondary);
  letter-spacing: 0.02em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.lb-counter {
  font-size: 12px;
  color: var(--text-muted);
  letter-spacing: 0.05em;
  flex-shrink: 0;
}

/* ── Desktop nav ── */
.lb-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
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

.lb-prev { left: 8px; }
.lb-next { right: 8px; }

/* ── Mobile ── */
@media (max-width: 767px) {
  .lb-nav { display: none; }

  .lb-image-area {
    padding: 56px 8px 8px;
  }

  .lb-card img {
    max-height: calc(100vh - 160px);
  }

  .lb-info {
    flex-direction: column;
    gap: 6px;
    margin-top: 12px;
    padding: 0 4px;
  }

  .lb-text {
    flex-direction: column;
    gap: 4px;
  }

  .lb-description {
    white-space: normal;
    font-size: 12px;
  }
}
</style>
