<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import type { CandleState } from '@/types'
import { useAudio } from '@/composables/useAudio'
import { useConfetti } from '@/composables/useConfetti'

const router = useRouter()
const { playBlowSound, playChimeSound, playCelebrationSound } = useAudio()
const { fireSingleCandleConfetti, fireCelebrationCannons } = useConfetti()

const colors = ['green-candle', 'purple-candle', 'blue-candle', 'yellow-candle']
const candleCount = 10
const CAKE_VISUAL_WIDTH = 35

const candles = ref<CandleState[]>([])
const isFinished = ref(false)

function initCandles() {
  const CANDLE_VISUAL_WIDTH = 2
  const availableWidth = CAKE_VISUAL_WIDTH
  const candlesPerRow = 6
  const shiftAmount = 4
  const list: CandleState[] = []

  for (let i = 0; i < candleCount; i++) {
    const colorClass = colors[Math.floor(Math.random() * colors.length)]
    const row = Math.floor(i / candlesPerRow)
    const col = i % candlesPerRow
    const totalCandlesInRow = Math.min(candlesPerRow, candleCount - row * candlesPerRow)
    const rowSpacing = availableWidth / (totalCandlesInRow + 1)
    const leftBase = rowSpacing * (col + 1) - CANDLE_VISUAL_WIDTH / 2 + 5
    const rowShift = row % 2 === 0 ? 0 : shiftAmount

    list.push({
      id: i + 1,
      colorClass,
      isBlown: false,
      top: `${10 + row * 3}px`,
      left: `${leftBase - rowShift + 4}px`,
    })
  }

  candles.value = list
}

const remainingCount = computed(() => {
  return candles.value.filter(c => !c.isBlown).length
})

const subTitleText = computed(() => {
  if (isFinished.value) {
    return 'Yayy! Love you so much Ing Ing!! 🎉❤️'
  }
  if (remainingCount.value === candleCount) {
    return 'Make a wish and blow the candles 🕯️ / សូមប៉ងប្រាថ្នារួចផ្លុំទៀនណា'
  }
  if (remainingCount.value === 1) {
    return 'One more candle! 🎂 / នៅសល់តែមួយទៀនទៀតទេ!'
  }
  return `${remainingCount.value} candles left! Keep blowing! 🌬️`
})

function blowSpecificCandle(candle: CandleState) {
  if (candle.isBlown) return
  candle.isBlown = true
  playBlowSound()
  fireSingleCandleConfetti()
  checkCompletion()
}

function blowOneCandle() {
  const unblown = candles.value.filter(c => !c.isBlown)
  if (unblown.length === 0) return
  const randomCandle = unblown[Math.floor(Math.random() * unblown.length)]
  blowSpecificCandle(randomCandle)
}

function checkCompletion() {
  if (remainingCount.value === 0 && !isFinished.value) {
    isFinished.value = true
    playChimeSound()
    playCelebrationSound()
    fireCelebrationCannons(3000)
  }
}

onMounted(() => {
  initCandles()
})
</script>

<template>
  <div class="cake-stage">
    <div class="container">
      <div id="birthdayText">
        <div id="mainTitle">Happy Birthday, Ing Ing! 🎂</div>
        <div id="subTitle">{{ subTitleText }}</div>
      </div>

      <!-- Action Button (Placed ABOVE Cake) -->
      <div class="action-buttons-area">
        <button
          v-if="!isFinished"
          id="blowButton"
          type="button"
          @click="blowOneCandle"
        >
          <i class="fa-solid fa-wind"></i>
          <span>Blow Candle</span>
        </button>

        <!-- Revealed after all candles are blown -->
        <div v-else class="next-action-container" style="display: block;">
          <router-link to="/letter" class="btn-final-letter">
            <span>Next Surprise: Final Letter & Gift 💌</span>
            <i class="fa-solid fa-arrow-right"></i>
          </router-link>
        </div>
      </div>

      <!-- Cake Container -->
      <div
        class="cake-container"
        id="cakeContainer"
        :class="{ celebrate: isFinished }"
        @click="blowOneCandle"
      >
        <div class="cake" id="cake">
          <div
            v-for="candle in candles"
            :key="candle.id"
            class="candle"
            :class="[candle.colorClass, { blown: candle.isBlown }]"
            :style="{ position: 'absolute', top: candle.top, left: candle.left }"
            @click.stop="blowSpecificCandle(candle)"
          ></div>
        </div>
      </div>

      <!-- Bottom Navigation -->
      <div class="cake-nav-back">
        <router-link to="/memory-lane">
          <i class="fa-solid fa-arrow-left"></i>
          <span>Back to Memories</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<style>
@import '@/assets/css/cake.css';

.cake-stage {
  box-sizing: border-box;
  background-color: #feefe5 !important;
  background-image: radial-gradient(#fcd6c4 1.5px, transparent 1.5px) !important;
  background-size: 20px 20px !important;
  min-height: 100vh !important;
  min-height: 100dvh !important;
  height: auto !important;
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
  justify-content: center !important;
  padding: 10px 15px !important;
  margin: 0 !important;
  overflow-x: hidden !important;
  overflow-y: auto !important;
  font-family: 'Pixelify Sans', 'Kantumruy Pro', sans-serif !important;
}

.cake-stage .container {
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
  text-align: center !important;
  max-width: 520px !important;
  width: 100% !important;
  margin: 0 auto !important;
  padding: 0 !important;
  padding-bottom: 0 !important;
}

.cake-stage #birthdayText {
  margin-bottom: 4px !important;
}

.cake-stage #mainTitle {
  font-size: 26px !important;
  color: #ff4370 !important;
  margin-bottom: 2px !important;
}

.cake-stage #subTitle {
  font-size: 15px !important;
  color: #6d4b58 !important;
  min-height: 22px !important;
}

.cake-stage .action-buttons-area {
  margin: 4px 0 8px !important;
  min-height: 42px !important;
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
  z-index: 10 !important;
}

.cake-stage #blowButton {
  padding: 8px 24px !important;
  font-size: 16px !important;
  box-shadow: 0 4px 15px rgba(255, 67, 112, 0.4) !important;
}

.cake-stage .cake-container {
  position: relative !important;
  width: 280px !important;
  height: 250px !important;
  margin: 0 auto !important;
  display: block !important;
  overflow: visible !important;
}

.cake-stage .cake {
  position: absolute !important;
  top: -45px !important;
  left: 7px !important;
  width: 1px !important;
  height: 1px !important;
  transform-origin: 0 0 !important;
  transform: scale(4.5) !important;
  animation: cake 1s infinite !important;
  z-index: 1 !important;
  overflow: visible !important;
  cursor: pointer !important;
}

.cake-stage .candle {
  cursor: pointer !important;
}

.cake-stage .cake-nav-back {
  margin-top: 10px !important;
}

.cake-stage .cake-nav-back a {
  font-size: 13px !important;
  padding: 5px 16px !important;
}

@media (max-width: 520px), (max-height: 650px) {
  .cake-stage #mainTitle { font-size: 22px !important; }
  .cake-stage #subTitle { font-size: 13px !important; }
  .cake-stage .cake-container { width: 235px !important; height: 210px !important; }
  .cake-stage .cake { transform: scale(3.7) !important; top: -37px !important; left: 6px !important; }
}

@media (max-width: 380px), (max-height: 580px) {
  .cake-stage #mainTitle { font-size: 20px !important; }
  .cake-stage #subTitle { font-size: 12px !important; }
  .cake-stage .cake-container { width: 210px !important; height: 190px !important; }
  .cake-stage .cake { transform: scale(3.3) !important; top: -33px !important; left: 5px !important; }
  .cake-stage #blowButton { padding: 7px 20px !important; font-size: 15px !important; }
}
</style>
