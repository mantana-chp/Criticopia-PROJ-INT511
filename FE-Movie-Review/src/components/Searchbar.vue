<script setup>
import { Search } from 'lucide-vue-next'
import { onMounted, ref } from 'vue'
import { initFlowbite } from 'flowbite'
import { useMovieStore } from '@/stores/movie'

onMounted(() => {
  initFlowbite()
})

const searchQuery = ref('')
const loading = ref(false)
const movies = ref([])

const movieStore = useMovieStore()

const searchMovies = async (searchTitle) => {
  if (searchTitle === '') {
    await movieStore.getAllMovies()
    return
  }

  loading.value = true
  movies.value = []
  searchTitle = searchQuery.value

  const searchResult = await movieStore.searchMovie(searchTitle)
  movies.value = searchResult

  searchQuery.value = ''
}
</script>

<template>
  <div class="max-w-md mx-auto relative">
    <label for="search-input" class="sr-only"> Search </label>
    <div class="relative w-full items-center">
      <!-- Search Icon -->
      <div
        class="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none"
      >
        <Search class="w-5 h-5 text-gray-500" />
      </div>
      <!-- Input Field -->
      <input
        type="search"
        v-model="searchQuery"
        id="search-input"
        class="w-full pl-12 pr-4 py-3 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        placeholder="Search title of movie"
        required
      />
      <!-- Submit Button -->
      <button
        class="absolute right-2.5 top-1.5 bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 text-white font-medium rounded-lg text-sm px-4 py-2"
        @click="searchMovies(searchQuery)"
      >
        Search
      </button>
    </div>
  </div>
</template>

<style scoped>
/* Adds a subtle shadow around the input when focused for better contrast */
input:focus {
  box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
}
</style>
