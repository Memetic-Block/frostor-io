<template>
  <v-app dark>
    <v-main>
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>
    <v-footer fixed app>
      <span>{{ $config.eventName }}</span>
      <v-spacer />
      <!-- <ConnectButton /> -->
    </v-footer>
  </v-app>
</template>

<script>
import { Component, Vue } from 'nuxt-property-decorator'

import ConnectButton from '~/components/ConnectButton.vue'

@Component({
  components: {
    ConnectButton
  }
})
export default class DefaultLayout extends Vue {}
</script>
