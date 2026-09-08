<script setup lang="ts">
import SweetMusicWidget from '@/components/SweetMusicWidget.vue'
</script>

<template>
  <div id="app-root">
    <router-view v-slot="{ Component }">
      <transition name="page-fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>

    <!-- Global Persistent Romantic Background Music Engine & Widget -->
    <SweetMusicWidget />
  </div>
</template>

<style>
/* Global reset & typography */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html, body, #app, #app-root {
  min-height: 100vh;
  min-height: 100dvh;
  width: 100%;
}

body {
  font-family: 'Poppins', 'Kantumruy Pro', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-tap-highlight-color: transparent;
}

/* Smooth route transition */
.page-fade-enter-active,
.page-fade-leave-active {
  transition: opacity 0.3s ease;
}

.page-fade-enter-from,
.page-fade-leave-to {
  opacity: 0;
}
</style>
