#!/usr/bin/env node

/**
 * Upload album images to Cloudflare R2.
 *
 * Usage:
 *   node scripts/upload.mjs src/data/albums/zhuyu.yaml --source ~/Pictures/逐玉 [--dry-run]
 *
 * Requirements:
 *   - wrangler CLI installed and authenticated
 *   - R2 bucket "gallery-assets" created
 */

import { execSync, spawnSync } from 'node:child_process'
import { BUCKET, loadAlbumData, parseConcurrency, runUpload } from './upload-lib.mjs'

const args = process.argv.slice(2)
const yamlPath = args[0]
const sourceIdx = args.indexOf('--source')
const sourceDir = sourceIdx !== -1 ? args[sourceIdx + 1] : null
const concurrencyIdx = args.indexOf('--concurrency')
const concurrencyValue = concurrencyIdx !== -1 ? args[concurrencyIdx + 1] : undefined
const dryRun = args.includes('--dry-run')
const useNpxFallback = spawnSync('wrangler', ['--version'], { stdio: 'ignore' }).status !== 0

if (!yamlPath || !sourceDir) {
  console.error('Usage: node scripts/upload.mjs <album.yaml> --source <image-dir> [--dry-run] [--concurrency 1-8]')
  process.exit(1)
}

try {
  const album = loadAlbumData(yamlPath)
  const concurrency = parseConcurrency(concurrencyValue)

  await runUpload(album, sourceDir, {
    bucket: BUCKET,
    concurrency,
    dryRun,
    useNpxFallback,
    exec(command) {
      return execSync(command, { stdio: 'pipe' })
    },
  })
} catch (error) {
  console.error(error.message)
  process.exit(1)
}
