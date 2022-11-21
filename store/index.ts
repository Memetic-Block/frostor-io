import { GetterTree, ActionTree, MutationTree } from 'vuex'
import { getAccessorType } from 'typed-vuex'

import * as auth from '~/store/auth'

export const state = () => ({})

export type RootState = ReturnType<typeof state>

export const getters: GetterTree<RootState, RootState> = {}

export const mutations: MutationTree<RootState> = {}

export const actions: ActionTree<RootState, RootState> = {}

export const accessorType = getAccessorType({
  state,
  getters,
  mutations,
  actions,
  modules: { auth },
})
