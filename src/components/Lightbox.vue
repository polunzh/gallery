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
const imageContainer = ref<HTMLElement | null>(null)
const isZoomed = ref(false)
const zoomScale = ref(1)
const panX = ref(0)
const panY = ref(0)
const dragOffsetY = ref(0)
const isDragging = ref(false)

// Double tap to zoom
let lastTapTime = 0
function onImageTap(e: MouseEvent | TouchEvent) {
  const currentTime = Date.now()
  const tapInterval = currentTime - lastTapTime
  if (tapInterval < 300 && tapInterval > 0) {
    // Double tap
    if (isZoomed.value) {
      resetZoom()
    } else {
      zoomScale.value = 2
      isZoomed.value = true
      // Center zoom on tap point
      const rect = (e.target as HTMLElement).getBoundingClientRect()
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
      panX.value = (rect.left + rect.width / 2 - clientX) * 0.5
      panY.value = (rect.top + rect.height / 2 - clientY) * 0.5
    }
  }
  lastTapTime = currentTime
}

function resetZoom() {
  isZoomed.value = false
  zoomScale.value = 1
  panX.value = 0
  panY.value = 0
}

// Swipe to navigate (only when not zoomed)
useSwipe(swipeTarget, {
  onSwipe(e: TouchEvent, direction: string, diffX: number, diffY: number) {
    if (isZoomed.value) return

    // Pull down to close
    if (diffY > 0 && Math.abs(diffY) > Math.abs(diffX) && diffY > 80) {
      dragOffsetY.value = diffY
    }
  },
  onSwipeEnd(e: TouchEvent, direction: string, diffX: number, diffY: number) {
    if (isZoomed.value) {
      resetZoom()
      return
    }

    // Pull down to close threshold
    if (diffY > 0 && Math.abs(diffY) > Math.abs(diffX) && diffY > 100) {
      emit('close')
      return
    }

    dragOffsetY.value = 0

    if (direction === 'left') next()
    else if (direction === 'right') prev()
  },
})

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') emit('close')
}

function preventScroll(e: TouchEvent) {
  if (!isZoomed.value) {
    e.preventDefault()
  }
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
  if (isZoomed.value) {
    resetZoom()
    return
  }
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
      <div class="lb-image-area" :style="{ transform: `translateY(${dragOffsetY}px)` }">
        <div class="lb-card" :class="{ 'is-zoomed': isZoomed }">
          <div
            ref="imageContainer"
            class="image-zoom-container"
            @click="onImageTap"
          >
            <img
              :src="current.src"
              :alt="current.caption || ''"
              :key="currentIndex"
              :style="{
                transform: `scale(${zoomScale}) translate(${panX}px, ${panY}px)`,
                cursor: isZoomed ? 'grab' : 'zoom-in'
              }"
            >
          </div>
          <div class="lb-info">
            <div class="lb-text">
              <span v-if="current.caption" class="lb-caption">{{ current.caption }}</span>
              <span v-if="current.description" class="lb-description">{{ current.description }}</span>
            </div>
            <span class="lb-counter">{{ currentIndex + 1 }} / {{ images.length }}</span>
          </div>
          <!-- Touch hint -->
          <div v-if="currentIndex === 0" class="touch-hint">
            <span>左右滑动切换 · 双击放大 · 下拉关闭</span>
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

.image-zoom-container {
  overflow: hidden;
  border-radius: var(--radius-sm);
}

.lb-card img {
  max-width: 100%;
  max-height: calc(100vh - 180px);
  object-fit: contain;
  border-radius: var(--radius-sm);
  user-select: none;
  -webkit-user-drag: none;
  transition: transform 0.3s ease;
  touch-action: none;
}

.lb-card.is-zoomed img {
  cursor: grab;
}

.touch-hint {
  text-align: center;
  margin-top: 12px;
  font-size: 12px;
  color: var(--text-muted);
  opacity: 0.7;
}

@media (max-width: 767px) {
  .touch-hint {
    font-size: 11px;
  }
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
  font-size: 14px;
  color: var(--text-secondary);
  letter-spacing: 0.02em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.lb-counter {
  font-size: 13px;
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
    padding: 60px 8px 8px;
  }

  .lb-card img {
    max-height: calc(100vh - 180px);
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

  .lb-caption {
    font-size: 16px;
  }

  .lb-description {
    white-space: normal;
    font-size: 13px;
  }

  .lb-counter {
    font-size: 12px;
  }

  .touch-hint {
    font-size: 11px;
  }
}
</style>
