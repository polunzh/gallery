import { existsSync, readFileSync } from 'node:fs'
import { resolve, join } from 'node:path'
import yaml from 'js-yaml'

export const BUCKET = 'gallery-assets'

function isObject(value) {
  return typeof value === 'object' && value !== null
}

function assertAlbumShape(albumData, yamlPath) {
  if (!isObject(albumData)) {
    throw new Error(`Invalid album data in ${yamlPath}: expected object`)
  }
  if (typeof albumData.id !== 'string' || albumData.id.length === 0) {
    throw new Error(`Invalid album data in ${yamlPath}: missing album id`)
  }
  if (typeof albumData.cover !== 'string' || albumData.cover.length === 0) {
    throw new Error(`Invalid album data in ${yamlPath}: missing cover`)
  }
  if (!Array.isArray(albumData.layout)) {
    throw new Error(`Invalid album data in ${yamlPath}: layout must be an array`)
  }
}

function validateNoDuplicateTargets(uploads, yamlPath) {
  const seenTargets = new Map()
  for (const upload of uploads) {
    if (seenTargets.has(upload.target)) {
      const original = seenTargets.get(upload.target)
      throw new Error(
        `Duplicate upload target "${upload.target}" in ${yamlPath}: ` +
        `"${original}" and "${upload.original}"`,
      )
    }
    seenTargets.set(upload.target, upload.original)
  }
}

export function collectUploads(albumData) {
  const uploads = []

  for (const entry of albumData.layout) {
    if (entry?.type === 'hero' || entry?.type === 'full') {
      if (entry.original) {
        uploads.push({ original: entry.original, target: entry.src, kind: 'layout' })
      }
    } else if (entry?.type === 'pair') {
      for (const item of entry.items ?? []) {
        if (item.original) {
          uploads.push({ original: item.original, target: item.src, kind: 'layout' })
        }
      }
    }
  }

  const coverEntry = uploads.find(upload => upload.target === albumData.cover)
  if (!coverEntry && albumData.cover && uploads.length > 0) {
    uploads.push({
      original: uploads[0].original,
      target: albumData.cover,
      kind: 'cover',
    })
  }

  return uploads
}

export function loadAlbumData(yamlPath) {
  const absolutePath = resolve(yamlPath)
  const albumData = yaml.load(readFileSync(absolutePath, 'utf-8'))
  assertAlbumShape(albumData, absolutePath)

  const uploads = collectUploads(albumData)
  validateNoDuplicateTargets(uploads, absolutePath)

  return {
    path: absolutePath,
    id: albumData.id,
    cover: albumData.cover,
    layout: albumData.layout,
    uploads,
  }
}

export function findMissingSourceFiles(uploads, sourceDir) {
  return uploads
    .map(upload => ({
      ...upload,
      localPath: join(resolve(sourceDir), upload.original),
    }))
    .filter(upload => !existsSync(upload.localPath))
}

export function createWranglerCommand(useNpxFallback = false) {
  return useNpxFallback ? 'npx --yes wrangler' : 'wrangler'
}

export function parseConcurrency(value) {
  if (value === undefined) return 4

  const concurrency = Number.parseInt(value, 10)
  if (Number.isNaN(concurrency)) {
    throw new Error('Concurrency must be an integer')
  }
  if (concurrency < 1 || concurrency > 8) {
    throw new Error('Concurrency must be between 1 and 8')
  }
  return concurrency
}

async function runWithConcurrency(items, concurrency, worker) {
  const queue = [...items]

  async function consume() {
    while (queue.length > 0) {
      const item = queue.shift()
      if (!item) return
      await worker(item)
    }
  }

  const runners = Array.from(
    { length: Math.min(concurrency, items.length) },
    () => consume(),
  )
  await Promise.all(runners)
}

export async function runUpload(album, sourceDir, options = {}) {
  const {
    bucket = BUCKET,
    concurrency = 4,
    dryRun = false,
    exec = () => {},
    logger = console,
    useNpxFallback = false,
  } = options

  const uploads = album.uploads ?? collectUploads(album)
  const missingFiles = findMissingSourceFiles(uploads, sourceDir)
  const wranglerCommand = createWranglerCommand(useNpxFallback)

  if (missingFiles.length > 0) {
    const missingList = missingFiles
      .map(file => `${file.original} (${file.localPath})`)
      .join(', ')
    throw new Error(`Missing source files: ${missingList}`)
  }

  logger.log(
    `\n${dryRun ? 'Planning' : 'Uploading'} ${uploads.length} images for album "${album.id}" ` +
    `to R2 bucket "${bucket}"...\n`,
  )

  let success = 0
  let failed = 0
  const plannedKeys = []

  await runWithConcurrency(uploads, concurrency, async (upload) => {
    const localPath = join(resolve(sourceDir), upload.original)
    const r2Key = `${album.id}/${upload.target}`
    plannedKeys.push(r2Key)

    try {
      logger.log(`  ${upload.original} → ${r2Key}${dryRun ? ' [dry-run]' : ''}`)
      if (!dryRun) {
        await exec(
          `${wranglerCommand} r2 object put "${bucket}/${r2Key}" --file="${localPath}"`,
          localPath,
          r2Key,
        )
      }
      success++
    } catch (error) {
      logger.error(`  ✗ Failed: ${upload.original} — ${error.message}`)
      failed++
    }
  })

  logger.log(`\nDone: ${success} ${dryRun ? 'planned' : 'uploaded'}, ${failed} failed`)

  return {
    success,
    failed,
    dryRun,
    plannedKeys,
  }
}
