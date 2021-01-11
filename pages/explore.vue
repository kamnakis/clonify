<template>
  <div class="w-full h-full flex relative">
    <div class="absolute inset-0 pt-20 pb-32 text-white overflow-y-auto">
      <!-- Playlists List -->
      <template v-if="playlists.length">
        <div
          v-for="playlist in playlists"
          :key="playlist.id"
          class="grid grid-cols-8 items-center justify-between space-x-2 cursor-pointer pl-4 pr-4 py-3"
          @click="$nuxt.$router.push(`/playlists/${playlist.id}`)"
        >
          <div class="col-span-2 w-12 h-12 rounded-full bg-gray-400 overflow-hidden">
            <img
              :src="`https://eu.ui-avatars.com/api/?background=random&color=fff&name=${ playlist.title }`"
              alt=""
              class="w-full h-full object-cover object-center"
            >
          </div>
          <!-- Show title, green text if playlist is playing -->
          <div
            class="col-span-5 text-gray-200 truncate"
          >
            <span class="text-base font-medium">{{ playlist.title }}</span><br>
            <span class="text-sm text-opacity-50">{{ playlist.description }}</span>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="px-6">
          No playlists available
        </div>
      </template>
    </div>
    <v-snackbar
      v-model="alert"
      :timeout="2000"
    >
      {{ error }}

      <template v-slot:action="{ attrs }">
        <v-btn
          color="green"
          text
          v-bind="attrs"
          @click="alert = false;"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted, ref, watch } from '@vue/composition-api'
import { Song } from '~/models/Song'

export default defineComponent({
  name: 'Playlists',
  middleware: 'auth',
  setup (_, { root }) {
    const dialog = ref(false)
    const playlists = ref([])

    const alert = ref(false)
    const error = ref('')
    const displayError = (msg: string) => {
      alert.value = true
      error.value = msg
    }
    watch(alert, () => {
      if (!alert.value) {
        error.value = ''
      }
    })

    const setPlaylist = (tracks: Song[]) => {
      if (tracks.length) {
        root.$store.dispatch('player/setTracks', tracks)
      } else {
        displayError('This playlist is empty! Add some songs to it.')
      }
    }

    const getPlaylists = async () => {
      await root.$axios.get('playlists/public').then((response) => {
        playlists.value = response.data
      })
    }

    onMounted(() => {
      getPlaylists()
    })

    onMounted(() => {
      root.$store.dispatch('global/setPageTitle', 'Public Playlists')
    })
    onUnmounted(() => {
      root.$store.dispatch('global/setPageTitle', '')
    })

    return {
      dialog,
      playlists,
      alert,
      error,
      setPlaylist
    }
  }
})
</script>
