<template>
  <div>
    <div class="my-4">
      <img src="~/assets/images/clonify_logo.png" class="animate-bounce" alt="logo">
    </div>
    <form
      class="max-w-sm login-form w-full bg-indigo-600 rounded-xl p-4 flex flex-col items-center justify-center space-y-2"
      @submit.prevent="register()"
    >
      <input
        v-model="registerFields.username"
        type="text"
        name="username"
        placeholder="username"
        class="input-field"
        required
      >
      <input
        v-model="registerFields.email"
        type="email"
        name="email"
        placeholder="email"
        class="input-field"
        required
      >
      <input
        v-model="registerFields.password"
        type="password"
        name="password"
        placeholder="password"
        class="input-field"
        pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
        required
        :class="{
          'border-2 border-red-800': registerFields.password && !registerFields.password.match(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/g)
        }"
      >
      <input
        v-model="registerFields.passwordRepeat"
        type="password"
        name="passwordRepeat"
        placeholder="repeat password"
        class="input-field"
        :class="{
          'border-2 border-red-800': registerFields.passwordRepeat && !passwordsMatch
        }"
        required
      >
      <div
        v-if="error || clientError"
        class="text-white"
      >
        {{ error }}
        {{ clientError }}
      </div>
      <button type="submit" class="submit-button">
        Register
      </button>
      <nuxt-link
        class="text-white"
        to="/login"
      >
        Already have an account? Login here!
      </nuxt-link>
    </form>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref } from '@vue/composition-api'
import { RegisterFields } from '~/models/Auth'

export default defineComponent({
  name: 'Register',
  middleware: 'guest',
  setup (_, { root }) {
    const registerFields = reactive<RegisterFields>({
      username: '',
      email: '',
      password: '',
      passwordRepeat: ''
    })
    const clientError = ref('')
    const error = ref('')

    const passwordsMatch = computed(() => {
      const match = registerFields.password === registerFields.passwordRepeat
      if (!match && registerFields.password && registerFields.passwordRepeat) {
        clientError.value = 'Passowrds don\'t match.'
        return false
      } else {
        clientError.value = ''
        return true
      }
    })

    const register = async () => {
      try {
        if (passwordsMatch.value) {
          root.$axios.setToken(false)
          await root.$axios.post('auth/local/register', registerFields)
          root.$router.push('/')
        }
      } catch (e) {
        error.value = e.response.data.message[0].messages[0].message
      }
    }

    return {
      registerFields,
      passwordsMatch,
      clientError,
      error,
      register
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
