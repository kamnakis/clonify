<template>
  <div
    class="fixed inset-0 z-20"
    :class="{
      'pointer-events-none': isMinimized
    }"
  >
    <audio ref="audioPlayer" class="hidden" :src="audioTrack" />
    <transition name="rotate">
      <div
        v-if="!isMinimized"
        v-touch="{
          left: () => { prevSong() },
          right: () => { nextSong() },
          down: () => { isMinimized = true }
        }"
        class="relative w-full h-full"
      >
        <!-- Music Page -->
        <div
          class="absolute half-bg bottom-0 h-full w-full d-flex flex-column pb-40"
        >
          <div class="w-full mt-8 px-6 flex justify-start items-center text-gray-2">
            <fa-icon icon="chevron-left" class="text-xl cursor-pointer" @click="isMinimized = true" />
          </div>
          <div
            class="mt-8 mx-auto rounded-4xl bg-green-1 flex items-center justify-center overflow-hidden flex-grow-0"
            style="width: 18rem; height: 18rem"
          >
            <v-img
              v-if="currentSong"
              :src="apiUrl + currentSong.artist.profile_image.url"
              class="w-full h-full object-cover object-center"
              gradient="to top right, rgba(132, 218, 165, 0.33), rgba(69, 128, 92, 0.66)"
            />
          </div>
          <div class="w-full px-10 mt-8 flex justify-between items-start text-gray-2">
            <label>
              <input v-model="isFavorite" type="checkbox" class="hidden">
              <fa-icon :icon="[`${isFavorite ? 'fa' : 'far'}`, 'heart']" class="text-xl cursor-pointer text-green-1" />
            </label>
            <div v-if="currentSong" class="text-center font-bold text-black text-lg leading-6">
              {{ currentSong.title }}<br>
              <span class="text-gray-600 font-normal text-sm">
                {{ `${currentSong.artist.first_name} ${currentSong.artist.last_name}` }}
              </span>
            </div>
            <fa-icon icon="times" class="text-xl cursor-pointer text-gray-2" @click="stopSong()" />
          </div>
          <div class="w-full px-10 flex justify-center">
            <v-slider
              :value="timePercent"
              dense
              min="0"
              max="100"
              track-color="gray"
              track-fill-color="#84DAA5"
              thumb-color="#84DAA5"
              @change="changeSliderDuration"
            />
          </div>
          <div class="w-full px-12 flex justify-between -mt-6">
            <div>{{ currentSeconds }}</div>
            <div>{{ totalSeconds }}</div>
          </div>
        </div>
        <!-- Music Player -->
        <div class="absolute bottom-0 w-full">
          <!-- Maximized -->
          <div
            class="reverse-rounded w-full bg-gray-2 h-40 pt-8 px-6 flex items-center justify-around transition-opacity duration-400"
            :style="{
              opacity: isMinimized ? '0' : '1',
            }"
          >
            <fa-icon
              icon="step-backward"
              class="text-white text-2xl cursor-pointer"
              :class="{
                'cursor-default pointer-events-none text-gray-200 text-opacity-50': $nuxt.$store.getters['player/tracksCount'] <= 1
              }"
              @click="prevSong()"
            />
            <v-progress-circular
              :rotate="-90"
              :size="60"
              :width="5"
              :value="timePercent"
              class="text-green-1 cursor-pointer"
              @click="isSongPlaying ? pauseSong() : playSong()"
            >
              <div class="w-full h-full flex items-center justify-center">
                <fa-icon v-if="!isSongPlaying" icon="play" class="text-lg" />
                <fa-icon v-else icon="pause" class="text-lg" />
              </div>
            </v-progress-circular>
            <fa-icon
              icon="step-forward"
              class="text-white text-2xl cursor-pointer"
              :class="{
                'cursor-default pointer-events-none text-gray-200 text-opacity-50': $nuxt.$store.getters['player/tracksCount'] <= 1
              }"
              @click="nextSong()"
            />
          </div>
        </div>
      </div>
    </transition>

    <!-- Minimized Player -->
    <transition name="slide">
      <div
        v-if="isMinimized && $store.getters['player/currentTrack'] !== null"
        v-touch="{
          up: () => { isMinimized = false }
        }"
        class="fixed bottom-0 w-full bg-green-1 rounded-t-4xl px-8 flex items-center justify-between"
        :class="{
          'pointer-events-auto': isMinimized
        }"
        :style="{
          height: '7rem'
        }"
      >
        <div
          class="h-16 w-16 rounded-3xl bg-gray-500 overflow-hidden"
          @click="isMinimized = false"
        >
          <v-img
            v-if="currentSong"
            :src="apiUrl + currentSong.artist.profile_image.url"
            class="w-full h-full object-cover object-center cursor-pointer"
          />
        </div>
        <div
          v-if="currentSong"
          class="flex flex-col ml-6"
        >
          <div class="text-xs text-gray-2">
            Now Playing
          </div>
          <div class="text-base font-medium text-gray-2">
            {{ currentSong.title }}
          </div>
        </div>
        <v-progress-circular
          :rotate="-90"
          :size="40"
          :width="4"
          :value="timePercent"
          class="text-gray-2 cursor-pointer"
          @click="isSongPlaying ? pauseSong() : playSong()"
        >
          <div class="w-full h-full flex items-center justify-center">
            <fa-icon v-if="!isSongPlaying" icon="play" class="text-sm" />
            <fa-icon v-else icon="pause" class="text-sm" />
          </div>
        </v-progress-circular>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from '@vue/composition-api'
import { Song } from '~/models/Song'

export default defineComponent({
  name: 'Player',
  setup (_, { root }) {
    const isMinimized = ref(true)
    const isFavorite = ref(true)

    const audioPlayer = ref<HTMLAudioElement | null>(null)
    const currentSong = computed(() => {
      return (root.$store.getters['player/tracks'] as Song[])[root.$store.getters['player/currentTrack'] as number]
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
    const sliderDuration = ref(0)

    watch(audioPlayer, () => {
      if (audioPlayer.value) {
        audioPlayer.value.addEventListener('canplay', () => {
          if (audioPlayer.value) {
            canPlay.value = true
            audioPlayer.value.play()
            isSongPlaying.value = true
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
            nextSong()
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

    const changeSliderDuration = (val: number) => {
      sliderDuration.value = val
    }

    watch(sliderDuration, () => {
      if (audioPlayer.value) {
        audioPlayer.value.currentTime = (sliderDuration.value * audioPlayer.value.duration) / 100
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
    const nextSong = () => {
      root.$store.dispatch('player/setCurrentTrack', root.$store.getters['player/currentTrack'] !== null ? root.$store.getters['player/currentTrack'] + 1 : null)
    }
    const prevSong = () => {
      root.$store.dispatch('player/setCurrentTrack', root.$store.getters['player/currentTrack'] !== null ? root.$store.getters['player/currentTrack'] - 1 : null)
    }

    return {
      isMinimized,
      isFavorite,
      audioPlayer,
      currentSong,
      audioTrack,
      isSongPlaying,
      sliderDuration,
      changeSliderDuration,
      totalSeconds,
      currentSeconds,
      timePercent,
      playSong,
      pauseSong,
      stopSong,
      apiUrl: process.env.API_AUTH_URL,
      nextSong,
      prevSong
    }
  }
})
</script>

<style lang="scss" scoped>
.reverse-rounded {
  @apply relative border-none;
}

.reverse-rounded::before {
  content: '';
  position: absolute;
  top: -1px;

  @apply w-full h-8 bg-white half-bg rounded-b-4xl border-none;
}

.half-bg {
  background: rgb(238,238,238);
  background: linear-gradient(90deg, rgb(238, 238, 238) 0%, rgba(238,238,238,1) 66%, rgba(255,255,255,1) 66%, rgba(255,255,255,1) 100%);
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.5s;
}

.slide-enter,
.slide-leave-to {
  opacity: 0;
  transform: translateY(8rem);
}

.rotate-enter-active,
.rotate-leave-active {
  transition: all 0.5s;
}

.rotate-enter,
.rotate-leave-to {
  opacity: 0;
  transform: rotateY(90deg)
}
</style>
