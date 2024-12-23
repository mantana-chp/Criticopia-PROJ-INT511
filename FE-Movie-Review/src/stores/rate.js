import { defineStore } from 'pinia'
import { fetchWithAuth, fetchGetWithToken } from '@/libs/fetchLibs'

export const useRateStore = defineStore('rate', {
  state: () => ({ ratedMovies: [] }),
  actions: {
    async rateMovie(rateScore, movieId) {
      const id = movieId
      const rate = {
        rateScore: rateScore
      }
      const response = await fetchWithAuth(`/movies/${id}/rates`, 'POST', rate)
      this.ratedMovies = await response.json()
      console.log(this.ratedMovies)
    },
    async getRatedMovies() {
      const response = await fetchGetWithToken('/rates', 'GET')
      const data = await response.json()
      this.ratedMovies = data
      return data
    }
  }
})
