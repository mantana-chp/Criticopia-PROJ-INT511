import AddEditMovie from '@/views/AddEditMovie.vue'
import Home from '@/views/Home.vue'
import ManageMovie from '@/views/ManageMovie.vue'
import MovieDetails from '@/views/MovieDetails.vue'
import SignIn from '@/views/SignIn.vue'
import SignUp from '@/views/SignUp.vue'
import Watchlist from '@/views/Watchlist.vue'
import { createRouter, createWebHistory } from 'vue-router'
import { jwtDecode } from 'jwt-decode'
import { useUserStore } from '@/stores/user'
import RatingModal from '@/components/movies/RatingModal.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { redirect: '/home', path: '/' },
    {
      path: '/home',
      name: 'home',
      component: Home
    },
    {
      path: '/register',
      name: 'sign-up',
      component: SignUp
    },
    {
      path: '/login',
      name: 'sign-in',
      component: SignIn
    },
    {
      path: '/users/:userId/watchlist',
      name: 'watchlist',
      params: 'userId',
      component: Watchlist,
      meta: { requireAuth: true }
    },
    {
      path: '/manage-movie',
      name: 'manage-movie',
      component: ManageMovie,
      meta: { requireAuth: true, requireAdmin: true }
    },
    {
      path: '/add-movie',
      name: 'add-movie',
      component: AddEditMovie,
      meta: { requireAuth: true, requireAdmin: true }
    },
    {
      path: '/movie/:id/edit',
      name: 'edit-movie',
      params: 'id',
      component: AddEditMovie,
      meta: { requireAuth: true, requireAdmin: true }
    },
    {
      path: '/movie/:id',
      params: 'id',
      name: 'movie-details',
      component: MovieDetails
    },
    {
      path: '/movie/:id/rate',
      params: 'id',
      name: 'movie-rates',
      component: RatingModal
    }
  ]
})
router.beforeEach(async (to, from, next) => {
  const token = localStorage.getItem('token')
  const userInfo = localStorage.getItem('user')
  const userStore = useUserStore()

  if (token && (to.name === 'sign-in' || to.name === 'sign-up')) {
    return next({ name: 'home' })
  }

  if (!to.meta.requireAuth && token) {
    const decodedToken = jwtDecode(token)
    userStore.user = decodedToken
  }

  if (to.meta.requireAuth) {
    if (!token) {
      return next({ name: 'sign-in' })
    }

    try {
      const decodedToken = jwtDecode(token)
      userStore.user = decodedToken

      if (decodedToken.exp * 1000 < Date.now()) {
        localStorage.clear()
        return next({ name: 'sign-in' })
      }

      if (to.meta.requireAdmin) {
        const user = JSON.parse(userInfo)

        if (user.role !== 'ADMIN') {
          return next({ name: 'home' })
        }
      }
    } catch (error) {
      console.error('Token validation error:', error)
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      return next({ name: 'sign-in' })
    }
  }

  next()
})

export default router
