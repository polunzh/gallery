<script setup lang="ts">
import { computed } from 'vue'
import type { Album } from '@/types/album'
import { useImageUrl } from '@/composables/useImageUrl'

const props = defineProps<{
  album: Album
}>()

const getUrl = useImageUrl(props.album.id)

const imageCount = computed(() => {
  let count = 0
  for (const entry of props.album.layout) {
    if (entry.type === 'hero' || entry.type === 'full') count++
    else if (entry.type === 'pair') count += entry.items.length
  }
  return count
})

const descriptionPreview = computed(() => {
  if (props.album.preface) {
    // Take first line of preface, truncate if needed
    const firstLine = props.album.preface.split('\n')[0].trim()
    if (firstLine.length > 60) {
      return firstLine.slice(0, 60) + '...'
    }
    return firstLine
  }
  // Fallback to first image description
  for (const entry of props.album.layout) {
    if ((entry.type === 'hero' || entry.type === 'full') && entry.description) {
      return entry.description.length > 60
        ? entry.description.slice(0, 60) + '...'
        : entry.description
    }
  }
  return ''
})

// Format date from "2025-04" to "2025年4月"
const formattedDate = computed(() => {
  const match = props.album.date.match(/^(\d{4})-(\d{1,2})$/)
  if (match) {
    return `${match[1]}年${parseInt(match[2])}月`
  }
  return props.album.date
})
</script>

<template>
  <RouterLink :to="`/${album.id}`" class="album-card">
    <div class="card-cover">
      <img :src="getUrl(album.cover)" :alt="album.title" loading="lazy">
      <span class="card-badge">{{ imageCount }} 张</span>
    </div>
    <div class="card-info">
      <h3 class="card-title">{{ album.title }}</h3>
      <p v-if="descriptionPreview" class="card-description">{{ descriptionPreview }}</p>
      <span class="card-meta">{{ formattedDate }}</span>
    </div>
  </RouterLink>
</template>

<style scoped>
.album-card {
  display: block;
  transition: transform var(--duration-fast) ease;
}

.album-card:hover {
  transform: translateY(-4px);
}

.card-cover {
  border-radius: var(--radius-md);
  overflow: hidden;
  aspect-ratio: 21 / 9;
  position: relative;
  /* Linear-inspired subtle border */
  border: 1px solid var(--border-subtle);
  transition: all var(--duration-fast) ease;
}

.card-cover:hover {
  border-color: var(--border-accent);
  box-shadow: var(--shadow-md);
}

.card-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--duration-normal) var(--ease-out);
}

.album-card:hover .card-cover img {
  transform: scale(1.03);
}

/* Touch feedback */
.album-card:active .card-cover img {
  transform: scale(0.98);
  opacity: 0.9;
}

@media (hover: none) {
  .album-card:hover .card-cover img {
    transform: none;
  }
  .album-card:active .card-cover img {
    transform: scale(0.98);
  }
}

/* Spotify-inspired pill badge */
.card-badge {
  position: absolute;
  bottom: 12px;
  right: 12px;
  font-size: 12px;
  color: var(--text-primary);
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  padding: 6px 14px;
  border-radius: var(--radius-pill);
  letter-spacing: 0.04em;
  border: 1px solid var(--border-subtle);
}

.card-info {
  padding: 16px 4px 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.card-title {
  font-family: var(--font-display);
  font-size: 20px;
  font-weight: 700;
  color: var(--text-accent-light);
  letter-spacing: -0.01em;
}

.card-meta {
  font-size: 13px;
  color: var(--text-muted);
}

.card-description {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.5;
  margin: 4px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

@media (max-width: 767px) {
  .card-title {
    font-size: 18px;
  }
  .card-description {
    font-size: 12px;
  }
  .card-meta {
    font-size: 12px;
  }
  .card-badge {
    font-size: 11px;
    padding: 5px 12px;
  }
}
</style>
