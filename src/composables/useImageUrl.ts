const R2_BASE = import.meta.env.VITE_R2_BASE || ''

export function useImageUrl(albumId: string) {
  return (src: string) => {
    if (R2_BASE) {
      return `${R2_BASE}/${albumId}/${src}`
    }
    // Fallback for local dev: use local images
    return `/images/${albumId}/${src}`
  }
}
