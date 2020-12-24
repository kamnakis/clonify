<template>
  <div
    class="absolute bottom-0 w-full bg-gray-800 rounded-t-2xl flex flex-col"
  >
    <audio ref="audioPlayer" class="hidden" :src="audioTrack" />

    <div class="pt-4 px-6 text-white flex items-center">
      <fa-icon
        v-if="!isSongPlaying"
        icon="play"
        class="text-2xl mr-4 cursor-pointer"
        @click="playSong()"
      />
      <fa-icon
        v-if="isSongPlaying"
        icon="pause"
        class="text-2xl mr-4 cursor-pointer"
        @click="pauseSong()"
      />
      <fa-icon
        icon="stop"
        class="text-2xl mr-4 cursor-pointer"
        @click="stopSong()"
      />
      <div>
        {{ currentSeconds }} / {{ totalSeconds }}
      </div>
    </div>

    <div
      class="px-6 py-2 text-white truncate"
      :class="{
        'animate-pulse': isSongPlaying
      }"
    >
      <template v-if="currentSong">
        {{ currentSong.title }} by {{ currentSong.artist.first_name }} {{ currentSong.artist.last_name }}
      </template>
      <template v-else>
        No song selected.
      </template>
    </div>

    <div
      class="slider bottom-0 bg-green-500 h-1 w-1/3"
      :style="{ width: `${timePercent}%`}"
    />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from '@vue/composition-api'
import { Song } from '~/models/Song'

export default defineComponent({
  name: 'Player',
  setup (_, { root }) {
    const audioPlayer = ref<HTMLAudioElement | null>(null)
    const currentSong = computed(() => {
      return root.$store.getters['player/currentTrack'] as Song | null
    })
    watch(currentSong, () => {
      canPlay.value = false
      isSongPlaying.value = false
      currentSeconds.value = '00:00'
      totalSeconds.value = '00:00'
      timePercent.value = 0
    })

    const audioTrack = computed(() => {
      if (process.env.API_AUTH_URL && currentSong.value) {
        return process.env.API_AUTH_URL + currentSong.value.file.url
      } else {
        return null
      }
    })

    const canPlay = ref(false)
    const isSongPlaying = ref(false)
    const currentSeconds = ref('00:00')
    const totalSeconds = ref('00:00')
    const timePercent = ref(0)

    watch(audioPlayer, () => {
      if (audioPlayer.value) {
        audioPlayer.value.addEventListener('canplay', () => {
          if (audioPlayer.value) {
            canPlay.value = true
            audioPlayer.value.play()
          }
        })
        audioPlayer.value.addEventListener('pause', () => {
          if (audioPlayer.value) {
            isSongPlaying.value = false
          }
        })
        audioPlayer.value.addEventListener('play', () => {
          if (audioPlayer.value) {
            isSongPlaying.value = true
          }
        })
        audioPlayer.value.addEventListener('ended', () => {
          if (audioPlayer.value) {
            audioPlayer.value.currentTime = 0
          }
        })
        audioPlayer.value.addEventListener('durationchange', () => {
          if (audioPlayer.value) {
            totalSeconds.value = new Date(Math.trunc(audioPlayer.value.duration) * 1000).toISOString().substr(14, 5)
          }
        })
        audioPlayer.value.addEventListener('timeupdate', () => {
          if (audioPlayer.value) {
            currentSeconds.value = new Date(Math.trunc(audioPlayer.value.currentTime) * 1000).toISOString().substr(14, 5)
            timePercent.value = audioPlayer.value.currentTime * 100 / audioPlayer.value.duration
          }
        })
      }
    })

    const playSong = () => {
      if (audioPlayer.value && canPlay.value) {
        audioPlayer.value.play()
      }
    }
    const pauseSong = () => {
      if (audioPlayer.value && canPlay.value) {
        audioPlayer.value.pause()
      }
    }
    const stopSong = () => {
      if (audioPlayer.value && canPlay.value) {
        audioPlayer.value.currentTime = 0
        audioPlayer.value.pause()
      }
    }

    return {
      audioPlayer,
      currentSong,
      audioTrack,
      isSongPlaying,
      totalSeconds,
      currentSeconds,
      timePercent,
      playSong,
      pauseSong,
      stopSong
    }
  }
})
</script>

<style scoped>
.slider {
  position: relative;
}

.slider:hover::after {
  content: '';
  position: absolute;
  right: 0;
  bottom: 0;
  width: 15px;
  height: 10px;
  background-color: inherit;
  border-top-left-radius: 999999px;
  border-top-right-radius: 999999px;
  cursor: pointer;
}
</style>
