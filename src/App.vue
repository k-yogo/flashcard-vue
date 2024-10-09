<script setup>
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
  <header>
    <router-link to="/">Flashcard</router-link>
  </header>
  <RouterView />
</template>

<style scoped>

</style>
