import { GetterTree, ActionTree, MutationTree } from 'vuex'
import { Song } from '~/models/Song'
import { RootState } from '~/store'

export interface PlayerState {
  currentTrack: number | null,
  tracks: Song[]
}

export enum PlayerMutation {
  SET_CURRENT_TRACK = 'SET_CURRENT_TRACK',
  SET_TRACKS = 'SET_TRACKS'
}

export const state = (): PlayerState => ({
  currentTrack: null,
  tracks: []
})

export const getters: GetterTree<PlayerState, RootState> = {
  currentTrack: state => state.currentTrack,
  tracksCount: state => state.tracks.length,
  tracks: state => state.tracks
}

export const mutations: MutationTree<PlayerState> = {
  [PlayerMutation.SET_CURRENT_TRACK]: (state, track: number | null) => {
    if (track !== null) {
      if (track >= 0 && track < state.tracks.length) {
        state.currentTrack = track
      } else if (track < 0) {
        state.currentTrack = state.tracks.length - 1
      } else if (track >= state.tracks.length) {
        state.currentTrack = 0
      }
    } else {
      state.currentTrack = null
    }
  },
  [PlayerMutation.SET_TRACKS]: (state, tracks: Song[]) => {
    state.tracks = tracks
  }
}

export const actions: ActionTree<PlayerState, RootState> = {
  setCurrentTrack: ({ commit }, track: number | null) => {
    commit(PlayerMutation.SET_CURRENT_TRACK, track)
  },
  setTracks: ({ commit }, tracks: Song[]) => {
    commit(PlayerMutation.SET_TRACKS, tracks)
    commit(PlayerMutation.SET_CURRENT_TRACK, 0)
  }
}
