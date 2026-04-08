import { ref } from 'vue'

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

  return { currentIndex, next, prev }
}
