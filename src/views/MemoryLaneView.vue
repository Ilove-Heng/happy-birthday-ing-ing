<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import type { MemoryPhoto } from '@/types'
import { useAudio } from '@/composables/useAudio'
import { useConfetti } from '@/composables/useConfetti'
import { assetUrl } from '@/utils/assets'

const router = useRouter()
const { playSparkleSound } = useAudio()
const { safeConfetti } = useConfetti()

const photos: MemoryPhoto[] = [
  { id: 1, src: assetUrl('images/photos/photo_01.jpg'), alt: 'Memory with Ing Ing', caption: 'Delicious treats together 🍰', sticker: '🍰', rotation: '-2deg' },
  { id: 2, src: assetUrl('images/photos/photo_02.jpg'), alt: 'Memory with Ing Ing', caption: 'That sweetest smile 💕', sticker: '🥰', rotation: '2deg' },
  { id: 3, src: assetUrl('images/photos/photo_03.jpg'), alt: 'Memory with Ing Ing', caption: 'Pure cuteness 🌸', sticker: '🌸', rotation: '-1.5deg' },
  { id: 4, src: assetUrl('images/photos/photo_04.jpg'), alt: 'Memory with Ing Ing', caption: 'Our lovely date ✨', sticker: '✨', rotation: '3deg' },
  { id: 5, src: assetUrl('images/photos/photo_05.jpg'), alt: 'Memory with Ing Ing', caption: 'Prettiest girl in my world 💖', sticker: '💖', rotation: '-2.5deg' },
  { id: 6, src: assetUrl('images/photos/photo_06.jpg'), alt: 'Memory with Ing Ing', caption: 'Adventures & lovely doggy 🐶', sticker: '🐶', rotation: '1.5deg' },
  { id: 7, src: assetUrl('images/photos/photo_07.jpg'), alt: 'Memory with Ing Ing', caption: 'Special memories 🎀', sticker: '🎀', rotation: '-2deg' },
  { id: 8, src: assetUrl('images/photos/photo_08.jpg'), alt: 'Memory with Ing Ing', caption: 'Always shining bright 🌟', sticker: '🌟', rotation: '2.5deg' },
  { id: 9, src: assetUrl('images/photos/photo_09.jpg'), alt: 'Memory with Ing Ing', caption: 'Peace & sweet moments ✌️', sticker: '✌️', rotation: '-1deg' },
  { id: 10, src: assetUrl('images/photos/photo_10.jpg'), alt: 'Memory with Ing Ing', caption: 'My favorite person 🧸', sticker: '🧸', rotation: '2deg' },
  { id: 11, src: assetUrl('images/photos/photo_11.jpg'), alt: 'Memory with Ing Ing', caption: 'Cherished forever 🤍', sticker: '🤍', rotation: '-3deg' },
  { id: 12, src: assetUrl('images/photos/photo_12.jpg'), alt: 'Memory with Ing Ing', caption: 'You make every day brighter ☀️', sticker: '☀️', rotation: '1.8deg' },
  { id: 13, src: assetUrl('images/photos/photo_13.jpg'), alt: 'Memory with Ing Ing', caption: 'Sweet moments with you 🍓', sticker: '🍓', rotation: '-2deg' },
  { id: 14, src: assetUrl('images/photos/photo_14.jpg'), alt: 'Memory with Ing Ing', caption: 'My gorgeous queen 👑', sticker: '👑', rotation: '2.2deg' },
  { id: 15, src: assetUrl('images/photos/photo_15.jpg'), alt: 'Memory with Ing Ing', caption: 'Making memories together 💫', sticker: '💫', rotation: '-1.5deg' },
  { id: 16, src: assetUrl('images/photos/photo_16.jpg'), alt: 'Memory with Ing Ing', caption: 'Love you to the moon and back 🌙', sticker: '🌙', rotation: '2.8deg' },
  { id: 17, src: assetUrl('images/photos/photo_17.jpg'), alt: 'Memory with Ing Ing', caption: 'Forever & always 🫶', sticker: '🫶', rotation: '-2deg' },
  { id: 18, src: assetUrl('images/photos/photo_18.jpg'), alt: 'Memory with Ing Ing', caption: 'Sweet drinks & sweet smiles 🧋✨', sticker: '🧋', rotation: '2.2deg' },
  { id: 19, src: assetUrl('images/photos/photo_19.jpg'), alt: 'Memory with Ing Ing', caption: 'Under your cute umbrella ⛱️💕', sticker: '⛱️', rotation: '-2.5deg' },
  { id: 20, src: assetUrl('images/photos/photo_20.jpg'), alt: 'Memory with Ing Ing', caption: 'Cute panda vibes with you 🐼🌸', sticker: '🐼', rotation: '1.8deg' },
  { id: 21, src: assetUrl('images/photos/photo_21.jpg'), alt: 'Memory with Ing Ing', caption: 'Sunny days with my favorite view 🌊☀️', sticker: '🌊', rotation: '-1.8deg' },
  { id: 22, src: assetUrl('images/photos/photo_22.jpg'), alt: 'Memory with Ing Ing', caption: 'Looking back at you with all my love 💖', sticker: '💖', rotation: '2.4deg' },
]

const galleryRef = ref<HTMLElement | null>(null)
const isAutoPlaying = ref(true)
let autoPlayTimer: number | null = null
let touchResumeTimer: number | null = null
const AUTOPLAY_INTERVAL = 3200

// Lightbox modal state
const isLightboxActive = ref(false)
const activePhoto = ref<MemoryPhoto | null>(null)

function getCardStep(): number {
  if (!galleryRef.value) return 300
  const card = galleryRef.value.querySelector('.polaroid-card') as HTMLElement
  if (!card) return 300
  const style = window.getComputedStyle(galleryRef.value)
  const gap = parseFloat(style.columnGap || style.gap || '24') || 24
  return card.offsetWidth + gap
}

function scrollNext() {
  if (!galleryRef.value) return
  const maxScroll = galleryRef.value.scrollWidth - galleryRef.value.clientWidth
  if (galleryRef.value.scrollLeft >= maxScroll - 15) {
    galleryRef.value.scrollTo({ left: 0, behavior: 'smooth' })
  } else {
    galleryRef.value.scrollBy({ left: getCardStep(), behavior: 'smooth' })
  }
}

function scrollPrev() {
  if (!galleryRef.value) return
  if (galleryRef.value.scrollLeft <= 15) {
    galleryRef.value.scrollTo({ left: galleryRef.value.scrollWidth, behavior: 'smooth' })
  } else {
    galleryRef.value.scrollBy({ left: -getCardStep(), behavior: 'smooth' })
  }
}

function handleManualPrev() {
  scrollPrev()
  resetAutoPlay()
}

function handleManualNext() {
  scrollNext()
  resetAutoPlay()
}

function startTimer() {
  stopTimer()
  autoPlayTimer = window.setInterval(() => {
    scrollNext()
  }, AUTOPLAY_INTERVAL)
}

function stopTimer() {
  if (autoPlayTimer) {
    clearInterval(autoPlayTimer)
    autoPlayTimer = null
  }
}

function resetAutoPlay() {
  if (isAutoPlaying.value) {
    startTimer()
  }
}

function toggleAutoPlay() {
  isAutoPlaying.value = !isAutoPlaying.value
  if (isAutoPlaying.value) {
    startTimer()
  } else {
    stopTimer()
  }
}

function handleMouseEnter() {
  stopTimer()
}

function handleMouseLeave() {
  if (isAutoPlaying.value && !isLightboxActive.value) {
    startTimer()
  }
}

function handleTouchStart() {
  stopTimer()
  if (touchResumeTimer) clearTimeout(touchResumeTimer)
}

function handleTouchEnd() {
  if (touchResumeTimer) clearTimeout(touchResumeTimer)
  touchResumeTimer = window.setTimeout(() => {
    if (isAutoPlaying.value && !isLightboxActive.value) {
      startTimer()
    }
  }, 4000)
}

function openLightbox(photo: MemoryPhoto) {
  playSparkleSound()
  stopTimer()
  activePhoto.value = photo
  isLightboxActive.value = true
}

function closeLightbox() {
  isLightboxActive.value = false
  activePhoto.value = null
  if (isAutoPlaying.value) {
    startTimer()
  }
}

onMounted(() => {
  safeConfetti({
    particleCount: 70,
    spread: 60,
    origin: { y: 0.2 },
  })
  if (isAutoPlaying.value) {
    startTimer()
  }
})

onUnmounted(() => {
  stopTimer()
  if (touchResumeTimer) clearTimeout(touchResumeTimer)
})
</script>

<template>
  <div class="memorylane-stage">
    <div class="scrapbook-bg"></div>

    <div class="memory-lane-container">
      <!-- Header -->
      <header class="header">
        <h1>Welcome Ing Ing 💕</h1>
        <div class="subtitle-card">
          <p class="quote-khmer">
            "ថ្ងៃនេះជាថ្ងៃពិសេសសម្រាប់អូន — នារីដ៏ស្រស់ស្អាតដែលមានស្នាមញញឹមផ្អែមល្ហែម និងចិត្តល្អបំផុត។ អូនសមនឹងទទួលបានក្ដីសុខគ្រប់យ៉ាង និងក្ដីស្រឡាញ់ទាំងអស់លើលោកនេះ។ Happy Birthday My Girl 💖"
          </p>
          <span class="pill-badge">Oun Sml 🎀</span>
        </div>
      </header>

      <!-- Gallery Controls -->
      <div class="gallery-controls">
        <button
          class="nav-arrow"
          id="prevBtn"
          aria-label="Previous photos"
          type="button"
          @click="handleManualPrev"
        >
          <i class="fa-solid fa-chevron-left"></i>
        </button>

        <div class="gallery-indicator">
          <button
            id="autoPlayToggle"
            class="btn-autoplay"
            :class="{ active: isAutoPlaying }"
            aria-label="Toggle auto-play"
            type="button"
            @click="toggleAutoPlay"
          >
            <i
              :class="isAutoPlaying ? 'fa-solid fa-pause' : 'fa-solid fa-play'"
              id="playIcon"
            ></i>
            <span>{{ isAutoPlaying ? 'Auto-playing Memories 💕' : 'Play Slideshow ▶️' }}</span>
          </button>
        </div>

        <button
          class="nav-arrow"
          id="nextBtn"
          aria-label="Next photos"
          type="button"
          @click="handleManualNext"
        >
          <i class="fa-solid fa-chevron-right"></i>
        </button>
      </div>

      <!-- Polaroid Horizontal Carousel -->
      <div class="gallery-wrapper">
        <div
          ref="galleryRef"
          class="gallery"
          id="gallery"
          @mouseenter="handleMouseEnter"
          @mouseleave="handleMouseLeave"
          @touchstart.passive="handleTouchStart"
          @touchend.passive="handleTouchEnd"
        >
          <div
            v-for="photo in photos"
            :key="photo.id"
            class="polaroid-card"
            :style="{ '--rot': photo.rotation }"
            @click="openLightbox(photo)"
          >
            <div class="tape"></div>
            <div class="sticker">{{ photo.sticker }}</div>
            <div class="photo-wrapper">
              <img :src="photo.src" :alt="photo.alt" loading="lazy" />
            </div>
            <div class="caption">
              <span>{{ photo.caption }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Navigation Buttons -->
      <nav class="bottom-nav">
        <router-link to="/" class="nav-btn back-btn">
          <i class="fa-solid fa-arrow-left"></i>
          <span>Back to Welcome</span>
        </router-link>
        <router-link to="/cake" class="nav-btn next-btn">
          <span>Next Surprise: Birthday Cake! 🎂</span>
          <i class="fa-solid fa-arrow-right"></i>
        </router-link>
      </nav>
    </div>

    <!-- Lightbox Modal -->
    <div
      class="lightbox"
      :class="{ active: isLightboxActive }"
      id="lightbox"
      @click.self="closeLightbox"
    >
      <button
        class="lightbox-close"
        id="lightboxClose"
        type="button"
        @click="closeLightbox"
      >
        ×
      </button>
      <div class="lightbox-content" v-if="activePhoto">
        <img :src="activePhoto.src" :alt="activePhoto.caption" id="lightboxImg" />
        <p id="lightboxCaption">{{ activePhoto.caption }}</p>
      </div>
    </div>
  </div>
</template>

<style>
@import '@/assets/css/memorylane.css';

.memorylane-stage {
  min-height: 100vh;
  min-height: 100dvh;
  background: linear-gradient(135deg, #ffd1dc 0%, #ffe6f0 40%, #e2f0d9 100%);
  position: relative;
  overflow-x: hidden;
  color: #4a4a4a;
}
</style>
