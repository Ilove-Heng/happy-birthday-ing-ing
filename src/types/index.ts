export interface MemoryPhoto {
  id: number
  src: string
  alt: string
  caption: string
  sticker: string
  rotation: string
}

export interface CandleState {
  id: number
  colorClass: string
  isBlown: boolean
  top: string
  left: string
}

export type StageId = 'welcome' | 'memorylane' | 'cake' | 'letter'
