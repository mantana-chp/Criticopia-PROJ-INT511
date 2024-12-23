<script setup>
import { onMounted } from 'vue'
import Navbar from './components/Navbar.vue'
import { useUserStore } from './stores/user'
</script>

<template>
  <Navbar />
  <RouterView />
</template>

<style scoped></style>
