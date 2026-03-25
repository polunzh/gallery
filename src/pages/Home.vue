<script setup lang="ts">
import { ref } from 'vue'
import { useHead } from '@unhead/vue'
import albums from 'virtual:albums'
import { useScrollReveal } from '@/composables/useScrollReveal'
import AlbumCard from '@/components/AlbumCard.vue'
import SiteFooter from '@/components/SiteFooter.vue'

const containerRef = ref<HTMLElement | null>(null)
useScrollReveal(containerRef)

useHead({ title: '拾光' })
</script>

<template>
  <div ref="containerRef" class="home">
    <header class="home-header reveal">
      <h1 class="site-title">拾光</h1>
    </header>

    <main class="album-grid">
      <AlbumCard
        v-for="album in albums"
        :key="album.id"
        :album="album"
        class="reveal"
      />
    </main>

    <SiteFooter />
  </div>
</template>

<style scoped>
.home {
  min-height: 100vh;
  padding: 0 40px 120px;
  max-width: var(--max-width);
  margin: 0 auto;
}

.home-header {
  padding: 80px 0 60px;
}

.site-title {
  font-family: var(--font-display);
  font-size: 28px;
  font-weight: 700;
  color: var(--text-accent-light);
  letter-spacing: 0.02em;
}

.album-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 48px;
}

@media (max-width: 767px) {
  .home {
    padding: 0 20px 80px;
  }

  .home-header {
    padding: 48px 0 32px;
  }

  .site-title {
    font-size: 22px;
  }

  .album-grid {
    gap: 32px;
  }
}
</style>
