<script setup lang="ts">
import { assetUrl } from '@/utils/assets'
</script>

<template>
  <div class="ambient-accents">
    <span class="accent-star st1">✨</span>
    <span class="accent-star st2">⭐</span>
    <span class="accent-star st3">✨</span>
    <span class="accent-star st4">⭐</span>
    <div class="decorate_flower--one">
      <img width="28" :src="assetUrl('images/decorate_flower.png')" alt="" />
    </div>
    <div class="decorate_flower--two">
      <img width="26" :src="assetUrl('images/decorate_flower.png')" alt="" />
    </div>
    <div class="decorate_bottom">
      <img :src="assetUrl('images/decorate.png')" alt="" width="95" />
    </div>
    <div class="smiley__icon">
      <img :src="assetUrl('images/smiley_icon.png')" alt="" width="75" />
    </div>
  </div>
</template>

<style scoped>
.ambient-accents {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
  z-index: 1;
}

.accent-star {
  position: absolute;
  font-size: 20px;
  animation: starTwinkle 3s infinite ease-in-out;
}

.st1 { top: 12%; left: 8%; animation-delay: 0.2s; }
.st2 { top: 25%; right: 10%; animation-delay: 1.1s; }
.st3 { bottom: 20%; left: 12%; animation-delay: 1.8s; }
.st4 { bottom: 15%; right: 15%; animation-delay: 0.7s; }

@keyframes starTwinkle {
  0%, 100% { opacity: 0.3; transform: scale(0.8) rotate(0deg); }
  50% { opacity: 1; transform: scale(1.2) rotate(180deg); }
}

.decorate_flower--one {
  position: absolute;
  top: 15%;
  left: 3%;
  animation: floatFlower 6s ease-in-out infinite;
}

.decorate_flower--two {
  position: absolute;
  bottom: 25%;
  right: 4%;
  animation: floatFlower 7s ease-in-out infinite reverse;
}

.decorate_bottom {
  position: absolute;
  bottom: 10px;
  left: 15px;
  opacity: 0.85;
}

.smiley__icon {
  position: absolute;
  top: 18px;
  right: 18px;
  opacity: 0.9;
  animation: gentleBob 4s ease-in-out infinite;
}

@keyframes floatFlower {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-12px) rotate(15deg); }
}

@keyframes gentleBob {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}
</style>
