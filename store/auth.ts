import { GetterTree, ActionTree, MutationTree } from 'vuex'
import { RootState } from '~/store'

export const state = () => ({
  address: ''
})

export type AuthState = ReturnType<typeof state>

export const getters: GetterTree<AuthState, RootState> = {
  isLoggedIn: state => !!state.address
}

export const mutations: MutationTree<AuthState> = {
  SET_ADDRESS: (state, address: string) => { state.address = address },
  REMOVE_ADDRESS: (state) => { state.address = '' }
}

export const actions: ActionTree<AuthState, RootState> = {
  async connect({ commit }, { address }) {
    console.log('auth store connect()', address)
    commit('SET_ADDRESS', address)
  },

  async disconnect({ commit }) {
    commit('REMOVE_ADDRESS')
  }
}
