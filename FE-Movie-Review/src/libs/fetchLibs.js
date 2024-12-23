import router from '@/router'
import { useMovieStore } from '@/stores/movie'
import { useUserStore } from '@/stores/user'
import { useToast } from 'vue-toastification'

const BASE_URL = import.meta.env.VITE_BASE_URL
const toast = useToast()

const goBack = () => {
  router.go(-1)
}

const handleApiErrors = (status, errorData) => {
  const userStore = useUserStore()
  const movieStore = useMovieStore()

  switch (status) {
    case 401:
      toast.error('Unauthorized! Logging out')
      console.log('Unauthorized! Logging out...')
      userStore.logout()
      break

    case 403:
      toast.error('Forbidden! Insufficient permissions.')
      console.warn('Forbidden! Insufficient permissions.')
      break

    case 404:
      toast.error('Resource not found!')
      console.warn('Resource not found!')
      movieStore.getAllMovies()
      goBack()
      break

    case 409:
      toast.error('Conflict! Resource already exists.')
      console.warn('Resource conflict detected!')
      break

    case 500:
      toast.error('Server error! Please try again later.')
      console.error('Server error! Please try again later.')
      break

    default:
      toast.error(errorData.message || 'An unexpected error occurred.')
      console.error('Unexpected Error:', errorData.message)
      break
  }
}

export const fetchGet = async (url, method) => {
  const token = localStorage.getItem('token')

  const response = await fetch(`${BASE_URL}${url}`, {
    method: method,
    'Content-Type': 'application/json',
    headers: token ? { Authorization: localStorage.getItem('token') } : {}
  })

  if (!response.ok) {
    const errorData = await response.json()
    handleApiErrors(response.status, errorData)
    throw new Error(
      errorData.message || `Request failed with status ${response.status}`
    )
  }

  return response
}

export const fetchGetWithToken = async (url, method) => {
  const response = await fetch(`${BASE_URL}${url}`, {
    method: method,
    'Content-Type': 'application/json',
    headers: new Headers({
      Authorization: `Bearer ${localStorage.getItem('token')}`
    })
  })

  if (!response.ok) {
    const errorData = await response.json()
    handleApiErrors(response.status, errorData)
    throw new Error(
      errorData.message || `Request failed with status ${response.status}`
    )
  }

  return response
}

export const fetchNoAuth = async (url, method, body) => {
  const response = await fetch(`${BASE_URL}${url}`, {
    method: method,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ ...body }) || null
  })

  if (!response.ok) {
    const errorData = await response.json()
    handleApiErrors(response.status, errorData)
    throw new Error(
      errorData.message || `Request failed with status ${response.status}`
    )
  }

  return response
}

export const fetchAuthen = async (url, method, body) => {
  const response = await fetch(`${BASE_URL}${url}`, {
    method: method,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ ...body }) || null
  })

  if (response.status !== 200) {
    const errorData = await response.json()
    switch (response.status) {
      case 400:
        toast.error('Invalid input, please try again.')
        console.warn('Bad request! Please check your input.')
        break

      case 401:
        toast.error('Username or password is incorrect')
        console.log('Unauthorized! Logging out...')
        break

      default:
        toast.error(errorData.message || 'An unexpected error occurred.')
        console.error('Unexpected Error:', errorData.message)
        break
    }
  }

  return response
}

export const fetchWithAuth = async (url, method, body) => {
  const response = await fetch(`${BASE_URL}${url}`, {
    method: method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify(body) || null
  })

  if (!response.ok) {
    const errorData = await response.json()
    handleApiErrors(response.status, errorData)
    throw new Error(
      errorData.message || `Request failed with status ${response.status}`
    )
  }

  return response
}

export const fetchMovieSearch = async (url, method) => {
  const token = localStorage.getItem('token')

  const response = await fetch(`${BASE_URL}${url}`, {
    method: method,
    'Content-Type': 'application/json',
    headers: token ? { Authorization: localStorage.getItem('token') } : {}
  })

  const userStore = useUserStore()
  if (response.status !== 200) {
    const errorData = await response.json()

    switch (response.status) {
      case 404:
        toast.error('Resource not found!')
        console.warn('Resource not found!')
        await useMovieStore().getAllMovies()
        router.push({ name: 'home' })
        break

      case 500:
        toast.error('Server error! Please try again later.')
        console.error('Server error! Please try again later.')
        break

      default:
        toast.error('An unexpected error occurred:', errorData.message)
        console.error('An unexpected error occurred:', errorData.message)
        break
    }

    throw new Error(
      errorData.message || `Request failed with status ${response.status}`
    )
  }

  return response
}
