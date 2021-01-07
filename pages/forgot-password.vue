<template>
  <div class="fixed inset-0 flex flex-col items-center bg-white">
    <div class="flex-grow-0">
      <img src="~/assets/images/clonify_logo.png" alt="logo">
    </div>
    <form
      v-if="!success"
      class="w-full flex-grow bg-gray-1 p-4 py-8 flex flex-col items-center justify-start space-y-4"
      @submit.prevent="forgotPassword()"
    >
      <input
        v-model="formFields.email"
        type="email"
        name="email"
        placeholder="email"
        class="input-field"
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
        Send Email
      </button>
      <nuxt-link
        class="text-white"
        to="/login"
      >
        Login here!
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
import { defineComponent, reactive, ref } from '@vue/composition-api'

export default defineComponent({
  name: 'ForgotPassword',
  middleware: 'guest',
  setup (_, { root }) {
    const formFields = reactive({
      email: ''
    })
    const clientError = ref('')
    const success = ref('')
    const error = ref('')

    const forgotPassword = async () => {
      try {
        await root.$axios.post('auth/forgot-password', formFields)
        error.value = ''
        success.value = 'A reset password link has been sent to your email account. Please click on the link to complete the password reset.'
        // root.$router.push('/')
      } catch (e) {
        error.value = e.response.data.message[0].messages[0].message
      }
    }

    return {
      formFields,
      forgotPassword,
      clientError,
      error,
      success
    }
  }
})
</script>

<style scoped>
.input-field {
  @apply text-lg font-medium text-gray-3 bg-white shadow-md p-2 w-full;
}

.input-field::placeholder {
  @apply text-gray-3;
}

.input-field:focus {
  @apply outline-none shadow-none;
}

.submit-button {
  @apply text-lg font-medium text-white bg-gray-3 shadow-md p-2 w-full;
}

.submit-button:focus {
  @apply outline-none;
}

.submit-button:active {
  @apply shadow-none;
}
</style>
