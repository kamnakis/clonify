import { GetterTree, ActionTree, MutationTree } from 'vuex'

export const state = () => ({
})

export type RootState = {
  auth: {
    loggedIn: boolean,
    user: {
      [key: string]: any
    }
  }
}

export const getters: GetterTree<RootState, RootState> = {
  isAuthenticated (state) {
    return state.auth.loggedIn
  },
  loggedInUser (state) {
    return state.auth.user
  }
}

export const mutations: MutationTree<RootState> = {
}

export const actions: ActionTree<RootState, RootState> = {
}
