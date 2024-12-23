<script setup>
import BaseCard from '@/components/partials/BaseCard.vue'
import { useUserStore } from '@/stores/user'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'

const toast = useToast()
const router = useRouter()
const props = defineProps({
  formType: String
})

const usernameInput = ref('')
const emailInput = ref('')
const passwordInput = ref('')
const confirmPasswordInput = ref('')

const userStore = useUserStore()

const submitForm = async (username, email, password, confirmPassword) => {
  username = usernameInput.value || ''
  email = emailInput.value
  password = passwordInput.value
  confirmPassword = confirmPasswordInput.value || ''

  if (props.formType === 'Sign In') {
    if (!email || !password) {
      return toast.error('Email and password are required')
    }
    await userStore.login(email, password)
  } else if (props.formType === 'Sign Up') {
    if (!email || !password || !username || !confirmPassword) {
      return toast.error('Please fill in all fields')
    }

    await userStore.register(username, email, password, confirmPassword)
  }
}
</script>

<template>
  <div class="flex justify-center items-center">
    <BaseCard>
      <template #main>
        <div
          class="w-full h-full px-8 flex flex-col justify-between"
          :class="formType === 'Sign Up' ? 'gap-5' : 'gap-8'"
        >
          <div class="text-primary text-4xl font-semibold text-center mb-5">
            {{ formType === 'Sign In' ? 'Sign In' : 'Sign Up' }}
          </div>

          <!-- Form Fields -->
          <div class="space-y-4">
            <!-- Email input -->
            <div class="flex flex-col">
              <label for="email" class="text-gray-700 font-medium mb-1"
                >Email</label
              >
              <input
                v-model.trim="emailInput"
                id="email"
                type="email"
                placeholder="Enter your email"
                class="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>

            <!-- Username input -->
            <div v-if="formType === 'Sign Up'" class="flex flex-col">
              <label for="username" class="text-gray-700 font-medium mb-1"
                >Username</label
              >
              <input
                v-model.trim="usernameInput"
                id="username"
                type="text"
                placeholder="Enter your username"
                class="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>

            <!-- Password input -->
            <div class="flex flex-col">
              <label for="password" class="text-gray-700 font-medium mb-1"
                >Password</label
              >
              <input
                v-model="passwordInput"
                id="password"
                type="password"
                :placeholder="
                  formType === 'Sign In'
                    ? 'Enter your password'
                    : 'Enter your password at least 8 characters'
                "
                minlength="6"
                class="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>

            <!-- Confirm Password input -->
            <div v-if="formType === 'Sign Up'" class="flex flex-col">
              <label
                for="confirm-password"
                class="text-gray-700 font-medium mb-1"
                >Confirm Password</label
              >
              <input
                v-model="confirmPasswordInput"
                id="confirm-password"
                type="password"
                placeholder="Re-enter your password"
                minlength="8"
                class="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>
          </div>

          <!-- Submit Button -->
          <div class="mt-6">
            <button
              @click="
                submitForm(
                  usernameInput,
                  emailInput,
                  passwordInput,
                  confirmPasswordInput
                )
              "
              type="submit"
              class="w-full bg-primary text-white py-2 rounded-md text-lg hover:bg-secondary-100 transition-colors"
            >
              {{ formType === 'Sign In' ? 'Sign In' : 'Create your account' }}
            </button>

            <div class="text-center mt-3">
              <span class="text-gray-700">
                {{
                  formType === 'Sign In'
                    ? "Don't have an account?"
                    : 'Already have an account?'
                }}
              </span>
              <RouterLink
                :to="formType === 'Sign In' ? '/register' : '/login'"
                class="text-primary font-semibold hover:underline ml-2"
              >
                {{ formType === 'Sign In' ? 'Sign Up' : 'Sign In' }}
              </RouterLink>
            </div>
          </div>
        </div>
      </template>
    </BaseCard>
  </div>
</template>

<style scoped>
label {
  color: #0c0c1f;
}

input {
  border: 1px solid #e5e5e5;
  border-radius: 5px;
  padding: 8px;
  width: 100%;
  color: black;
}

.input-container {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
</style>
