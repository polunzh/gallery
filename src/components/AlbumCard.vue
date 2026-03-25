<script setup lang="ts">
import type { Album } from '@/types/album'
import { useImageUrl } from '@/composables/useImageUrl'

const props = defineProps<{
  album: Album
}>()

const getUrl = useImageUrl(props.album.id)
</script>

<template>
  <RouterLink :to="`/${album.id}`" class="album-card">
    <div class="card-cover">
      <img :src="getUrl(album.cover)" :alt="album.title" loading="lazy">
    </div>
    <div class="card-info">
      <h3 class="card-title">{{ album.title }}</h3>
      <span class="card-date">{{ album.date }}</span>
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

.card-info {
  padding: 16px 4px 0;
}

.card-title {
  font-family: var(--font-display);
  font-size: 20px;
  font-weight: 700;
  color: var(--text-accent-light);
  margin-bottom: 4px;
}

.card-date {
  font-size: 13px;
  color: var(--text-muted);
}
</style>
