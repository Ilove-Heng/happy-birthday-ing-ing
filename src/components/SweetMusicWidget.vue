<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useAudio } from '@/composables/useAudio'

const { isPlaying, toggleMusic } = useAudio()

interface NoteParticle {
  id: number
  symbol: string
  left: string
  top: string
  fontSize: string
}

const particles = ref<NoteParticle[]>([])
let particleTimer: number | null = null
let noteCounter = 0

const symbols = ['♪', '♫', '♬', '💕', '✨', '🌸']

function spawnParticle() {
  if (!isPlaying.value) return
  const widget = document.getElementById('sweetMusicWidget')
  if (!widget) return

  const rect = widget.getBoundingClientRect()
  const id = ++noteCounter
  const symbol = symbols[Math.floor(Math.random() * symbols.length)]
  const left = `${rect.left + rect.width / 2 - 10 + (Math.random() * 20 - 10)}px`
  const top = `${rect.top}px`
  const fontSize = `${14 + Math.random() * 10}px`

  particles.value.push({ id, symbol, left, top, fontSize })

  setTimeout(() => {
    particles.value = particles.value.filter(p => p.id !== id)
  }, 2400)
}

function startParticleLoop() {
  if (particleTimer) clearInterval(particleTimer)
  particleTimer = window.setInterval(spawnParticle, 1200)
}

function stopParticleLoop() {
  if (particleTimer) {
    clearInterval(particleTimer)
    particleTimer = null
  }
  particles.value = []
}

watch(isPlaying, (playing) => {
  if (playing) {
    startParticleLoop()
  } else {
    stopParticleLoop()
  }
}, { immediate: true })

onMounted(() => {
  if (isPlaying.value) {
    startParticleLoop()
  }
})

onUnmounted(() => {
  stopParticleLoop()
})
</script>

<template>
  <div>
    <!-- Floating Musical Notes -->
    <teleport to="body">
      <span
        v-for="p in particles"
        :key="p.id"
        class="music-floating-note"
        :style="{ left: p.left, top: p.top, fontSize: p.fontSize }"
      >
        {{ p.symbol }}
      </span>
    </teleport>

    <!-- Floating Circular Music Button -->
    <div
      id="sweetMusicWidget"
      class="sweet-music-widget"
      :class="{ 'is-playing': isPlaying, 'is-paused': !isPlaying }"
      role="button"
      tabindex="0"
      aria-label="Toggle Sweet Romantic Music"
      @click.stop="toggleMusic"
    >
      <span class="sweet-music-tooltip">
        {{ isPlaying ? 'Sweet Music 💕 (Playing)' : 'Play Music 🎵' }}
      </span>
      <i
        :class="isPlaying ? 'fa-solid fa-music music-icon-spin' : 'fa-solid fa-play'"
      ></i>
    </div>
  </div>
</template>

<style scoped>
@import '@/assets/css/sweet-music.css';
</style>
