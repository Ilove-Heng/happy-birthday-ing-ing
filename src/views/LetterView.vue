<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAudio } from '@/composables/useAudio'
import { useConfetti } from '@/composables/useConfetti'
import { assetUrl } from '@/utils/assets'

const router = useRouter()
const { playCelebrationSound, pauseForMedia, resumeFromMedia } = useAudio()
const { safeConfetti } = useConfetti()

// Letter Text content with pauses
const rawLetterParagraphs = [
  '🎈🎂🎈 រីករាយថ្ងៃខួបកំណើតមនុស្សពិសេសរបស់បង អុីង អុីង! 😍',
  'អរគុណអូនដែលបានចូលមកក្នុងជីវិតរបស់បង អរគុណសម្រាប់ការខិតខំប្រឹងប្រែងកន្លងមក អរគុណដែលបានធំធាត់ឡើងយ៉ាងល្អ អរគុណដែលតែងតែជាប្រភពនៃក្ដីសុខរបស់បង តែងតែធ្វើឱ្យបងសើច និងអរគុណសម្រាប់គ្រប់ៗយ៉ាង។',
  'បងសង្ឃឹមថានៅក្នុងថ្ងៃដ៏ពិសេសនេះ អូននឹងមានតែក្ដីសុខ ពោរពេញដោយភាពរីករាយ និងទទួលបានក្ដីស្រឡាញ់យ៉ាងកក់ក្ដៅ។ បងនឹងនៅក្បែរអូនជានិច្ច អូននឹងមិនបាត់បង់ក្ដីស្រឡាញ់ពីបងឡើយ ព្រោះអូនគឺជាគូរដណ្តឹងដ៏ល្អបំផុតរបស់បង 🫶🏻។',
  'អូនពិតជាមនុស្សស្រីដ៏អស្ចារ្យ និងមានតម្លៃបំផុតសម្រាប់បង។ សូមឱ្យអូនមានសុខភាពល្អ និងមានក្ដីសុខរាល់ថ្ងៃណា bby 🤍🤍 ព្រោះបងស្រឡាញ់អូនខ្លាំងជាងម្សិលមិញ ហើយនឹងស្រឡាញ់អូនកាន់តែខ្លាំងជារៀងរហូត 😚🤍。',
]

const displayedText = ref('')
const isTypingDone = ref(false)
let typingTimer: number | null = null

// Pure TypeScript typewriter implementation
function startTypewriter() {
  const fullText = rawLetterParagraphs.join('\n\n')
  let index = 0
  const speed = 26

  function typeChar() {
    if (index < fullText.length) {
      displayedText.value = fullText.slice(0, index + 1)
      index++

      // If just finished a paragraph (newline), pause briefly
      const char = fullText[index - 1]
      let delay = speed
      if (char === '\n') {
        delay = 400
      } else if (char === '。' || char === '!' || char === '😍') {
        delay = 250
      }

      typingTimer = window.setTimeout(typeChar, delay)
    } else {
      isTypingDone.value = true
    }
  }

  typeChar()
}

function skipTypewriter() {
  if (!isTypingDone.value) {
    if (typingTimer) clearTimeout(typingTimer)
    displayedText.value = rawLetterParagraphs.join('\n\n')
    isTypingDone.value = true
  }
}

// Floating decorative background emojis
interface FloatingEmoji {
  id: number
  emoji: string
  left: string
  top: string
  fontSize: string
  duration: string
  delay: string
}

const floatingEmojis = ref<FloatingEmoji[]>([])
const emojisList = ['🧸', '✨', '❤️', '🌸', '🎀', '⭐', '🍓', '🍰']

function initFloatingEmojis() {
  const list: FloatingEmoji[] = []
  for (let i = 0; i < 24; i++) {
    list.push({
      id: i,
      emoji: emojisList[Math.floor(Math.random() * emojisList.length)],
      left: `${Math.random() * 95}vw`,
      top: `${Math.random() * 90}vh`,
      fontSize: `${Math.random() * 18 + 16}px`,
      duration: `${Math.random() * 6 + 6}s`,
      delay: `${Math.random() * 5}s`,
    })
  }
  floatingEmojis.value = list
}

// Mouse/touch sparkle trail
interface SparkleItem {
  id: number
  x: number
  y: number
  symbol: string
}

const sparkles = ref<SparkleItem[]>([])
let sparkleIdCounter = 0

function handlePointerMove(e: MouseEvent | TouchEvent) {
  if (Math.random() > 0.45) return
  let clientX = 0
  let clientY = 0

  if ('touches' in e && e.touches.length > 0) {
    clientX = e.touches[0].clientX
    clientY = e.touches[0].clientY
  } else if ('pageX' in e) {
    clientX = (e as MouseEvent).pageX
    clientY = (e as MouseEvent).pageY
  }

  const id = ++sparkleIdCounter
  const symbol = Math.random() > 0.5 ? '✨' : '💖'
  sparkles.value.push({ id, x: clientX, y: clientY, symbol })

  setTimeout(() => {
    sparkles.value = sparkles.value.filter(s => s.id !== id)
  }, 700)
}

// Surprise Modal logic
const isModalOpen = ref(false)
const activeTab = ref<'video' | 'photo'>('video')
const videoRef = ref<HTMLVideoElement | null>(null)

function openSurpriseModal() {
  playCelebrationSound()
  isModalOpen.value = true

  safeConfetti({
    particleCount: 100,
    spread: 80,
    origin: { y: 0.6 },
  })

  // Try to play video inline safely
  if (videoRef.value) {
    videoRef.value.play().catch(() => {})
  }
}

function closeSurpriseModal() {
  isModalOpen.value = false
  if (videoRef.value) {
    videoRef.value.pause()
  }
  resumeFromMedia()
}

function onVideoPlay() {
  pauseForMedia()
}

function onVideoPause() {
  resumeFromMedia()
}

function onVideoEnded() {
  resumeFromMedia()
}

onMounted(() => {
  initFloatingEmojis()
  startTypewriter()
})

onUnmounted(() => {
  if (typingTimer) clearTimeout(typingTimer)
  resumeFromMedia()
})
</script>

<template>
  <div
    class="letter-stage"
    @mousemove="handlePointerMove"
    @touchmove.passive="handlePointerMove"
  >
    <!-- Floating background emojis -->
    <div
      v-for="item in floatingEmojis"
      :key="item.id"
      class="floating-element"
      :style="{
        left: item.left,
        top: item.top,
        fontSize: item.fontSize,
        animationDuration: item.duration,
        animationDelay: item.delay,
      }"
    >
      {{ item.emoji }}
    </div>

    <!-- Mouse sparkle trail -->
    <span
      v-for="s in sparkles"
      :key="s.id"
      class="sparkle-trail"
      :style="{ left: `${s.x}px`, top: `${s.y}px` }"
    >
      {{ s.symbol }}
    </span>

    <div class="container">
      <header>
        <h1>For You Ing Ing ❤️</h1>
        <p class="header-subtitle">សំបុត្រពិសេសសម្រាប់អូន 💌</p>
      </header>

      <!-- Letter Section -->
      <div class="letter-container" @click="skipTypewriter">
        <div class="letter" id="typed-text">
          <span style="white-space: pre-wrap;">{{ displayedText }}</span>
          <span v-if="!isTypingDone" class="typed-cursor">💖</span>
        </div>
      </div>

      <!-- Surprise Button -->
      <div class="surprise-button-container">
        <button
          class="surprise-button"
          :class="{ 'pulse-glow': isTypingDone }"
          id="surprise-button"
          type="button"
          @click="openSurpriseModal"
        >
          <span>Click for a Surprise! 🎁</span>
        </button>
      </div>

      <!-- Navigation -->
      <div class="navigation-row">
        <router-link to="/cake" class="back-button">
          <i class="fas fa-arrow-left"></i>
          <span>Back to Birthday Cake</span>
        </router-link>
        <router-link to="/" class="restart-button">
          <i class="fas fa-rotate-left"></i>
          <span>Start from Beginning</span>
        </router-link>
      </div>
    </div>

    <!-- Modal for Special Surprise -->
    <div
      class="modal-overlay"
      :class="{ active: isModalOpen }"
      id="modal-overlay"
      @click.self="closeSurpriseModal"
    >
      <div class="modal">
        <button
          class="modal-close"
          id="modal-close"
          aria-label="Close modal"
          type="button"
          @click="closeSurpriseModal"
        >
          ×
        </button>

        <div class="modal-header">
          <h2>🎉 Surprise for Ing Ing! 🎉</h2>
          <p>កាដូអនុស្សាវរីយ៍ដ៏មានតម្លៃបំផុតសម្រាប់អូន 💕</p>
        </div>

        <!-- Media tabs -->
        <div class="modal-tabs">
          <button
            class="tab-btn"
            :class="{ active: activeTab === 'video' }"
            id="tabVideo"
            type="button"
            @click="activeTab = 'video'"
          >
            <i class="fas fa-film"></i>
            <span>Special Video 🎥</span>
          </button>
          <button
            class="tab-btn"
            :class="{ active: activeTab === 'photo' }"
            id="tabPhoto"
            type="button"
            @click="activeTab = 'photo'"
          >
            <i class="fas fa-image"></i>
            <span>Photo & Note 💖</span>
          </button>
        </div>

        <!-- Video Tab Content -->
        <div
          class="tab-content"
          :class="{ active: activeTab === 'video' }"
          id="contentVideo"
        >
          <div class="video-card">
            <video
              ref="videoRef"
              id="surpriseVideo"
              controls
              playsinline
              webkit-playsinline
              preload="metadata"
              :poster="assetUrl('images/photos/photo_02.jpg')"
              @play="onVideoPlay"
              @pause="onVideoPause"
              @ended="onVideoEnded"
            >
              <source :src="assetUrl('images/photos/video.mp4')" type="video/mp4" />
              Your browser does not support video tag.
            </video>
          </div>
        </div>

        <!-- Photo Tab Content -->
        <div
          class="tab-content"
          :class="{ active: activeTab === 'photo' }"
          id="contentPhoto"
        >
          <div class="photo-card-wrap">
            <img :src="assetUrl('images/photos/photo_02.jpg')" alt="Ing Ing" />
            <div class="photo-note">
              <p>
                "ស្នាមញញឹមរបស់អូន គឺជាក្ដីសុខដ៏ធំបំផុតរបស់បង។ រីករាយថ្ងៃខួបកំណើតណា Oun Sml 🎂✨"
              </p>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <p class="footer-love">Forever with you, my love 🫶</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
@import '@/assets/css/letter.css';

.letter-stage {
  min-height: 100vh;
  min-height: 100dvh;
  background: linear-gradient(-45deg, #fce4ec, #f3e5f5, #e8eaf6, #e0f2f1);
  background-size: 400% 400%;
  animation: gradientShift 14s ease infinite;
  position: relative;
  overflow-x: hidden;
  color: #3e2723;
}

.letter-stage .container {
  text-align: initial;
}

.letter-stage .letter-container {
  text-align: left !important;
}

.letter-stage .letter {
  text-align: left !important;
  direction: ltr !important;
  line-height: 2.2 !important;
}

.typed-cursor {
  display: inline-block;
  font-size: 1.2rem;
  margin-left: 4px;
  animation: cursorBlink 0.8s infinite ease-in-out;
}

@keyframes cursorBlink {
  0%, 100% { opacity: 1; transform: scale(1.1); }
  50% { opacity: 0.2; transform: scale(0.9); }
}
</style>
