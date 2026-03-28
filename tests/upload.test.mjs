import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import {
  collectUploads,
  createWranglerCommand,
  parseConcurrency,
  loadAlbumData,
  runUpload,
} from '../scripts/upload-lib.mjs'

function createFixtureDir() {
  return mkdtempSync(join(tmpdir(), 'gallery-upload-test-'))
}

function writeAlbum(dir, content) {
  const file = join(dir, 'album.yaml')
  writeFileSync(file, content)
  return file
}

test('collectUploads gathers hero, full, pair items and cover upload when needed', () => {
  const album = {
    id: 'demo',
    cover: 'cover.jpg',
    layout: [
      { type: 'hero', src: 'hero.jpg', original: 'hero.png' },
      { type: 'full', src: 'full.jpg', original: 'full.png' },
      {
        type: 'pair',
        items: [
          { src: 'left.jpg', original: 'left.png' },
          { src: 'right.jpg', original: 'right.png' },
        ],
      },
    ],
  }

  const uploads = collectUploads(album)

  assert.deepEqual(uploads, [
    { original: 'hero.png', target: 'hero.jpg', kind: 'layout' },
    { original: 'full.png', target: 'full.jpg', kind: 'layout' },
    { original: 'left.png', target: 'left.jpg', kind: 'layout' },
    { original: 'right.png', target: 'right.jpg', kind: 'layout' },
    { original: 'hero.png', target: 'cover.jpg', kind: 'cover' },
  ])
})

test('loadAlbumData rejects duplicate target filenames', () => {
  const dir = createFixtureDir()

  try {
    const yamlPath = writeAlbum(dir, `
id: demo
cover: hero.jpg
layout:
  - type: hero
    src: hero.jpg
    original: hero.png
  - type: full
    src: hero.jpg
    original: another.png
`)

    assert.throws(
      () => loadAlbumData(yamlPath),
      /Duplicate upload target/,
    )
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

test('runUpload rejects missing source files before uploading', async () => {
  const dir = createFixtureDir()

  try {
    const sourceDir = join(dir, 'source')
    mkdirSync(sourceDir)

    const yamlPath = writeAlbum(dir, `
id: demo
cover: hero.jpg
layout:
  - type: hero
    src: hero.jpg
    original: missing.png
`)

    const album = loadAlbumData(yamlPath)

    await assert.rejects(
      () => runUpload(album, sourceDir, { exec: () => {} }),
      /Missing source files/,
    )
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

test('runUpload dry-run reports uploads without executing wrangler', async () => {
  const dir = createFixtureDir()

  try {
    const sourceDir = join(dir, 'source')
    mkdirSync(sourceDir)
    writeFileSync(join(sourceDir, 'hero.png'), 'hero')

    const yamlPath = writeAlbum(dir, `
id: demo
cover: hero.jpg
layout:
  - type: hero
    src: hero.jpg
    original: hero.png
`)

    const album = loadAlbumData(yamlPath)
    const executed = []

    const result = await runUpload(album, sourceDir, {
      dryRun: true,
      exec: (command) => executed.push(command),
    })

    assert.equal(executed.length, 0)
    assert.equal(result.success, 1)
    assert.equal(result.failed, 0)
    assert.equal(result.dryRun, true)
    assert.deepEqual(result.plannedKeys, ['demo/hero.jpg'])
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

test('createWranglerCommand falls back to npx when wrangler is unavailable', () => {
  assert.equal(
    createWranglerCommand(false),
    'wrangler',
  )

  assert.equal(
    createWranglerCommand(true),
    'npx --yes wrangler',
  )
})

test('parseConcurrency defaults to 4 and enforces 1..8 bounds', () => {
  assert.equal(parseConcurrency(undefined), 4)
  assert.equal(parseConcurrency('1'), 1)
  assert.equal(parseConcurrency('8'), 8)

  assert.throws(() => parseConcurrency('0'), /between 1 and 8/)
  assert.throws(() => parseConcurrency('9'), /between 1 and 8/)
  assert.throws(() => parseConcurrency('abc'), /integer/)
})

test('runUpload respects concurrency limit', async () => {
  const dir = createFixtureDir()

  try {
    const sourceDir = join(dir, 'source')
    mkdirSync(sourceDir)

    for (const name of ['a.png', 'b.png', 'c.png', 'd.png']) {
      writeFileSync(join(sourceDir, name), name)
    }

    const yamlPath = writeAlbum(dir, `
id: demo
cover: a.jpg
layout:
  - type: hero
    src: a.jpg
    original: a.png
  - type: pair
    items:
      - src: b.jpg
        original: b.png
      - src: c.jpg
        original: c.png
  - type: full
    src: d.jpg
    original: d.png
`)

    const album = loadAlbumData(yamlPath)
    let active = 0
    let peak = 0

    await runUpload(album, sourceDir, {
      concurrency: 2,
      exec: async () => {
        active++
        peak = Math.max(peak, active)
        await new Promise(resolve => setTimeout(resolve, 10))
        active--
      },
      logger: { log() {}, error() {} },
    })

    assert.equal(peak, 2)
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})
