<script setup>
import WatchlistMovie from '@/components/movies/WatchlistMovie.vue'
import { useRateStore } from '@/stores/rate'
import { useUserStore } from '@/stores/user'
import { useWatchlistStore } from '@/stores/watchlist'
import { onMounted } from 'vue'

const userStore = useUserStore()
const wathlistStore = useWatchlistStore()
const rateStore = useRateStore()

onMounted(async () => {
  const userId = userStore.user.userId
  await wathlistStore.getWatchlist(userId)
  await rateStore.getRatedMovies()
})
</script>

<template>
  <div class="text-lg flex flex-wrap justify-center">My Watchlist</div>
  <div class="w-full flex flex-wrap justify-center">
    <WatchlistMovie
      :wathlists="wathlistStore.watchlists"
      :userRatings="rateStore.ratedMovies"
    />
  </div>
</template>

<style scoped></style>
