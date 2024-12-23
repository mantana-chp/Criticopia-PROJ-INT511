<script setup>
import { ref, onMounted } from 'vue'
import RateButton from '../partials/RateButton.vue'
import { X } from 'lucide-vue-next'
import { useRoute } from 'vue-router'
import { useMovieStore } from '@/stores/movie'
import router from '@/router'
import { defineEmits } from 'vue'
import { useRateStore } from '@/stores/rate'

const props = defineProps({
  movieId: {
    type: Number,
    required: true
  },
  showModal: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['close'])

const movieStore = useMovieStore()
const rateStore = useRateStore()
const route = useRoute()
const movieTitle = ref('')
const rating = ref(0)

onMounted(async () => {
  const id = route.params.id || props.movieId
  if (id) {
    const movie = await movieStore.getMovieById(id)
    movieTitle.value = movie.title || 'Unknown Movie'
  }
})

const rateMovie = async () => {
  console.log('Rating:', rating.value)
  console.log('Movie ID:', props.movieId)

  await rateStore.rateMovie(rating.value, props.movieId)
  emit('close')
  rating.value = 0

  location.reload()

  router.push({ name: 'home' })
}
</script>

<template>
  <Teleport to="#modal">
    <div
      v-if="showModal"
      class="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center"
    >
      <div
        class="bg-secondary-100 rounded-lg shadow-lg w-11/12 max-w-md p-6 relative flex flex-col items-center"
      >
        <!-- Close Button -->
        <button
          class="absolute top-2 right-2 p-1 hover:bg-secondary-200 rounded-full"
          @click="$emit('close')"
        >
          <X :size="18" :stroke-width="1.75" />
        </button>

        <!-- Modal Content -->
        <img src="/imgs/star-yellow.svg" alt="star" class="w-16" />
        <h2 class="text-xl font-bold text-center mt-2">Rate this Movie</h2>
        <h3 class="text-lg mt-3 text-center">{{ movieTitle }}</h3>
        <div v-show="rating > 0" class="mt-2">
          You selected: {{ `${rating}/10` }} stars
        </div>

        <!-- Star Rating -->
        <div class="flex gap-2 mt-4">
          <label
            v-for="n in 10"
            :key="n"
            class="star-label cursor-pointer"
            :class="{ active: n <= rating }"
          >
            <input
              type="radio"
              name="stars"
              :value="n"
              v-model="rating"
              class="hidden"
            />
            <span class="icon">★</span>
          </label>
        </div>

        <!-- Rate Button -->
        <RateButton class="mt-4" @click="rateMovie" :disabled="rating === 0">
          <template #main>
            <div class="flex items-center gap-1">
              <span>Rate</span>
            </div>
          </template>
        </RateButton>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.star-label .icon {
  font-size: 2rem;
  color: #dcdcdc; /* Gray color for unselected stars */
  transition: color 0.2s ease-in-out;
}

.star-label.active .icon {
  color: #ffc935; /* Yellow color for selected stars */
}
</style>
