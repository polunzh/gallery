#!/usr/bin/env node

/**
 * Upload album images to Cloudflare R2.
 *
 * Usage:
 *   node scripts/upload.mjs src/data/albums/zhuyu.yaml --source ~/Pictures/逐玉
 *
 * Requirements:
 *   - wrangler CLI installed and authenticated
 *   - R2 bucket "gallery-assets" created
 */

import { readFileSync } from 'node:fs'
import { resolve, join } from 'node:path'
import { execSync } from 'node:child_process'
import yaml from 'js-yaml'

const args = process.argv.slice(2)
const yamlPath = args[0]
const sourceIdx = args.indexOf('--source')
const sourceDir = sourceIdx !== -1 ? args[sourceIdx + 1] : null

if (!yamlPath || !sourceDir) {
  console.error('Usage: node scripts/upload.mjs <album.yaml> --source <image-dir>')
  process.exit(1)
}

const BUCKET = 'gallery-assets'

const albumData = yaml.load(readFileSync(resolve(yamlPath), 'utf-8'))
const albumId = albumData.id

// Collect all images with original → target mapping
const uploads = []

for (const entry of albumData.layout) {
  if (entry.type === 'hero' || entry.type === 'full') {
    if (entry.original) {
      uploads.push({ original: entry.original, target: entry.src })
    }
  } else if (entry.type === 'pair') {
    for (const item of entry.items) {
      if (item.original) {
        uploads.push({ original: item.original, target: item.src })
      }
    }
  }
}

// Also upload cover if it maps to an existing entry
const coverEntry = uploads.find(u => u.target === albumData.cover)
if (!coverEntry) {
  // Cover might be same as first image, already covered
  console.log(`Cover "${albumData.cover}" will use an existing upload`)
}

console.log(`\nUploading ${uploads.length} images for album "${albumId}" to R2 bucket "${BUCKET}"...\n`)

let success = 0
let failed = 0

for (const { original, target } of uploads) {
  const localPath = join(resolve(sourceDir), original)
  const r2Key = `${albumId}/${target}`

  try {
    console.log(`  ${original} → ${r2Key}`)
    execSync(`wrangler r2 object put "${BUCKET}/${r2Key}" --file="${localPath}"`, {
      stdio: 'pipe',
    })
    success++
  } catch (err) {
    console.error(`  ✗ Failed: ${original} — ${err.message}`)
    failed++
  }
}

// Upload cover separately if it's not already one of the images
if (!coverEntry && albumData.cover) {
  // Try to find the original for the cover from the first hero/full entry
  const firstImage = uploads[0]
  if (firstImage && firstImage.target !== albumData.cover) {
    const localPath = join(resolve(sourceDir), firstImage.original)
    const r2Key = `${albumId}/${albumData.cover}`
    try {
      console.log(`  ${firstImage.original} → ${r2Key} (cover)`)
      execSync(`wrangler r2 object put "${BUCKET}/${r2Key}" --file="${localPath}"`, {
        stdio: 'pipe',
      })
      success++
    } catch (err) {
      console.error(`  ✗ Failed cover: ${err.message}`)
      failed++
    }
  }
}

console.log(`\nDone: ${success} uploaded, ${failed} failed`)
