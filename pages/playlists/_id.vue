<template>
  <div class="w-full h-full flex relative">
    <!-- Content -->
    <div class="absolute inset-0 flex flex-col pt-20 pb-32 text-white list overflow-y-auto">
      <div class="text-gray-200 text-opacity-50 pl-4">by @{{ playlist && playlist.author.username }}</div>
      <div class="grid grid-cols-8 items-center justify-between space-x-2 cursor-pointer pl-4 pr-4 py-3">
        <div class="col-span-2 w-12 h-12 rounded-full bg-gray-400 overflow-hidden">
          <img
            :src="`https://eu.ui-avatars.com/api/?background=random&color=fff&name=${ playlist && playlist.title }`"
            alt=""
            class="w-full h-full object-cover object-center"
          >
        </div>
        <!-- Show title, green text if playlist is playing -->
        <div
          class="col-span-5 text-gray-200 truncate"
        >
          <span class="text-base font-medium">{{ playlist && playlist.title }}</span><br>
          <span class="text-sm text-opacity-50">{{ playlist && playlist.description }}</span>
        </div>
      </div>
      <!-- Songs List -->
      <template v-if="playlist && playlist.songs.length">
        <div
          v-for="(song, index) in playlist.songs"
          :key="song.id"
          class="w-full flex-grow-0 flex items-center cursor-pointer pl-8 pr-4 py-3"
          :class="{
            'bg-gray-1': isThisSongPlaying(song)
          }"
          @click="setSong(index)"
        >
          <!-- If song is playing show icon -->
          <div
            v-if="isThisSongPlaying(song)"
          >
            <fa-icon icon="volume-up" class="text-green-1 mr-4 slideIn" />
          </div>
          <!-- Show title, green text if song is playing -->
          <div
            class="flex flex-col text-gray-200"
            :class="{
              'text-green-1 slideIn': isThisSongPlaying(song)
            }"
          >
            <span class="text-base font-medium">{{ song.title }}</span>
            <span class="text-sm text-opacity-50">{{ song.artist.first_name }} {{ song.artist.last_name }}</span>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="px-6">
          No songs available
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
import { watch, defineComponent, ref, onMounted } from '@vue/composition-api'
import { Song } from '~/models/Song'

export default defineComponent({
  name: 'Playlist',
  setup (_, { root }) {
    const playlist = ref<any>(null)
    watch(playlist, () => {
      playlist.value && setPlaylist(playlist.value.songs)
    })

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

    watch(() => root.$route.params.id, () => {
      getPlaylist()
    })

    onMounted(() => {
      getPlaylist()
    })

    const getPlaylist = () => {
      root.$axios.get(`playlists/${root.$route.params.id}`).then((response) => {
        playlist.value = response.data
      })
    }

    const isThisSongPlaying = (song: Song) => {
      return song &&
        root.$store.getters['player/currentTrack'] !== null &&
        song.id === (root.$store.getters['player/tracks'] as Song[])[root.$store.getters['player/currentTrack']].id
    }

    const setPlaylist = (tracks: Song[]) => {
      if (tracks.length) {
        root.$store.dispatch('player/setTracks', tracks)
      } else {
        displayError('This playlist is empty! Add some songs to it.')
      }
    }

    const setSong = (index: number) => {
      root.$store.dispatch('player/setCurrentTrack', index)
    }

    return {
      alert,
      error,
      isThisSongPlaying,
      setSong,
      playlist
    }
  }
})
</script>
