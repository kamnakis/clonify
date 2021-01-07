import { GetterTree, ActionTree, MutationTree } from 'vuex'
import { RootState } from '~/store'

export interface GlobalState {
  pageTitle: string
}

export enum GlobalMutation {
  SET_PAGE_TITLE = 'SET_PAGE_TITLE'
}

export const state = (): GlobalState => ({
  pageTitle: ''
})

export const getters: GetterTree<GlobalState, RootState> = {
  pageTitle: state => state.pageTitle
}

export const mutations: MutationTree<GlobalState> = {
  [GlobalMutation.SET_PAGE_TITLE]: (state, title: string) => {
    state.pageTitle = title
  }
}

export const actions: ActionTree<GlobalState, RootState> = {
  setPageTitle: ({ commit }, title: string) => {
    commit(GlobalMutation.SET_PAGE_TITLE, title)
  }
}
