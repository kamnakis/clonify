import { GetterTree, ActionTree, MutationTree } from 'vuex'
import { Song } from '~/models/Song'
import { RootState } from '~/store'

export interface PlayerState {
  currentTrack: Song | null
}

export enum PlayerMutation {
  SET_CURRENT_TRACK = 'SET_CURRENT_TRACK'
}

export const state = (): PlayerState => ({
  currentTrack: null
})

export const getters: GetterTree<PlayerState, RootState> = {
  currentTrack: state => state.currentTrack
}

export const mutations: MutationTree<PlayerState> = {
  [PlayerMutation.SET_CURRENT_TRACK]: (state, track: Song | null) => {
    state.currentTrack = track
  }
}

export const actions: ActionTree<PlayerState, RootState> = {
  setCurrentTrack: ({ commit }, track: Song | null) => {
    commit(PlayerMutation.SET_CURRENT_TRACK, track)
  }
}
