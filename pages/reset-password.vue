<template>
  <div class="fixed inset-0 flex flex-col items-center bg-white">
    <div class="flex-grow-0">
      <img src="~/assets/images/clonify_logo.png" alt="logo">
    </div>
    <form
      v-if="!success"
      class="w-full flex-grow bg-gray-1 p-4 py-8 flex flex-col items-center justify-start space-y-4"
      @submit.prevent="resetPassword()"
    >
      <input
        v-model="formFields.password"
        type="password"
        name="password"
        placeholder="new password"
        class="input-field"
        pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
        required
        :class="{
          'border-2 border-red-800': formFields.password && !formFields.password.match(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/g)
        }"
      >
      <input
        v-model="formFields.passwordRepeat"
        type="password"
        name="passwordRepeat"
        placeholder="repeat new password"
        class="input-field"
        :class="{
          'border-2 border-red-800': formFields.passwordRepeat && !passwordsMatch
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
        Reset Password
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
      <nuxt-link to="/login">Login</nuxt-link>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, reactive, ref } from '@vue/composition-api'

export default defineComponent({
  name: 'ResetPassword',
  middleware: 'guest',
  setup (_, { root }) {
    const formFields = reactive({
      password: '',
      passwordRepeat: ''
    })
    const clientError = ref('')
    const success = ref('')
    const error = ref('')

    const code = ref('')

    onMounted(() => {
      if (!root.$route.query.code) {
        root.$router.push('/forgot-password')
      } else {
        code.value = root.$route.query.code as string
      }
    })

    const passwordsMatch = computed(() => {
      const match = formFields.password === formFields.passwordRepeat
      if (!match && formFields.password && formFields.passwordRepeat) {
        clientError.value = 'Passowrds don\'t match.'
        return false
      } else {
        clientError.value = ''
        return true
      }
    })

    const resetPassword = async () => {
      try {
        if (passwordsMatch.value) {
          root.$axios.setToken(false)
          await root.$axios.post('auth/reset-password', {
            code: code.value,
            password: formFields.password,
            passwordConfirmation: formFields.passwordRepeat
          })
          success.value = 'Password updated successfully. You can now use it to log in to your account.'
        }
      } catch (e) {
        error.value = e.response.data.message[0].messages[0].message
      }
    }

    return {
      formFields,
      passwordsMatch,
      resetPassword,
      clientError,
      error,
      success
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
