import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import { readFileSync, readdirSync } from 'node:fs'
import { resolve } from 'node:path'
import yaml from 'js-yaml'
import type { Album } from './src/types/album'
import type { Plugin } from 'vite'

function albumsPlugin(): Plugin {
  const virtualModuleId = 'virtual:albums'
  const resolvedVirtualModuleId = '\0' + virtualModuleId

  return {
    name: 'vite-plugin-albums',
    resolveId(id) {
      if (id === virtualModuleId) return resolvedVirtualModuleId
    },
    load(id) {
      if (id !== resolvedVirtualModuleId) return

      const albumsDir = resolve(__dirname, 'src/data/albums')
      const files = readdirSync(albumsDir).filter(f => f.endsWith('.yaml') || f.endsWith('.yml'))
      const albums: Album[] = files.map(file => {
        const content = readFileSync(resolve(albumsDir, file), 'utf-8')
        return yaml.load(content) as Album
      })

      return `export default ${JSON.stringify(albums)}`
    },
  }
}

function getAlbumIds(): string[] {
  const albumsDir = resolve(__dirname, 'src/data/albums')
  const files = readdirSync(albumsDir).filter(f => f.endsWith('.yaml') || f.endsWith('.yml'))
  return files.map(file => {
    const content = readFileSync(resolve(albumsDir, file), 'utf-8')
    const album = yaml.load(content) as Album
    return album.id
  })
}

export default defineConfig({
  plugins: [
    Vue(),
    albumsPlugin(),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  ssgOptions: {
    script: 'async',
    formatting: 'minify',
    includedRoutes(paths) {
      const albumIds = getAlbumIds()
      return [
        ...paths,
        ...albumIds.map(id => `/${id}`),
      ]
    },
  },
})
