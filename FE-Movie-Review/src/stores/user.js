import { defineStore } from 'pinia'
import { fetchAuthen } from '@/libs/fetchLibs'
import { jwtDecode } from 'jwt-decode'
import router from '@/router'
import { useToast } from 'vue-toastification'

const toast = useToast()

export const useUserStore = defineStore('user', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null, // Stores user data
    isAuthenticated: false // Tracks login state
  }),
  getters: {
    isLoggedIn: (state) => !!state.user,
    isAdmin: (state) => state.user?.role === 'ADMIN',
    isUser: (state) => state.user?.role === 'USER',
    username: (state) => state.user?.username || 'Guest'
  },
  actions: {
    async login(email, password) {
      const payload = {
        email,
        password
      }
      const response = await fetchAuthen('/users/login', 'POST', payload)
      const data = await response.json()

      localStorage.setItem('token', data.token)
      const jwtToken = localStorage.getItem('token')
      const jwtDecoded = jwtDecode(jwtToken)

      localStorage.setItem('user', JSON.stringify(jwtDecoded))

      this.user = JSON.parse(localStorage.getItem('user'))

      if (response.status === 200) {
        router.push({ name: 'home' })
        toast.success('Login successful')
      }

      return data
    },
    async register(username, email, password, confirmPassword) {
      const payload = {
        username,
        email,
        password,
        confirmPassword
      }

      const response = await fetchAuthen('/users/register', 'POST', payload)
      if (response.status === 201) {
        router.push({ name: 'sign-in' })
        toast.success('Registration successful, please login to continue')
      }
    },
    logout() {
      localStorage.clear()
      this.user = null
      router.push({ name: 'sign-in' })
    },
    async fetchUser() {
      const getUser = localStorage.getItem('user')
      const user = JSON.parse(getUser)
      console.log(user)

      return user
    }
  }
})
