<template>
  <div class="fixed inset-0 flex flex-col items-center bg-white">
    <div class="flex-grow-0">
      <img src="~/assets/images/clonify_logo.png" alt="logo">
    </div>
    <form
      v-if="!success"
      class="w-full flex-grow bg-gray-1 p-4 py-8 flex flex-col items-center justify-start space-y-4"
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
    <div
      v-else
      class="w-full p-4 bg-green-600 bg-opacity-75 text-white font-medium"
    >
      {{ success }}
    </div>
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
    const success = ref('')
    const error = ref('')

    const passwordsMatch = computed(() => {
      const match = registerFields.password === registerFields.passwordRepeat
      if (!match && registerFields.password && registerFields.passwordRepeat) {
        error.value = ''
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
          success.value = 'A confirmation link has been sent to your email account. Please click on the link to complete the registration process.'
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
      success,
      register
    }
  }
})
</script>

<style scoped>
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
