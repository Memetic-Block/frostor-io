import { GetterTree, ActionTree, MutationTree } from 'vuex'
import { RootState } from '~/store'

export const state = () => ({
  address: '',
  encryptedSeedHex: '',
  accessLevel: 0,
  accessLevelHmac: ''
})

export type AuthState = ReturnType<typeof state>

export const getters: GetterTree<AuthState, RootState> = {
  isLoggedIn: state => !!state.address
}

export const mutations: MutationTree<AuthState> = {
  SET_ADDRESS: (
    state,
    { address, encryptedSeedHex, accessLevel, accessLevelHmac }: AuthState
  ) => {
    state.address = address
    state.encryptedSeedHex = encryptedSeedHex
    state.accessLevel = accessLevel
    state.accessLevelHmac = accessLevelHmac
  },
  REMOVE_ADDRESS: (state) => {
    state.address = ''
    state.encryptedSeedHex = ''
  }
}

export const actions: ActionTree<AuthState, RootState> = {
  async connect({ commit }, { address, encryptedSeedHex, accessLevel, accessLevelHmac }) {
    console.log('auth store connect()', address)
    commit('SET_ADDRESS', { address, encryptedSeedHex, accessLevel, accessLevelHmac })
  },

  async disconnect({ commit }) {
    commit('REMOVE_ADDRESS')
  }
}
