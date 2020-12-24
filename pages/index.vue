<template>
  <div>
    <!-- Search Songs -->
    <input
      v-model="filter"
      type="text"
      class="search-input w-full duration-200 transition-colors mt-6"
      placeholder="Search..."
    >
    <!-- Songs List -->
    <div class="absolute inset-0 my-24 mx-4 overflow-y-auto flex flex-col space-y-3 bg-gray-700 text-white rounded-md px-4 py-2">
      <template v-if="filteredSongs.length">
        <div
          v-for="song in filteredSongs"
          :key="song.id"
          class="flex items-center"
        >
          <fa-icon
            icon="play-circle"
            class="text-3xl mr-6 cursor-pointer transition-colors duration-200 hover:text-green-500"
            @click="setSong(song)"
          />
          <div class="flex flex-col">
            <span class="text-lg font-medium">{{ song.title }}</span>
            <span class="text-md">by {{ song.artist.first_name }} {{ song.artist.last_name }}</span>
          </div>
        </div>
      </template>
      <template v-else>
        No songs available
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from '@vue/composition-api'
import { Song } from '~/models/Song'

export default defineComponent({
  name: 'Home',
  middleware: 'auth',
  setup (_, { root }) {
    const filter = ref('')
    const songs = ref<Song[]>([])

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

    const setSong = (song: Song) => {
      root.$store.dispatch('player/setCurrentTrack', song)
    }

    return {
      filter,
      filteredSongs,
      setSong
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
</style>
