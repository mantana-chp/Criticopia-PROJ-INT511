import { defineStore } from 'pinia'
import { fetchWithAuth } from '@/libs/fetchLibs'
import { useUserStore } from './user'
import { useToast } from 'vue-toastification'
const toast = useToast()

export const useWatchlistStore = defineStore('watchlist', {
  state: () => ({ watchlists: [] }),
  actions: {
    async getWatchlist(id) {
      const response = await fetchWithAuth(`/users/${id}/watchlists`, 'GET')
      this.watchlists = await response.json()
    },
    async addToWatchlist(id, movieId) {
      id = useUserStore().user.userId
      await fetchWithAuth(`/users/${id}/watchlists`, 'POST', {
        movieId: movieId
      })
      toast.success('Movie added to watchlist!')
    },
    async removeFromWatchlist(userId, movieId) {
      await fetchWithAuth(`/users/${userId}/watchlists/${movieId}`, 'DELETE')
      toast.success('Movie removed from watchlist!')
    },
    isInWatchlist(movieId) {
      return this.watchlists.some((watchlist) => watchlist.movie.id === movieId)
    }
  }
})
