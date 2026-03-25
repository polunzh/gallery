<script setup lang="ts">
import { ref } from 'vue'

const track = ref<HTMLElement | null>(null)
let isDown = false
let startX = 0
let scrollLeft = 0

function onMouseDown(e: MouseEvent) {
  isDown = true
  startX = e.pageX - (track.value?.offsetLeft || 0)
  scrollLeft = track.value?.scrollLeft || 0
  track.value?.classList.add('grabbing')
}

function onMouseUp() {
  isDown = false
  track.value?.classList.remove('grabbing')
}

function onMouseMove(e: MouseEvent) {
  if (!isDown || !track.value) return
  e.preventDefault()
  const x = e.pageX - track.value.offsetLeft
  track.value.scrollLeft = scrollLeft - (x - startX) * 1.5
}
</script>

<template>
  <div
    ref="track"
    class="scroll-track"
    @mousedown="onMouseDown"
    @mouseup="onMouseUp"
    @mouseleave="onMouseUp"
    @mousemove="onMouseMove"
  >
    <slot />
  </div>
</template>

<style scoped>
.scroll-track {
  display: flex;
  gap: 16px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  cursor: grab;
  padding-bottom: 8px;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.scroll-track::-webkit-scrollbar {
  display: none;
}

.scroll-track.grabbing {
  cursor: grabbing;
}

.scroll-track :deep(> *) {
  scroll-snap-align: start;
  flex-shrink: 0;
}
</style>
