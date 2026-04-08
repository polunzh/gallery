import { onMounted, onUnmounted, type Ref } from 'vue'

export function useScrollReveal(containerRef: Ref<HTMLElement | null>) {
  let observer: IntersectionObserver | null = null

  onMounted(() => {
    // Respect reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (prefersReducedMotion) {
              // Immediately show without animation
              entry.target.classList.add('visible')
            } else {
              // Use normal reveal animation
              entry.target.classList.add('visible')
            }
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' },
    )

    if (containerRef.value) {
      const elements = containerRef.value.querySelectorAll('.reveal')
      elements.forEach((el) => {
        // If reduced motion, skip animation by immediately adding visible class
        if (prefersReducedMotion) {
          el.classList.add('visible')
        } else {
          observer!.observe(el)
        }
      })
    }
  })

  onUnmounted(() => {
    observer?.disconnect()
  })
}
