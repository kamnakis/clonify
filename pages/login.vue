<template>
  <div class="fixed inset-0 flex flex-col items-center bg-white">
    <div class="flex-grow-0">
      <img src="~/assets/images/clonify_logo.png" alt="logo">
    </div>
    <form
      class="w-full flex-grow login-form bg-gray-1 p-4 py-8 flex flex-col items-center justify-start space-y-4"
      @submit.prevent="login"
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
      <label
        v-if="error"
        class="text-white"
      >
        {{ error }}
      </label>
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

<style lang="scss" scoped>
.input-field {
  max-width: 320px !important;
  @apply text-lg font-medium text-gray-3 bg-white shadow-md p-2 w-full;
}

.input-field::placeholder {
  @apply text-gray-3;
}

.input-field:focus {
  @apply outline-none shadow-none;
}

.submit-button {
  max-width: 320px !important;
  @apply text-lg font-medium text-white bg-gray-3 shadow-md p-2 w-full;
}

.submit-button:focus {
  @apply outline-none;
}

.submit-button:active {
  @apply shadow-none;
}
</style>
