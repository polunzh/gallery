import { ref, onMounted, onUnmounted } from 'vue'

export interface LightboxImage {
  src: string
  caption?: string
  description?: string
}

export function useLightbox(images: () => LightboxImage[], initialIndex: number) {
  const currentIndex = ref(initialIndex)

  function next() {
    const list = images()
    currentIndex.value = (currentIndex.value + 1) % list.length
  }

  function prev() {
    const list = images()
    currentIndex.value = (currentIndex.value - 1 + list.length) % list.length
  }

  function onKeydown(e: KeyboardEvent) {
    if (e.key === 'ArrowRight') next()
    else if (e.key === 'ArrowLeft') prev()
  }

  onMounted(() => {
    document.addEventListener('keydown', onKeydown)
    document.body.style.overflow = 'hidden'
  })

  onUnmounted(() => {
    document.removeEventListener('keydown', onKeydown)
    document.body.style.overflow = ''
  })

  return { currentIndex, next, prev }
}
