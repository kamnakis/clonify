<template>
  <div class="w-full h-full flex relative">
    <div class="absolute inset-0 pt-20 pb-32 text-white overflow-y-auto">
      <!-- Create Playlist Button -->
      <div class="w-full flex items-center justify-end mb-2">
        <v-btn
          plain
          color="white"
          @click.stop="dialog = true"
        >
          <fa-icon icon="plus" class="mr-2" /> Create Playlist
        </v-btn>
      </div>
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
          <!-- Menu button -->
          <div class="flex items-center justify-end text-gray-200 text-opacity-50">
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
                min-width="6rem"
              >
                <v-list-item
                  dense
                  class="flex items-center"
                  @click="setPlaylist(playlist.songs)"
                >
                  Play
                </v-list-item>
                <v-list-item
                  dense
                  class="flex items-center"
                  @click="deletePlaylist(playlist.id)"
                >
                  Delete
                </v-list-item>
              </v-list>
            </v-menu>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="px-6">
          No playlists available
        </div>
      </template>
    </div>
    <v-dialog
      v-model="dialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <div
        class="h-full bg-gray-1 text-white p-4 flex flex-col"
      >
        <div class="headline">
          Create Playlist
        </div>

        <div class="mt-4 flex flex-col items-center space-y-3">
          <v-text-field
            v-model="newPlaylist.title"
            class="flex-grow-0 w-full text-white"
            dark
            label="Name"
          />
          <v-text-field
            v-model="newPlaylist.description"
            class="flex-grow-0 w-full text-white"
            dark
            label="Description"
          />
          <div class="flex-grow-0 flex items-center self-start px-1">
            <v-switch
              v-model="newPlaylist.private"
              dark
              inset
              color="#84DAA5"
            />
            <div class="text-white ml-4">{{ newPlaylist.private ? 'Private' : 'Public' }}</div>
          </div>
        </div>

        <div class="flex-grow-0 flex justify-end">
          <button
            class="text-lg p-2 text-white focus:outline-none"
            text
            @click="dialog = false"
          >
            CANCEL
          </button>
          <button
            class="text-lg p-2 text-green-1 focus:outline-none"
            text
            @click="createPlaylist()"
          >
            CREATE
          </button>
        </div>
      </div>
    </v-dialog>
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
import { defineComponent, onMounted, onUnmounted, reactive, ref, watch } from '@vue/composition-api'
import { Song } from '~/models/Song'

export default defineComponent({
  name: 'Playlists',
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

    const newPlaylist = reactive({
      title: null,
      description: null,
      private: true
    })

    const createPlaylist = async () => {
      try {
        await root.$axios.post('playlists', newPlaylist)
        dialog.value = false
        getPlaylists()
      } catch (err) {
        displayError(err)
      }
    }

    const deletePlaylist = async (playlistId: string) => {
      try {
        await root.$axios.delete(`playlists/${playlistId}`)
        getPlaylists()
      } catch (err) {
        displayError(err)
      }
    }

    const getPlaylists = async () => {
      await root.$axios.get('playlists/me').then((response) => {
        playlists.value = response.data
      })
    }

    onMounted(() => {
      getPlaylists()
    })

    onMounted(() => {
      root.$store.dispatch('global/setPageTitle', 'My Playlists')
    })
    onUnmounted(() => {
      root.$store.dispatch('global/setPageTitle', '')
    })

    watch(dialog, () => {
      newPlaylist.title = null
      newPlaylist.description = null
      newPlaylist.private = true
      alert.value = false
      error.value = ''
    })

    return {
      dialog,
      playlists,
      alert,
      error,
      setPlaylist,
      createPlaylist,
      newPlaylist,
      deletePlaylist
    }
  }
})
</script>
