<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AmbientSparkles from '@/components/AmbientSparkles.vue'
import { useAudio } from '@/composables/useAudio'
import { useConfetti } from '@/composables/useConfetti'
import { assetUrl } from '@/utils/assets'

const router = useRouter()
const { isPlaying, toggleMusic, startMusic, playCelebrationSound, playSparkleSound } = useAudio()
const { fireSplashConfetti, fireCardConfetti } = useConfetti()

// Splash screen state
const showSplash = ref(true)
const isUnboxing = ref(false)
const isSplashFading = ref(false)
const isGiftBoxOpened = ref(false)

// Greeting card modal state
const isCardModalOpen = ref(false)
const isCardFoldOpen = ref(true)

function triggerSplashUnbox() {
  if (isUnboxing.value) return
  isUnboxing.value = true
  isGiftBoxOpened.value = true

  // 1. Play joyful fanfare sound
  playCelebrationSound()

  // 2. Start romantic music box
  setTimeout(() => {
    startMusic()
  }, 500)

  // 3. Confetti burst
  fireSplashConfetti()

  // 4. Fade out overlay
  setTimeout(() => {
    isSplashFading.value = true
    setTimeout(() => {
      showSplash.value = false
      isUnboxing.value = false
    }, 650)
  }, 350)
}

function replayIntro() {
  playSparkleSound()
  isGiftBoxOpened.value = false
  isSplashFading.value = false
  showSplash.value = true
  isUnboxing.value = false
}

function openLetterCard() {
  isCardModalOpen.value = true
  isCardFoldOpen.value = true
  playCelebrationSound()
  fireCardConfetti()
}

function closeLetterCard() {
  isCardModalOpen.value = false
}

function toggleCardFold(e: MouseEvent) {
  const target = e.target as HTMLElement
  if (!target.closest('a') && !target.closest('button')) {
    isCardFoldOpen.value = !isCardFoldOpen.value
  }
}

function navigateTo(path: string) {
  closeLetterCard()
  router.push(path)
}
</script>

<template>
  <div class="welcome-stage">
    <!-- 1. Interactive Splash Screen Welcome Gate -->
    <div
      v-if="showSplash"
      id="splashScreen"
      class="splash-overlay"
      :class="{ 'fade-out': isSplashFading }"
    >
      <div class="splash-particles">
        <span class="sparkle s1">✨</span>
        <span class="sparkle s2">🌸</span>
        <span class="sparkle s3">💖</span>
        <span class="sparkle s4">🎂</span>
        <span class="sparkle s5">✨</span>
        <span class="sparkle s6">🎀</span>
        <span class="sparkle s7">🧸</span>
      </div>

      <div class="splash-card" id="splashCard">
        <button
          class="splash-close-btn"
          id="closeSplashBtn"
          aria-label="Skip intro"
          title="Enter Website"
          @click.stop="triggerSplashUnbox"
        >
          ✕
        </button>
        <div class="splash-badge">Special Birthday Delivery 🎀</div>

        <div
          class="gift-box-wrapper"
          id="giftBoxTrigger"
          role="button"
          tabindex="0"
          aria-label="Tap to Open Your Birthday Surprise"
          @click.stop="triggerSplashUnbox"
        >
          <div class="gift-box" :class="{ opened: isGiftBoxOpened }">
            <div class="gift-lid">
              <div class="gift-bow">🎀</div>
              <div class="gift-lid-strip"></div>
            </div>
            <div class="gift-body">
              <div class="gift-body-vstrip"></div>
              <div class="gift-body-hstrip"></div>
              <div class="gift-tag">For Ing Ing 💕</div>
            </div>
          </div>
          <div class="gift-shadow"></div>
        </div>

        <h1 class="splash-title">Happy Birthday Ing Ing!</h1>
        <p class="splash-subtitle">ជូនចំពោះគូរដណ្តឹងដ៏ល្អបំផុតរបស់បង 💍</p>
        <div class="splash-date-badge">✨ 10 September ✨</div>
        <p class="splash-hint">A magical birthday surprise awaits you today...</p>

        <button
          class="btn-splash-open"
          id="openGiftBtn"
          type="button"
          @click.stop="triggerSplashUnbox"
        >
          <i class="fa-solid fa-gift"></i>
          <span>Tap to Open Surprise ✨</span>
          <i class="fa-solid fa-heart"></i>
        </button>
      </div>
    </div>

    <!-- 2. Main Hero Stage Container -->
    <div id="wrapper">
      <AmbientSparkles />

      <!-- Top Header & Bunting Banner -->
      <header class="top-festive-bar">
        <div class="flag__birthday">
          <img :src="assetUrl('images/1.png')" alt="Party flags" class="flag__left" />
          <img :src="assetUrl('images/1.png')" alt="Party flags" class="flag__right" />
        </div>

        <!-- Top Controls: Replay Intro & Sweet Music -->
        <div class="top-controls">
          <button
            id="replaySplashBtn"
            class="btn-top-tool"
            title="Replay Welcome Surprise"
            @click="replayIntro"
          >
            <i class="fa-solid fa-gift"></i>
            <span>Replay Intro</span>
          </button>
          <button
            id="musicToggleBtn"
            class="btn-top-tool"
            :class="{ 'music-active': isPlaying }"
            title="Play / Pause Sweet Romantic Music"
            @click="toggleMusic"
          >
            <i :class="isPlaying ? 'fa-solid fa-music' : 'fa-solid fa-play'"></i>
            <span>{{ isPlaying ? 'Sweet Music 💕' : 'Play Music 🎵' }}</span>
          </button>
        </div>
      </header>

      <!-- Main Hero Showcase Section -->
      <main class="hero-stage">
        <div class="hero-container">
          <!-- Left Column: Festive Typography & Actions -->
          <div class="hero-left">
            <div class="hero-tag-badge">
              <i class="fa-solid fa-crown"></i>
              <span>Happy Birthday My Fiancee 💍</span>
            </div>

            <div class="title">
              <h1 class="happy">
                <span style="--t: 0.1s;">H</span>
                <span style="--t: 0.2s;">a</span>
                <span style="--t: 0.3s;">p</span>
                <span style="--t: 0.4s;">p</span>
                <span style="--t: 0.5s;">y</span>
              </h1>
              <h1 class="birthday">
                <span style="--t: 0.6s;">B</span>
                <span style="--t: 0.7s;">i</span>
                <span style="--t: 0.8s;">r</span>
                <span style="--t: 0.9s;">t</span>
                <span style="--t: 1.0s;">h</span>
                <span style="--t: 1.1s;">d</span>
                <span style="--t: 1.2s;">a</span>
                <span style="--t: 1.3s;">y</span>
              </h1>
              <div class="hero-name-row">
                <span class="name-heart">💖</span>
                <span class="name-text">Ing Ing</span>
                <span class="name-heart">💖</span>
              </div>
              <div class="hat">
                <img :src="assetUrl('images/hat.png')" alt="Birthday Hat" width="125" />
              </div>
            </div>

            <!-- Date Badge -->
            <div class="date__of__birth">
              <i class="fa-solid fa-star"></i>
              <span>10 September</span>
              <i class="fa-solid fa-star"></i>
            </div>

            <!-- Romantic Khmer Quote -->
            <div class="hero-quote-card">
              <p>រីករាយថ្ងៃខួបកំណើតមនុស្សពិសេសរបស់បង អុីង អុីង! 🎂💍</p>
              <p class="subquote">ស្រឡាញ់អូនខ្លាំងជាងម្សិលមិញ និងកាន់តែខ្លាំងជារៀងរហូត 🤍✨</p>
            </div>

            <!-- Primary Action Buttons -->
            <div class="hero-actions">
              <button
                id="btn__letter"
                class="btn-action-primary"
                type="button"
                @click="openLetterCard"
              >
                <div class="mail">
                  <i class="fa-solid fa-envelope-open-text"></i>
                  <span>Click Here Ing Ing ✉</span>
                </div>
              </button>

              <router-link to="/memory-lane" class="btn-action-secondary">
                <span>Go to Memory Lane 📸</span>
                <i class="fa-solid fa-arrow-right"></i>
              </router-link>
            </div>
          </div>

          <!-- Right Column: Ing Ing Framed Portrait Showcase -->
          <div class="hero-right">
            <div class="portrait-card">
              <div class="portrait-aura"></div>
              <div class="portrait-crown" title="Birthday Queen">👑</div>

              <!-- Floating Cute Sparkles around Portrait -->
              <div class="portrait-sparkles">
                <span class="ps s1">✨</span>
                <span class="ps s2">💖</span>
                <span class="ps s3">🌸</span>
                <span class="ps s4">⭐</span>
              </div>

              <div class="portrait-frame">
                <img
                  :src="assetUrl('images/photos/photo_02.jpg')"
                  alt="Ing Ing - Birthday Girl"
                  class="portrait-photo"
                />
              </div>

              <!-- Floating Badges -->
              <div class="float-badge badge-role">
                <span>គូរដណ្តឹងដ៏ល្អបំផុត 💍</span>
              </div>
              <div class="float-badge badge-nick">
                <span>Oun Sml 🎀</span>
              </div>
              <div class="float-badge badge-name">
                <i class="fa-solid fa-heart"></i>
                <span>Dear Ing Ing</span>
                <i class="fa-solid fa-heart"></i>
              </div>

              <!-- Floating Festive Balloons -->
              <div class="balloon-float balloon-left">
                <img :src="assetUrl('images/balloon1.png')" alt="Pink balloon" width="95" />
              </div>
              <div class="balloon-float balloon-right">
                <img :src="assetUrl('images/balloon2.png')" alt="Red balloon" width="95" />
              </div>

              <!-- Rotating Birthday Circle Badge -->
              <div class="cricle">
                <div class="text__cricle">
                  <span style="--i: 1;">h</span>
                  <span style="--i: 2;">a</span>
                  <span style="--i: 3;">p</span>
                  <span style="--i: 4;">p</span>
                  <span style="--i: 5;">y</span>
                  <span style="--i: 6;">-</span>
                  <span style="--i: 7;">b</span>
                  <span style="--i: 8;">i</span>
                  <span style="--i: 9;">r</span>
                  <span style="--i: 10;">t</span>
                  <span style="--i: 11;">h</span>
                  <span style="--i: 12;">d</span>
                  <span style="--i: 13;">a</span>
                  <span style="--i: 14;">y</span>
                  <span style="--i: 15;">-</span>
                </div>
                <i class="fa-solid fa-heart"></i>
              </div>
            </div>
          </div>
        </div>
      </main>

      <!-- Bottom Birthday Journey Roadmap -->
      <footer class="journey-roadmap">
        <div class="journey-header">
          <span class="journey-title">Birthday Celebration Journey 🗺️</span>
        </div>
        <div class="journey-steps">
          <div class="step-card current">
            <span class="step-num">Stage 1</span>
            <span class="step-title">Welcome 🎂</span>
            <span class="step-status">Active</span>
          </div>
          <div class="step-connector"></div>
          <router-link to="/memory-lane" class="step-card">
            <span class="step-num">Stage 2</span>
            <span class="step-title">Memory Lane 📸</span>
            <span class="step-arrow"><i class="fa-solid fa-arrow-right"></i></span>
          </router-link>
          <div class="step-connector"></div>
          <router-link to="/cake" class="step-card">
            <span class="step-num">Stage 3</span>
            <span class="step-title">Birthday Cake 🍰</span>
            <span class="step-arrow"><i class="fa-solid fa-arrow-right"></i></span>
          </router-link>
          <div class="step-connector"></div>
          <router-link to="/letter" class="step-card">
            <span class="step-num">Stage 4</span>
            <span class="step-title">Special Gift 💌</span>
            <span class="step-arrow"><i class="fa-solid fa-arrow-right"></i></span>
          </router-link>
        </div>
      </footer>
    </div>

    <!-- 3. 3D Folding Greeting Card Modal -->
    <div
      class="boxMail"
      :class="{ active: isCardModalOpen }"
      @click.self="closeLetterCard"
    >
      <i class="fa-solid fa-xmark" @click="closeLetterCard"></i>
      <div
        class="boxMail-container"
        :class="{ 'is-open': isCardFoldOpen }"
        @click="toggleCardFold"
      >
        <div class="card1">
          <div class="userImg">
            <img :src="assetUrl('images/photos/photo_02.jpg')" alt="Ing Ing" />
          </div>
          <h4 class="username">To: Ing Ing 💖<span class="underline"></span></h4>
          <h3>Happy Birthday</h3>
          <div class="imageCute">
            <span>🎂✨🌸</span>
          </div>
        </div>
        <div class="card2">
          <div class="card2-content">
            <h3>To My Love! 💕</h3>
            <h2>
              🎈🎂🎈 រីករាយថ្ងៃខួបកំណើតមនុស្សពិសេសរបស់បង អុីង អុីង! 😍<br /><br />
              អរគុណអូនដែលបានចូលមកក្នុងជីវិតរបស់បង អរគុណសម្រាប់ការខិតខំប្រឹងប្រែងកន្លងមក អរគុណដែលបានធំធាត់ឡើងយ៉ាងល្អ អរគុណដែលតែងតែជាប្រភពនៃក្ដីសុខរបស់បង តែងតែធ្វើឱ្យបងសើច និងអរគុណសម្រាប់គ្រប់ៗយ៉ាង。<br /><br />
              បងសង្ឃឹមថានៅក្នុងថ្ងៃដ៏ពិសេសនេះ អូននឹងមានតែក្ដីសុខ ពោរពេញដោយភាពរីករាយ និងទទួលបានក្ដីស្រឡាញ់យ៉ាងកក់ក្ដៅ។ បងនឹងនៅក្បែរអូនជានិច្ច អូននឹងមិនបាត់បង់ក្ដីស្រឡាញ់ពីបងឡើយ ព្រោះអូនគឺជាគូរដណ្តឹងដ៏ល្អបំផុតរបស់បង 🫶🏻。<br /><br />
              អូនពិតជាមនុស្សស្រីដ៏អស្ចារ្យ និងមានតម្លៃបំផុតសម្រាប់បង។ សូមឱ្យអូនមានសុខភាពល្អ និងមានក្ដីសុខរាល់ថ្ងៃណា bby 🤍🤍 ព្រោះបងស្រឡាញ់អូនខ្លាំងជាងម្សិលមិញ ហើយនឹងស្រឡាញ់អូនកាន់តែខ្លាំងជារៀងរហូត 😚🤍។
            </h2>

            <div class="card2-action">
              <button
                class="btn-card-next"
                type="button"
                @click="navigateTo('/memory-lane')"
              >
                <span>Next Surprise: Memory Lane 📸</span>
                <i class="fa-solid fa-arrow-right"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
@import '@/assets/css/style.css';

.welcome-stage {
  min-height: 100vh;
  min-height: 100dvh;
  background-color: var(--color-pink);
  position: relative;
  overflow-x: hidden;
}
</style>
