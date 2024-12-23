<script setup>
import MovieList from '@/components/movies/MovieList.vue'
import { CirclePlus } from 'lucide-vue-next'
</script>

<template>
  <div class="flex justify-between items-center py-4 w-full px-6">
    <span class="text-xl font-semibold">Manage Movies</span>

    <!-- Add Movie Button -->
    <RouterLink :to="{ name: 'add-movie' }">
      <button
        class="flex items-center gap-3 bg-blue-500 text-white px-4 py-1 rounded-full hover:bg-blue-600 active:scale-95 transition-all duration-300 transform shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        <CirclePlus :stroke-width="1.5" size="24" />
        <span>Add New Movie</span>
      </button>
    </RouterLink>
  </div>

  <!-- Movie list -->
  <div class="flex justify-center gap-4 p-4">
    <MovieList />
  </div>
</template>

<style scoped></style>
