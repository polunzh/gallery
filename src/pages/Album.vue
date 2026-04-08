<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useHead } from '@unhead/vue'
import albums from 'virtual:albums'
import type { Album, LayoutEntry } from '@/types/album'
import { useImageUrl } from '@/composables/useImageUrl'
import { useScrollReveal } from '@/composables/useScrollReveal'
import HeroImage from '@/components/HeroImage.vue'
import ImageFull from '@/components/ImageFull.vue'
import ImagePair from '@/components/ImagePair.vue'
import NarrativeText from '@/components/NarrativeText.vue'
import Lightbox from '@/components/Lightbox.vue'
import SiteFooter from '@/components/SiteFooter.vue'

const route = useRoute()
const albumId = computed(() => route.params.albumId as string)
const album = computed(() => albums.find((a: Album) => a.id === albumId.value))
const getUrl = computed(() => useImageUrl(albumId.value))

const containerRef = ref<HTMLElement | null>(null)
const showNavTitle = ref(false)
useScrollReveal(containerRef)

// Show album title in nav after scrolling past hero
function onScroll() {
  if (!containerRef.value) return
  const heroHeight = window.innerHeight * 0.75
  showNavTitle.value = window.scrollY > heroHeight * 0.5
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
})
onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})

const allImages = computed(() => {
  if (!album.value) return []
  const images: { src: string; caption?: string; description?: string }[] = []
  for (const entry of album.value.layout) {
    if (entry.type === 'hero' || entry.type === 'full') {
      images.push({ src: getUrl.value(entry.src), caption: entry.caption, description: entry.description })
    } else if (entry.type === 'pair') {
      for (const item of entry.items) {
        images.push({ src: getUrl.value(item.src), caption: item.caption, description: item.description })
      }
    }
  }
  return images
})

const lightboxOpen = ref(false)
const lightboxIndex = ref(0)

function openLightbox(entry: LayoutEntry, pairIndex?: number) {
  let idx = 0
  for (const e of album.value!.layout) {
    if (e === entry) {
      if (e.type === 'pair' && pairIndex !== undefined) {
        idx += pairIndex
      }
      break
    }
    if (e.type === 'hero' || e.type === 'full') idx++
    else if (e.type === 'pair') idx += e.items.length
  }
  lightboxIndex.value = idx
  lightboxOpen.value = true
}

useHead(computed(() => ({
  title: album.value ? `${album.value.title} — 拾光` : '拾光',
})))
</script>

<template>
  <div v-if="album" ref="containerRef" class="album-page">
    <nav class="album-nav">
      <RouterLink to="/" class="back">
        <span class="back-icon">←</span>
        <span class="back-text">返回</span>
      </RouterLink>
      <h1 v-if="album" class="album-nav-title" :class="{ visible: showNavTitle }">{{ album.title }}</h1>
      <span class="nav-spacer"></span>
    </nav>

    <template v-for="(entry, i) in album.layout" :key="i">
      <!-- Hero: edge-to-edge, outside content container -->
      <HeroImage
        v-if="entry.type === 'hero'"
        :src="getUrl(entry.src)"
        :caption="entry.caption"
        :description="entry.description"
        @click="openLightbox(entry)"
      />

      <!-- Preface: shown after first hero if exists -->
      <div v-if="entry.type === 'hero' && album.preface && i === 0" class="album-preface content-wrap reveal">
        <p class="preface-content">{{ album.preface }}</p>
      </div>

      <!-- Full-width image: also edge-to-edge -->
      <div v-else-if="entry.type === 'full'" class="full-bleed reveal">
        <div class="full-bleed-inner">
          <ImageFull
            :src="getUrl(entry.src)"
            :caption="entry.caption"
            :description="entry.description"
            @click="openLightbox(entry)"
          />
        </div>
      </div>

      <!-- Pair and Text: within content container -->
      <div v-else-if="entry.type === 'pair'" class="content-wrap">
        <ImagePair
          :items="entry.items"
          :get-url="getUrl"
          @click="(pairIdx: number) => openLightbox(entry, pairIdx)"
        />
      </div>

      <NarrativeText
        v-else-if="entry.type === 'text'"
        :content="entry.content"
      />
    </template>

    <div class="album-end">
      <div class="end-line"></div>
    </div>

    <SiteFooter />

    <Lightbox
      v-if="lightboxOpen"
      :images="allImages"
      :initial-index="lightboxIndex"
      @close="lightboxOpen = false"
    />
  </div>
</template>

<style scoped>
.album-page {
  padding-bottom: 80px;
}

.album-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
  padding: 16px 40px;
  background: linear-gradient(to bottom, rgba(10, 10, 10, 0.95) 0%, rgba(10, 10, 10, 0.7) 50%, transparent 100%);
  display: flex;
  align-items: center;
  justify-content: space-between;
  backdrop-filter: saturate(180%) blur(20px);
  -webkit-backdrop-filter: saturate(180%) blur(20px);
}

.back {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: var(--font-display);
  font-size: 14px;
  color: var(--text-secondary);
  letter-spacing: 0.05em;
  transition: all var(--duration-fast) ease;
  padding: 8px 12px;
  margin: -8px -12px;
  border-radius: var(--radius-sm);
}

.back:hover {
  color: var(--text-accent-light);
  transform: translateX(-4px);
}

.back-icon {
  font-size: 16px;
}

.album-nav-title {
  font-family: var(--font-display);
  font-size: 16px;
  color: var(--text-primary);
  opacity: 0;
  transform: translateY(-10px);
  transition: all var(--duration-fast) ease;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
}

.album-nav-title.visible {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}

.nav-spacer {
  width: 60px;
}

.content-wrap {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 0 40px;
}

.full-bleed {
  width: 100%;
}

.full-bleed-inner {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 0 40px;
}

.album-end {
  display: flex;
  justify-content: center;
  padding-top: var(--space-4xl);
}

.end-line {
  width: 60px;
  height: 1px;
  background: var(--divider);
}

/* Album preface styling */
.album-preface {
  padding-top: var(--space-4xl);
  padding-bottom: var(--space-2xl);
}

.preface-content {
  font-family: var(--font-display);
  font-size: 18px;
  line-height: 2;
  color: var(--text-secondary);
  letter-spacing: 0.08em;
  white-space: pre-line;
  max-width: 680px;
  margin: 0 auto;
  text-align: center;
}

@media (max-width: 767px) {
  .preface-content {
    font-size: 16px;
    letter-spacing: 0.06em;
    line-height: 1.9;
  }

  .album-nav {
    padding: 12px 16px;
  }

  .back {
    padding: 12px 16px;
    margin: -12px -16px;
    min-width: 80px;
  }

  .back-icon {
    font-size: 18px;
  }

  .album-nav-title {
    font-size: 14px;
    max-width: 120px;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .nav-spacer {
    width: 50px;
  }

  .content-wrap,
  .full-bleed-inner {
    padding: 0 20px;
  }
}
</style>
