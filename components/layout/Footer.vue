<template>
  <v-footer absolute app :color="color" padless>
    <v-container fluid>
      <v-row>
        <v-col offset="4" cols="1">
          <v-btn
            href="https://diamondapp.com/u/bundledao"
            target="_blank"
            text
            tile
          >
            DeSo
          </v-btn>
        </v-col>
        <v-col cols="1">
          <v-btn
            href="https://twitter.com/bundle_dao"
            target="_blank"
            icon
          >
            <v-icon>mdi-twitter</v-icon>
          </v-btn>
        </v-col>
        <v-col cols="1">
          <v-btn
            href="https://openfund.com/d/BundleDAO"
            target="_blank"
            text
            tile
          >
            OpenFund
          </v-btn>
        </v-col>
        <v-col cols="1">
          <v-btn
            href="https://gitlab.com/art-by-city"
            target="_blank"
            icon
          >
            <v-icon>mdi-gitlab</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-footer>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

import ConnectButton from '../ConnectButton.vue'

@Component({ components: { ConnectButton } })
export default class Footer extends Vue {
  get color(): string {
    return this.$vuetify.theme.dark
      ? 'black'
      : 'white'
  }
}
</script>
