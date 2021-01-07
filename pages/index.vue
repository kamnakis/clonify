<template>
  <div class="w-full h-full flex relative">
    <!-- Content -->
    <div class="absolute inset-0 flex flex-col pt-20 pb-32 text-white list overflow-y-auto">
      <!-- Songs List -->
      <template v-if="filteredSongs.length">
        <div
          v-for="song in filteredSongs"
          :key="song.id"
          class="w-full flex-grow-0 flex items-center cursor-pointer pl-8 pr-4 py-3"
          :class="{
            'bg-gray-1': isThisSongPlaying(song)
          }"
          @click="setSong(song)"
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
          <!-- Menu button -->
          <div class=" text-gray-200 text-opacity-50">
            <v-menu
              offset-y
              :close-on-content-click="true"
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
                min-width="6rem"
              >
                <v-dialog
                  v-model="playlistSelectDialog"
                  dark
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-list-item
                      dense
                      class="flex items-center"
                      v-bind="attrs"
                      v-on="on"
                    >
                      Add to Playlist
                    </v-list-item>
                  </template>

                  <v-card>
                    <v-card-title class="headline">
                      Select a Playlist
                    </v-card-title>
                    <v-select
                      v-model="playlist"
                      :items="playlists"
                      item-text="title"
                      item-value="id"
                      label="Playlist"
                      dense
                      solo
                      class="mt-4"
                    />
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn
                        color="white"
                        text
                        @click="playlistSelectDialog = false"
                      >
                        Cancel
                      </v-btn>
                      <v-btn
                        color="green darken-1"
                        text
                        @click="addSongToPlaylist(song)"
                      >
                        Add
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-list>
            </v-menu>
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
import { computed, defineComponent, onMounted, onUnmounted, ref, watch } from '@vue/composition-api'
import { Song } from '~/models/Song'

export default defineComponent({
  name: 'Songs',
  middleware: 'auth',
  setup (_, { root }) {
    const filter = ref('')
    const songs = ref<Song[]>([])

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

    onMounted(() => {
      root.$axios.get<Song[]>('songs').then((response) => {
        songs.value = response.data
      })
    })

    const filteredSongs = computed(() => {
      const needle = filter.value.toLowerCase()
      return songs.value.filter((song: Song) => {
        return song.title.toLowerCase().includes(needle) ||
        song.artist.first_name.toLowerCase().includes(needle) ||
        song.artist.last_name.toLowerCase().includes(needle)
      })
    })

    const isThisSongPlaying = (song: Song) => {
      return song &&
        root.$store.getters['player/tracks'].length &&
        root.$store.getters['player/currentTrack'] !== null &&
        song.id === (root.$store.getters['player/tracks'] as Song[])[root.$store.getters['player/currentTrack']].id
    }

    const setSong = (song: Song) => {
      root.$store.dispatch('player/setTracks', [song])
    }

    onMounted(() => {
      root.$store.dispatch('global/setPageTitle', 'Songs')
    })
    onUnmounted(() => {
      root.$store.dispatch('global/setPageTitle', '')
    })

    const playlistSelectDialog = ref(false)
    const playlists = ref<any[]>([])
    const playlist = ref<any>(null)
    const getPlaylists = async () => {
      await root.$axios.get('playlists/me').then((response) => {
        playlists.value = response.data
        playlist.value = playlists.value[0].id || null
      })
    }
    watch(playlistSelectDialog, () => {
      if (playlistSelectDialog.value) {
        getPlaylists()
      }
    })
    const addSongToPlaylist = async (song: Song) => {
      if (song && playlist.value) {
        try {
          await root.$axios.put(`playlists/${playlist.value}/${song.id}`)
          playlistSelectDialog.value = false
        } catch (err) {
          displayError(err)
        }
      }
    }

    return {
      alert,
      error,
      filter,
      filteredSongs,
      isThisSongPlaying,
      setSong,
      playlistSelectDialog,
      playlists,
      playlist,
      addSongToPlaylist
    }
  }
})
</script>

<style>
.search-input {
  @apply rounded-lg;
  @apply p-2;
  @apply text-xl;
  @apply text-white;
  @apply bg-gray-700;
  @apply bg-opacity-50;
}

.search-input:focus {
  @apply outline-none;
  @apply bg-opacity-100;
}

.list::-webkit-scrollbar {
  display: none;
}

.list {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.slideIn {
  opacity: 0;
  animation: slide-in 300ms ease-in forwards;
}

@keyframes slide-in {
  from {
    opacity: 0;
    transform: translateX(-2rem);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>
