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
  // async connect({ commit }) {
  //   try {
  //     await this.$beacon.wallet.requestPermissions({
  //       network: { type: this.$beacon.wallet.client.preferredNetwork }
  //     })
  //     commit('SET_ADDRESS', await this.$beacon.wallet.getPKH())
  //   } catch (err) {
  //     console.error('Error connecting Tezos Wallet', err)
  //   }
  // },

  // async disconnect({ commit }) {
  //   await this.$beacon.disconnect()
  //   commit('REMOVE_ADDRESS')
  // }
}
