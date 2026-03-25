export interface ImageItem {
  src: string
  caption?: string
  description?: string
  original?: string
}

export interface HeroEntry {
  type: 'hero'
  src: string
  caption?: string
  description?: string
  original?: string
}

export interface FullEntry {
  type: 'full'
  src: string
  caption?: string
  description?: string
  original?: string
}

export interface PairEntry {
  type: 'pair'
  items: [ImageItem, ImageItem]
}

export interface TextEntry {
  type: 'text'
  content: string
}

export type LayoutEntry = HeroEntry | FullEntry | PairEntry | TextEntry

export interface Album {
  id: string
  title: string
  cover: string
  date: string
  layout: LayoutEntry[]
}
