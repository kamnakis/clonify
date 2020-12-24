<template>
  <div>
    <fa-icon
      v-if="$nuxt.$store.getters['isAuthenticated']"
      class="absolute top-0 right-0 m-4 text-white cursor-pointer"
      icon="sign-out-alt"
      @click="logout()"
    />
    <div class="app p-4">
      <Nuxt />
    </div>
    <Player
      v-if="!pathsToHidePlayer.includes($nuxt.$route.path)"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api'
import Player from '@/components/Player.vue'

export default defineComponent({
  name: 'Layout',
  components: {
    Player
  },
  setup (_, { root }) {
    const pathsToHidePlayer = ref(['/login', '/register', '/forgot-password'])

    const logout = async () => {
      await root.$auth.logout()
      root.$router.push('/login')
    }

    return {
      pathsToHidePlayer,
      logout
    }
  }
})
</script>

<style>
html {
  font-family:
    'Source Sans Pro',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    'Helvetica Neue',
    Arial,
    sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
}

.app {
  background-image: url("../assets/images/Confetti-Doodles.svg");
  @apply min-h-screen;
  @apply bg-contain;
}
</style>
