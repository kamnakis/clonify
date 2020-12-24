<template>
  <div>
    <div class="my-4">
      <img src="~/assets/images/clonify_logo.png" class="animate-bounce" alt="logo">
    </div>
    <form
      class="max-w-sm login-form w-full bg-gray-700 rounded-xl p-4 flex flex-col items-center justify-center space-y-2"
      @submit.prevent="login()"
    >
      <input
        v-model="loginFields.identifier"
        type="text"
        name="identifier"
        placeholder="email or username"
        class="input-field"
        required
      >
      <input
        v-model="loginFields.password"
        type="password"
        name="password"
        placeholder="password"
        class="input-field"
        required
      >
      <div
        v-if="error"
        class="text-white"
      >
        {{ error }}
      </div>
      <button type="submit" class="submit-button">
        Login
      </button>
      <nuxt-link
        class="text-white"
        to="/forgot-password"
      >
        Forgot your password?
      </nuxt-link>
      <nuxt-link
        class="text-white"
        to="/register"
      >
        Don't have an account? Register
      </nuxt-link>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from '@vue/composition-api'
import { LoginFields } from '~/models/Auth'

export default defineComponent({
  name: 'Login',
  middleware: 'guest',
  setup (_, { root }) {
    const loginFields = reactive<LoginFields>({
      identifier: '',
      password: ''
    })
    const error = ref('')

    const login = async () => {
      try {
        await root.$auth.loginWith('local', {
          data: loginFields
        })
        root.$router.push('/')
      } catch (e) {
        error.value = e.response.data.message[0].messages[0].message
      }
    }

    return {
      loginFields,
      login,
      error
    }
  }
})
</script>

<style>
.input-field {
  @apply text-lg;
  @apply font-medium;
  @apply text-white;
  @apply bg-gray-400;
  @apply bg-opacity-50;
  @apply rounded-lg;
  @apply shadow-md;
  @apply p-2;
  @apply w-full;
}

.input-field::placeholder {
  @apply text-white;
}

.input-field:focus {
  @apply outline-none;
  @apply shadow-none;
}

.submit-button {
  @apply text-lg;
  @apply font-medium;
  @apply text-white;
  @apply bg-green-500;
  @apply rounded-lg;
  @apply shadow-md;
  @apply p-2;
  @apply w-full;
}

.submit-button:focus {
  @apply outline-none;
}

.submit-button:active {
  @apply shadow-none;
}
</style>
