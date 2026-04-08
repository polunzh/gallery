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
      <p class="site-subtitle">影像留存的时间</p>
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
  padding: 100px 0 60px;
  text-align: center;
}

.site-title {
  font-family: var(--font-display);
  font-size: 36px;
  font-weight: 700;
  color: var(--text-accent-light);
  letter-spacing: -0.02em;
}

.site-subtitle {
  margin-top: 12px;
  font-size: 14px;
  color: var(--text-muted);
  letter-spacing: 0.1em;
}

/* Masonry layout - Spotify/Pinterest inspired */
.album-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 32px;
}

@media (min-width: 768px) {
  .album-grid {
    /* Masonry-like asymmetric grid */
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
  }

  /* Every other card spans full width for visual rhythm */
  .album-grid > *:nth-child(3n) {
    grid-column: 1 / -1;
  }
}

@media (max-width: 767px) {
  .home {
    padding: 0 20px 80px;
  }

  .home-header {
    padding: 60px 0 40px;
  }

  .site-title {
    font-size: 28px;
  }

  .site-subtitle {
    font-size: 13px;
  }

  .album-grid {
    gap: 24px;
  }
}
</style>
