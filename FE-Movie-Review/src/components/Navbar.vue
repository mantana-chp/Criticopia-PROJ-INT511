<script setup>
import { Album } from 'lucide-vue-next'
import Searchbar from './Searchbar.vue'
import { Clapperboard } from 'lucide-vue-next'
import { LogOut } from 'lucide-vue-next'
import { CircleUserRound } from 'lucide-vue-next'
import { useUserStore } from '@/stores/user'
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const userStore = useUserStore()
const route = useRoute()
const isAuthRoute = computed(() => ['/login', '/register'].includes(route.path))

// Determine if the current route is the home route
const isHomePage = computed(() => route.name === 'home')
</script>

<template>
  <div class="flex justify-between items-center px-5 py-4">
    <div class="flex items-center gap-4">
      <div
        class="text-errorMsg-200 capitalize text-4xl tracking-wide font-logo"
      >
        <RouterLink :to="{ name: 'home' }"
          >C<span class="text-3xl">riticopia</span></RouterLink
        >
      </div>
      <RouterLink :to="{ name: 'home' }" v-show="!isAuthRoute">
        <div class="nav-button">Home</div></RouterLink
      >
    </div>

    <!-- Search bar -->
    <div v-show="isHomePage" class="w-1/3">
      <Searchbar />
    </div>

    <div class="flex items-center gap-1">
      <!-- Admin Link -->
      <RouterLink v-if="userStore.isAdmin" :to="{ name: 'manage-movie' }">
        <div class="nav-button flex gap-1 items-center">
          <Clapperboard :stroke-width="1.5" /> Manage Movies
        </div>
      </RouterLink>

      <!-- Watchlist -->
      <RouterLink
        v-if="userStore.isLoggedIn && userStore.isUser"
        :to="{ name: 'watchlist', params: { userId: userStore.user.userId } }"
      >
        <div class="nav-button flex gap-1 items-center">
          <Album :size="20" :stroke-width="1.75" /> Watchlist
        </div>
      </RouterLink>

      <RouterLink :to="{ name: 'sign-in' }"
        ><div
          class="nav-button bg-secondary-200 transition-colors"
          v-if="!userStore.isLoggedIn"
        >
          <span>Sign In</span>
        </div></RouterLink
      >
      <div class="flex items-center gap-2" v-if="userStore.isLoggedIn">
        <div class="flex gap-1 px-6 py-1 bg-secondary-200 rounded-full">
          <CircleUserRound :stroke-width="1.5" />
          {{ userStore.user?.username || 'Guest' }}
        </div>
        <div
          @click="userStore.logout()"
          class="rounded-full hover:bg-secondary-200 transition-colors"
        >
          <button><LogOut :stroke-width="1.5" /></button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.nav-button {
  border-radius: 9999px;
  padding-left: 1.25rem;
  padding-right: 1.25rem;
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
}
.nav-button:hover {
  cursor: pointer;
  background-color: #3c3c65;
  text-align: center;
}
</style>
