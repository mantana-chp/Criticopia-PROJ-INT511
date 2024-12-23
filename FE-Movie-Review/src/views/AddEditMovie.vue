<script setup>
import { useMovieStore } from '@/stores/movie'
import { computed, ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// Input references
const titleInput = ref('')
const primaryImageInput = ref('')
const descriptionInput = ref('')
const castsInput = ref('')
const releaseDateInput = ref('')
const runtimeMinutesInput = ref(0)
const avgRatingInput = ref(0)
const typeInput = ref('movie')

// Store and initial state
const movieStore = useMovieStore()
const isEditMode = computed(() => Boolean(route.params.id)) // Checks if ID is present in route params
console.log('isEditMode:', isEditMode.value)

const movie = ref({})
const initialMovie = ref({
  title: '',
  primaryImage: '',
  description: '',
  cast: '',
  release_date: '',
  runtimeMinutes: 0,
  avg_rating: 0,
  type: 'movie'
})

// Fetch movie details for edit mode
const getMovieDetails = async (id) => {
  movie.value = await movieStore.getMovieById(id)

  initialMovie.value = { ...movie.value }

  titleInput.value = movie.value.title
  primaryImageInput.value = movie.value.primaryImage
  descriptionInput.value = movie.value.description
  castsInput.value = movie.value.cast
  releaseDateInput.value = movie.value.releaseDate
    ? new Date(movie.value.releaseDate).toISOString().split('T')[0]
    : ''
  runtimeMinutesInput.value = movie.value.runtimeMinutes
  avgRatingInput.value = movie.value.avgRating
  typeInput.value = movie.value.type
}

// Add or update movie
const addOrUpdateMovie = async () => {
  const payload = {
    title: titleInput.value,
    primaryImage: primaryImageInput.value,
    description: descriptionInput.value,
    cast: castsInput.value,
    release_date: new Date(releaseDateInput.value).toISOString().split('T')[0],
    avg_rating: avgRatingInput.value,
    runtimeMinutes: runtimeMinutesInput.value,
    type: typeInput.value
  }

  if (isEditMode.value) {
    await movieStore.editMovie(movie.value.id, payload)
    router.push({ name: 'movie-details', params: { id: movie.value.id } })
  } else {
    await movieStore.addMovie(payload)
    router.push({ name: 'manage-movie' })
  }
}

// Validation logic
const isFormValid = ref(false)
const isFormEdited = ref(false)

const validateForm = () => {
  const hasValidFields =
    titleInput.value.trim() &&
    primaryImageInput.value.trim() &&
    descriptionInput.value.trim() &&
    castsInput.value.trim() &&
    releaseDateInput.value &&
    runtimeMinutesInput.value > 0 &&
    typeInput.value.trim()

  const isFormModified =
    titleInput.value !== movie.value.title ||
    primaryImageInput.value !== movie.value.primaryImage ||
    descriptionInput.value !== movie.value.description ||
    castsInput.value !== movie.value.cast ||
    releaseDateInput.value !== movie.value.releaseDate ||
    runtimeMinutesInput.value !== movie.value.runtimeMinutes ||
    avgRatingInput.value !== movie.value.avg_rating ||
    typeInput.value !== movie.value.type

  console.log('isFormModified:', isFormModified)

  isFormValid.value = hasValidFields
  console.log('isFormValid:', isFormValid.value)

  isFormEdited.value = isFormModified
  console.log('isFormEdited:', isFormEdited.value)
}

// Watch the form fields for changes
watch(
  [
    titleInput,
    primaryImageInput,
    descriptionInput,
    castsInput,
    releaseDateInput,
    runtimeMinutesInput,
    avgRatingInput,
    typeInput
  ],
  validateForm,

  { immediate: true }
)

watch(isFormValid, (newValue) => {
  console.log('isFormValid:', newValue) // Logs whenever isFormValid changes
  console.log('isEditMode:', isEditMode.value) // Logs whenever isEditMode changes;
})

// Fetch movie details on mount for edit mode
onMounted(() => {
  if (isEditMode.value) {
    getMovieDetails(route.params.id)
  }
})
</script>
<template>
  <section class="max-w-3xl mx-auto p-4">
    <h2 class="text-xl mb-4 text-center">
      {{ isEditMode ? 'Edit' : 'Add New' }} Movie
    </h2>
    <div class="flex flex-col gap-4">
      <!-- Title -->
      <div>
        <label for="title" class="block font-medium">Title</label>
        <input
          type="text"
          id="title"
          v-model.trim="titleInput"
          class="w-full border rounded px-2 py-1"
          placeholder="Enter movie title"
          required
        />
      </div>

      <!-- Primary Image -->
      <div>
        <label for="primaryImage" class="block font-medium"
          >Primary Image</label
        >
        <input
          type="url"
          id="primaryImage"
          v-model.trim="primaryImageInput"
          class="w-full border rounded px-2 py-1"
          placeholder="Enter image URL"
          required
        />
      </div>

      <!-- Description -->
      <div>
        <label for="description" class="block font-medium">Description</label>
        <textarea
          id="description"
          v-model.trim="descriptionInput"
          class="w-full border rounded px-2 py-1"
          placeholder="Enter movie description"
          rows="3"
          maxlength="300"
          required
        ></textarea>
      </div>

      <!-- Cast -->
      <div>
        <label for="cast" class="block font-medium">Cast</label>
        <input
          type="text"
          id="cast"
          v-model.trim="castsInput"
          class="w-full border rounded px-2 py-1"
          placeholder="Enter casts separated by comma (,) "
          required
        />
      </div>

      <!-- Release Date -->
      <div>
        <label for="releaseDate" class="block font-medium">Release Date</label>
        <input
          type="date"
          id="releaseDate"
          v-model="releaseDateInput"
          class="w-full border rounded px-2 py-1"
          required
        />
      </div>

      <!-- Runtime Minutes -->
      <div>
        <label for="runtimeMinutes" class="block font-medium">
          Runtime (Minutes)
        </label>
        <input
          type="number"
          id="runtimeMinutes"
          min="1"
          v-model="runtimeMinutesInput"
          class="w-full border rounded px-2 py-1"
          placeholder="Enter runtime in minutes"
          required
        />
      </div>

      <!-- Average Rating -->
      <div>
        <label for="averageRating" class="block font-medium"
          >Average Rating</label
        >
        <input
          :disabled="isEditMode"
          type="number"
          step="0.1"
          min="0"
          max="10"
          id="averageRating"
          v-model="avgRatingInput"
          class="w-full border rounded px-2 py-1"
          placeholder="Enter average rating"
        />
      </div>

      <!-- Type -->
      <div>
        <label for="type" class="block font-medium">Type</label>
        <select
          id="type"
          v-model="typeInput"
          class="w-full border rounded px-2 py-1"
          required
        >
          <option value="Movie">Movie</option>
          <option value="TV Show">TV Show</option>
        </select>
      </div>
    </div>

    <!-- Submit Button -->
    <button
      @click="addOrUpdateMovie"
      type="submit"
      class="bg-secondary-100 text-white px-4 py-2 rounded hover:bg-secondary-200 transition-colors mt-4 justify-end flex"
      :disabled="!isFormEdited || !isFormValid"
    >
      {{ isEditMode ? 'Update Movie' : 'Add Movie' }}
    </button>
  </section>
</template>

<style scoped>
input,
textarea,
select,
option {
  color: black;
}
</style>
