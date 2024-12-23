import { defineStore } from 'pinia'
import { fetchMovieSearch, fetchWithAuth, fetchGet } from '@/libs/fetchLibs'
import { useToast } from 'vue-toastification'
const toast = useToast()
export const useMovieStore = defineStore('movie', {
  state: () => ({ movies: [] }),
  actions: {
    async getAllMovies() {
      const response = await fetchGet('/movies', 'GET')
      this.movies = await response.json()
    },
    async getMovieById(id) {
      const response = await fetchGet(`/movies/${id}`, 'GET')
      const data = await response.json()
      return data
    },
    async addMovie(payload) {
      await fetchWithAuth('/movies', 'POST', payload)
      toast.success('Movie created successfully!')
    },
    async editMovie(id, payload) {
      const response = await fetchWithAuth(`/movies/${id}`, 'PUT', payload)
      const data = await response.json()
      return data
    },
    async deleteMovie(id) {
      await fetchWithAuth(`/movies/${id}`, 'DELETE')
      toast.success('Movie deleted successfully!')
    },
    async searchMovie(query) {
      const response = await fetchMovieSearch(
        `/movies/search?q=${encodeURIComponent(query)}`,
        'GET'
      )
      this.movies = await response.json()
    }
  }
})
