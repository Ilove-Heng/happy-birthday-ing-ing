import { ref, readonly } from 'vue'

interface MelodyStep {
  freq: number
  beats: number
  chords: number[]
}

const MELODY: MelodyStep[] = [
  // Phase 1: Sweet Melodic Theme
  { freq: 523.25, beats: 1.0, chords: [261.63, 329.63, 392.00] },
  { freq: 659.25, beats: 1.0, chords: [] },
  { freq: 783.99, beats: 1.5, chords: [329.63, 392.00] },
  { freq: 659.25, beats: 0.5, chords: [] },
  { freq: 523.25, beats: 1.0, chords: [] },
  { freq: 587.33, beats: 1.0, chords: [196.00, 246.94, 293.66] },
  { freq: 493.88, beats: 1.0, chords: [] },
  { freq: 587.33, beats: 1.5, chords: [246.94] },
  { freq: 659.25, beats: 0.5, chords: [] },
  { freq: 440.00, beats: 1.5, chords: [220.00, 261.63, 329.63] },
  { freq: 523.25, beats: 0.5, chords: [] },
  { freq: 659.25, beats: 1.0, chords: [261.63] },
  { freq: 587.33, beats: 1.0, chords: [] },
  { freq: 523.25, beats: 1.0, chords: [174.61, 220.00, 261.63] },
  { freq: 659.25, beats: 1.0, chords: [] },
  { freq: 587.33, beats: 1.5, chords: [196.00, 293.66] },
  { freq: 493.88, beats: 0.5, chords: [] },
  { freq: 523.25, beats: 2.0, chords: [261.63, 329.63, 523.25] },

  // Phase 2: Soaring Romantic Melody
  { freq: 392.00, beats: 1.0, chords: [] },
  { freq: 523.25, beats: 1.0, chords: [261.63, 329.63] },
  { freq: 659.25, beats: 1.0, chords: [] },
  { freq: 783.99, beats: 1.5, chords: [392.00, 523.25] },
  { freq: 880.00, beats: 0.5, chords: [] },
  { freq: 783.99, beats: 1.0, chords: [329.63, 392.00] },
  { freq: 659.25, beats: 1.0, chords: [] },
  { freq: 698.46, beats: 1.5, chords: [174.61, 261.63, 349.23] },
  { freq: 659.25, beats: 0.5, chords: [] },
  { freq: 587.33, beats: 1.0, chords: [293.66, 349.23] },
  { freq: 698.46, beats: 1.0, chords: [] },
  { freq: 659.25, beats: 1.5, chords: [196.00, 293.66, 493.88] },
  { freq: 587.33, beats: 0.5, chords: [] },
  { freq: 523.25, beats: 3.0, chords: [130.81, 261.63, 329.63, 392.00, 523.25] },
]

// Singleton reactive audio state
const isPlaying = ref<boolean>(false)
const isEnabled = ref<boolean>(typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('sweet_music_enabled') !== 'false' : true)
const isUnlocked = ref<boolean>(false)

let audioCtx: AudioContext | null = null
let masterGain: GainNode | null = null
let melodyTimer: number | null = null
let currentStep = 0
let pausedForMedia = false
let listenersAttached = false

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null

  if (!audioCtx) {
    const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    if (AudioCtxClass) {
      audioCtx = new AudioCtxClass()
      masterGain = audioCtx.createGain()
      masterGain.gain.setValueAtTime(0.55, audioCtx.currentTime)
      masterGain.connect(audioCtx.destination)
    }
  }

  return audioCtx
}

// iOS Web Audio unlocker
export function unlockAudio(): Promise<boolean> {
  return new Promise((resolve) => {
    const ctx = getAudioContext()
    if (!ctx) {
      resolve(false)
      return
    }

    const doUnlock = async () => {
      try {
        if (ctx.state === 'suspended') {
          await ctx.resume()
        }
        // Play an inaudible 1-sample buffer to satisfy iOS CoreAudio requirements
        const buffer = ctx.createBuffer(1, 1, 22050)
        const source = ctx.createBufferSource()
        source.buffer = buffer
        source.connect(ctx.destination)
        source.start(0)

        isUnlocked.value = true
        resolve(true)
      } catch (err) {
        console.warn('Audio unlock warning:', err)
        resolve(false)
      }
    }

    if (ctx.state === 'running') {
      isUnlocked.value = true
      resolve(true)
    } else {
      doUnlock()
    }
  })
}

function playNote(freq: number, time: number, duration = 1.4, volume = 0.32) {
  const ctx = getAudioContext()
  if (!ctx || !masterGain || !freq) return

  try {
    const noteTime = (time && time > ctx.currentTime ? time : ctx.currentTime) + 0.012

    // 1. Warm Triangle Tone (Celesta / Music Box)
    const osc = ctx.createOscillator()
    const noteGain = ctx.createGain()

    osc.type = 'triangle'
    osc.frequency.setValueAtTime(freq, noteTime)

    noteGain.gain.setValueAtTime(volume, noteTime)
    noteGain.gain.exponentialRampToValueAtTime(0.001, noteTime + duration)

    osc.connect(noteGain)
    noteGain.connect(masterGain)

    osc.start(noteTime)
    osc.stop(noteTime + duration + 0.05)

    // 2. Shimmer Sparkle Overtone (Sine at 2x freq)
    const sparkOsc = ctx.createOscillator()
    const sparkGain = ctx.createGain()

    sparkOsc.type = 'sine'
    sparkOsc.frequency.setValueAtTime(freq * 2, noteTime)

    sparkGain.gain.setValueAtTime(volume * 0.35, noteTime)
    sparkGain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.35)

    sparkOsc.connect(sparkGain)
    sparkGain.connect(masterGain)

    sparkOsc.start(noteTime)
    sparkOsc.stop(noteTime + 0.4)
  } catch (e) {
    console.warn('Note play error:', e)
  }
}

function scheduleNextStep() {
  if (!isPlaying.value) return
  const ctx = getAudioContext()
  if (!ctx) return

  if (ctx.state === 'suspended') {
    ctx.resume().then(() => scheduleNextStep()).catch(() => {})
    return
  }

  const stepItem = MELODY[currentStep]
  if (!stepItem) {
    currentStep = 0
    return
  }

  const now = ctx.currentTime
  playNote(stepItem.freq, now, 1.4, 0.32)

  if (stepItem.chords.length > 0) {
    stepItem.chords.forEach((cf, idx) => {
      playNote(cf, now + idx * 0.02, 2.0, 0.20)
    })
  }

  const beatDurationMs = stepItem.beats * 440
  currentStep = (currentStep + 1) % MELODY.length

  if (melodyTimer) clearTimeout(melodyTimer)
  melodyTimer = window.setTimeout(() => {
    scheduleNextStep()
  }, beatDurationMs)
}

function attachGestureUnlockListeners() {
  if (listenersAttached || typeof window === 'undefined') return
  listenersAttached = true

  const unlockAndResume = () => {
    unlockAudio().then(() => {
      if (isEnabled.value && !isPlaying.value && !pausedForMedia) {
        startMusic()
      }
    })
  }

  const events = ['touchstart', 'touchend', 'pointerdown', 'click']
  const handler = () => {
    unlockAndResume()
    events.forEach(evt => {
      window.removeEventListener(evt, handler)
    })
  }

  events.forEach(evt => {
    window.addEventListener(evt, handler, { passive: true, once: true })
  })

  // Tab visibility changes
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      if (isPlaying.value) {
        pauseForMedia()
        pausedForMedia = true
      }
    } else {
      if (pausedForMedia && isEnabled.value) {
        pausedForMedia = false
        resumeFromMedia()
      }
    }
  })
}

// Public API methods
export async function startMusic() {
  await unlockAudio()
  const ctx = getAudioContext()
  if (ctx && ctx.state === 'suspended') {
    try {
      await ctx.resume()
    } catch {}
  }

  if (isPlaying.value) return
  isPlaying.value = true
  isEnabled.value = true
  if (typeof sessionStorage !== 'undefined') {
    sessionStorage.setItem('sweet_music_enabled', 'true')
  }

  scheduleNextStep()
}

export function stopMusic() {
  isPlaying.value = false
  isEnabled.value = false
  if (typeof sessionStorage !== 'undefined') {
    sessionStorage.setItem('sweet_music_enabled', 'false')
  }

  if (melodyTimer) {
    clearTimeout(melodyTimer)
    melodyTimer = null
  }
}

export function toggleMusic() {
  if (isPlaying.value) {
    stopMusic()
  } else {
    startMusic()
  }
}

export function pauseForMedia() {
  if (isPlaying.value) {
    isPlaying.value = false
    pausedForMedia = true
    if (melodyTimer) {
      clearTimeout(melodyTimer)
      melodyTimer = null
    }
  }
}

export function resumeFromMedia() {
  if (pausedForMedia && isEnabled.value) {
    pausedForMedia = false
    startMusic()
  }
}

export function playCelebrationSound() {
  unlockAudio().then(() => {
    const ctx = getAudioContext()
    if (!ctx) return
    const now = ctx.currentTime + 0.015

    const notes = [523.25, 659.25, 783.99, 987.77, 1046.50, 1318.51, 1567.98]
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      const noteTime = now + idx * 0.085

      osc.type = 'triangle'
      osc.frequency.setValueAtTime(freq, noteTime)

      gain.gain.setValueAtTime(0.42, noteTime)
      gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.85)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(noteTime)
      osc.stop(noteTime + 0.9)
    })
  })
}

export function playSparkleSound() {
  unlockAudio().then(() => {
    const ctx = getAudioContext()
    if (!ctx) return
    const now = ctx.currentTime + 0.015

    const notes = [783.99, 1046.50, 1318.51, 1567.98]
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      const noteTime = now + idx * 0.06

      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, noteTime)

      gain.gain.setValueAtTime(0.3, noteTime)
      gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.45)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(noteTime)
      osc.stop(noteTime + 0.5)
    })
  })
}

export function playBlowSound() {
  unlockAudio().then(() => {
    const ctx = getAudioContext()
    if (!ctx) return

    try {
      const bufferSize = ctx.sampleRate * 0.35
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
      const data = buffer.getChannelData(0)
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1
      }
      const noise = ctx.createBufferSource()
      noise.buffer = buffer

      const filter = ctx.createBiquadFilter()
      filter.type = 'lowpass'
      filter.frequency.setValueAtTime(800, ctx.currentTime)
      filter.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.35)

      const gain = ctx.createGain()
      gain.gain.setValueAtTime(0.3, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35)

      noise.connect(filter)
      filter.connect(gain)
      gain.connect(ctx.destination)
      noise.start()
    } catch (e) {
      console.warn('Blow sound error:', e)
    }
  })
}

export function playChimeSound() {
  unlockAudio().then(() => {
    const ctx = getAudioContext()
    if (!ctx) return

    const notes = [523.25, 659.25, 783.99, 1046.50] // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.12)
      gain.gain.setValueAtTime(0.25, ctx.currentTime + idx * 0.12)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.12 + 0.8)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(ctx.currentTime + idx * 0.12)
      osc.stop(ctx.currentTime + idx * 0.12 + 0.85)
    })
  })
}

export function useAudio() {
  attachGestureUnlockListeners()

  return {
    isPlaying: readonly(isPlaying),
    isEnabled: readonly(isEnabled),
    isUnlocked: readonly(isUnlocked),
    startMusic,
    stopMusic,
    toggleMusic,
    pauseForMedia,
    resumeFromMedia,
    unlockAudio,
    playCelebrationSound,
    playSparkleSound,
    playBlowSound,
    playChimeSound,
  }
}
