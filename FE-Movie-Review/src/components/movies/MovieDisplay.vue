<script setup>
import RateButton from '../partials/RateButton.vue'
import StarOutline from '/imgs/star-outline.svg'
import StarFilled from '/imgs/star-filled.svg'
import StarYellow from '/imgs/star-yellow.svg'
import Bookmark from '/imgs/Bookmark.svg'
import HoverBookmark from '/imgs/Hover Bookmark.svg'
import MovieCard from './MovieCard.vue'
import { ref } from 'vue'
import { useMovieStore } from '@/stores/movie'
import { useUserStore } from '@/stores/user'
import router from '@/router'
import RatingModal from './RatingModal.vue'
import { useWatchlistStore } from '@/stores/watchlist'

const props = defineProps({
  movies: Array,
  userRatings: Array
})
const movieStore = useMovieStore()
const userStore = useUserStore()
const watchlistStore = useWatchlistStore()

const hover = ref(false)
const bookmarkHover = ref(null)
const reviewModal = ref(false)

const getMovieById = async (id) => {
  await movieStore.getMovieById(id)
  router.push({ name: 'movie-details', params: { id: id } })
}

const selectedMovieId = ref(null)

const openReviewModal = (id) => {
  reviewModal.value = true
  selectedMovieId.value = id
}

const closeModal = () => {
  reviewModal.value = false
}

const hasRated = (movieId) => {
  const isRating = props.userRatings.some(
    (rating) => rating.movieId === movieId
  )
  return isRating
}

const toggleWatchlist = async (movieId) => {
  const userId = userStore.user.userId

  if (watchlistStore.isInWatchlist(movieId)) {
    console.log('remove')
    await watchlistStore.removeFromWatchlist(userId, movieId)
  } else {
    console.log('add')
    await watchlistStore.addToWatchlist(userId, movieId)
  }

  await watchlistStore.getWatchlist(userId)
}
</script>

<template>
  <div
    class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6"
  >
    <MovieCard v-for="movie in movies" :key="movie.id">
      <template #main>
        <div class="relative">
          <!-- Bookmark Button -->
          <button
            @mouseover="bookmarkHover = movie.id"
            @mouseleave="bookmarkHover = null"
            class="absolute -top-2 -right-3"
            v-if="!userStore.isAdmin"
            @click="toggleWatchlist(movie.id)"
          >
            <img
              :src="
                bookmarkHover === movie.id ||
                watchlistStore.isInWatchlist(movie.id)
                  ? HoverBookmark
                  : Bookmark
              "
              alt="bookmark"
              class="w-8"
            />
          </button>

          <!-- Movie Content -->
          <div
            class="flex flex-col items-start"
            @click="getMovieById(movie.id)"
          >
            <!-- Movie Image -->
            <img
              :src="movie.primaryImage"
              alt="cover"
              class="movie-image rounded-lg"
            />
            <div class="flex flex-col gap-2 mt-2">
              <span>{{ movie.title }}</span>
              <div class="flex gap-2 items-center text-sm">
                <img :src="StarYellow" alt="star" class="w-4" />
                <span> {{ movie.avgRating }}</span>
              </div>
            </div>
          </div>

          <!-- Rate Button -->
          <RateButton
            @click="openReviewModal(movie.id)"
            @mouseover="hover = movie.id"
            @mouseleave="hover = null"
            class="mt-3"
            :class="{ 'bg-secondary-200': hasRated(movie.id) }"
            v-if="!userStore.isAdmin"
            :disabled="hasRated(movie.id)"
          >
            <template #main>
              <div class="flex items-center gap-1">
                <img
                  :src="
                    hover === movie.id || hasRated(movie.id)
                      ? StarFilled
                      : StarOutline
                  "
                  alt="star"
                  class="w-5"
                />
                <span>{{ hasRated(movie.id) ? 'Already Rated' : 'Rate' }}</span>
              </div>
            </template>
          </RateButton>
        </div>
      </template>
    </MovieCard>
  </div>

  <!-- Rating Modal -->
  <RatingModal
    v-if="reviewModal"
    :movie-id="selectedMovieId"
    :showModal="reviewModal"
    @close="closeModal"
  />
</template>

<style scoped>
.movie-image {
  width: 100%;
  height: 300px;
  object-fit: cover;
  object-position: center;
  border-radius: 8px;
  background-color: #f0f0f0;
}
</style>
