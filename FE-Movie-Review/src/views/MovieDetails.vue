<script setup>
import { useMovieStore } from '@/stores/movie'
import { useUserStore } from '@/stores/user'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const movieStore = useMovieStore()
const userStore = useUserStore()

const route = useRoute()
const router = useRouter()

const paramsId = ref(route.params.id)

const movie = ref({})

const getMovieById = async (id) => {
  id = paramsId.value
  movie.value = await movieStore.getMovieById(id)
}

if (route.params.id) {
  getMovieById()
}

const showConfirmation = ref(false)

const confirmDelete = () => {
  showConfirmation.value = true
}

const cancelDelete = () => {
  showConfirmation.value = false
}

const deleteMovie = async (id) => {
  await movieStore.deleteMovie(id)
  router.push({ name: 'manage-movie' })
  showConfirmation.value = false
}
</script>

<template>
  <div class="flex justify-center items-center flex-col pt-8">
    <div class="flex items-center gap-20">
      <img :src="movie.primaryImage" alt="cover" class="w-52" />
      <div class="flex flex-col">
        <div class="gap-2 flex flex-col">
          <div class="text-xl font-semibold">{{ movie.title }}</div>
          <div class="text-sm text-gray-500">
            <span class="sub-header">Duration</span>
            {{ movie.runtimeMinutes }} minutes
          </div>
          <div class="text-sm text-gray-500 flex gap-1 items-center">
            <img src="/imgs/star-yellow.svg" alt="star" />
            {{ movie.avgRating }} / 10
          </div>
        </div>
        <button
          class="bg-secondary-200 hover:bg-secondary-100 transition-colors px-3 py-1 rounded-full justify-center mt-3 text-center"
          v-if="!userStore.isAdmin"
        >
          + Add to Watchlist
        </button>
        <!-- Edit button (only visible for admins) -->
        <button
          v-if="userStore.isAdmin"
          class="bg-secondary-200 hover:bg-secondary-100 text-white transition-colors px-3 py-1 rounded-full mt-3 text-center"
        >
          <RouterLink :to="{ name: 'edit-movie', params: { id: movie.id } }">
            Edit Movie
          </RouterLink>
        </button>

        <!-- Delete button (only visible for admins) -->
        <button
          v-if="userStore.isAdmin"
          @click="confirmDelete"
          class="bg-red-500 hover:bg-red-400 text-white transition-colors px-3 py-1 rounded-full mt-3 text-center"
        >
          Delete Movie
        </button>
      </div>
    </div>

    <div class="pt-10 flex flex-col gap-3 text-gray-400 w-2/3">
      <div>
        <span class="sub-header">Description</span> {{ movie.description }}
      </div>
      <div>
        <span class="sub-header"> Release Date</span>
        {{ new Date(movie.releaseDate) }}
      </div>
      <div>
        <span class="sub-header">Casts</span>
        {{ movie.cast }}
      </div>
      <div>
        <span class="sub-header">Type</span>
        {{ movie.type }}
      </div>
    </div>

    <!-- Confirmation Modal -->
    <div
      v-if="showConfirmation"
      class="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50 z-50"
    >
      <div class="bg-secondary-200 p-6 rounded-md shadow-lg">
        <div class="text-lg mb-4">
          Are you sure you want to delete this movie?
        </div>
        <div class="flex gap-4 justify-end">
          <button
            @click="deleteMovie(movie.id)"
            class="bg-red-500 hover:bg-red-400 text-white px-4 py-2 rounded-md"
          >
            Yes, Delete
          </button>
          <button
            @click="cancelDelete"
            class="bg-gray-400 hover:bg-gray-300 px-4 py-2 rounded-md"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sub-header {
  font-weight: 500;
  color: white;
}
</style>
