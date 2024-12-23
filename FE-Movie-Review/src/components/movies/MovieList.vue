<script setup>
import { onMounted, ref } from 'vue'
import MovieDisplay from './MovieDisplay.vue'
import { useMovieStore } from '@/stores/movie'
import { useRateStore } from '@/stores/rate'

const reviewModal = ref(false)
const movieStore = useMovieStore()
const rateStore = useRateStore()
const movies = ref([])
const ratedMovies = ref([])

onMounted(async () => {
  const fetchMovies = await movieStore.getAllMovies()
  const fetchRatedMovies = await rateStore.getRatedMovies()
  movies.value = fetchMovies
  ratedMovies.value = fetchRatedMovies
})
</script>

<template>
  <MovieDisplay :movies="movieStore.movies" :userRatings="ratedMovies" />
</template>

<style scoped></style>
