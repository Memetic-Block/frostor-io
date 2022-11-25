<template>
  <v-row>
    <v-col class="text-center">
      <div v-if="$accessor.auth.isLoggedIn">
        <code>{{ $accessor.auth.address }}</code>
        <v-btn
          color="error"
          @click="disconnect"
          :loading="loading"
          x-small
        >
          Disconnect
        </v-btn>
      </div>

      <div v-else>
        <v-btn
          color="primary"
          @click="connect"
          :loading="loading"
          x-small
        >
          Connect
        </v-btn>
      </div>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import BigNumber from 'bignumber.js'

import { debounce } from '~/util'

@Component
export default class ConnectButton extends Vue {
  loading: boolean = false
  balance: BigNumber | null = null

  @debounce
  async connect() {
    this.$deso.login()
  }

  @debounce
  async disconnect() {
    this.$deso.logout()
  }
}
</script>