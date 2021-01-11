<template>
  <div>
    <v-app>
      <!-- Header -->
      <div
        v-if="!pathsToHidePlayer.includes($nuxt.$route.path)"
        class="fixed left-0 right-0 top-0 my-8 px-6 flex justify-between items-center text-white z-10"
      >
        <!-- Back button -->
        <fa-icon
          icon="chevron-left"
          class="text-xl cursor-pointer text-gray-200 text-opacity-50"
          @click="$nuxt.$router.back()"
        />
        <!-- Page Title -->
        <div>{{ $nuxt.$store.getters['global/pageTitle'] }}</div>
        <!-- 3 dot menu -->
        <v-menu
          offset-y
        >
          <template v-slot:activator="{ on, attrs }">
            <fa-icon
              icon="ellipsis-h"
              class="text-xl cursor-pointer"
              v-bind="attrs"
              v-on="on"
            />
          </template>
          <v-list
            dense
            class="p-0"
            min-width="6rem"
          >
            <v-list-item
              class="flex items-center"
              @click="logout()"
            >
              <fa-icon class="flex-grow-0" :icon="['fas', 'door-open']" />
              <div class="ml-4">
                Logout
              </div>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>

      <!-- Music Player (Checks route support) -->
      <Player
        v-if="!pathsToHidePlayer.includes($nuxt.$route.path)"
      />

      <!-- Page Wrapper -->
      <div class="min-h-screen bg-gray-2 flex">
        <!-- Sidebar -->
        <div
          v-if="$nuxt.$store.state.auth.loggedIn"
          class="w-20 flex-grow bg-gray-3 flex flex-col items-center"
        >
          <div class="w-full flex flex-col justify-center pb-20 space-y-20">
            <NuxtLink to="/explore">
              <div class="tab-link">
                Explore
              </div>
            </NuxtLink>
            <NuxtLink to="/playlists">
              <div class="tab-link">
                Playlists
              </div>
            </NuxtLink>
            <NuxtLink to="/">
              <div class="tab-link">
                Songs
              </div>
            </NuxtLink>
          </div>
        </div>

        <!-- Route Page -->
        <div class="w-full">
          <transition name="home" mode="out-in">
            <Nuxt />
          </transition>
        </div>
      </div>
    </v-app>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api'

export default defineComponent({
  name: 'Layout',
  setup (_, { root }) {
    const pathsToHidePlayer = ref(['/login', '/register', '/forgot-password', '/reset-password'])

    const logout = async () => {
      try {
        await root.$auth.logout()
        // Clear data
        await root.$store.dispatch('player/setTracks', [])
        await root.$store.dispatch('player/setCurrentTrack', null)
        localStorage.clear()
      } catch (error) {
        error.value = error
      }
    }

    return {
      pathsToHidePlayer,
      logout
    }
  }
})
</script>

<style>
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
}

.side-text {
  transform: rotate(-90deg);
}

.tab-link {
  @apply text-gray-200 text-opacity-50 font-medium tracking-wider flex-grow-0 side-text;
}

.nuxt-link-exact-active > .tab-link {
  @apply text-green-1 text-opacity-100;
}

.home-enter-active, .home-leave-active { transition: opacity .5s; }
.home-enter, .home-leave-active { opacity: 0; }
</style>
