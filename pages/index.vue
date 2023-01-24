<template>
  <div class="index-page">
    <v-container fluid>
      <v-row>
        <v-col cols="6">
          <v-row class="logo-row">
            <v-col offset="3" cols="9">
              <div class="logo-container">
                <v-img
                  src="/logo-black.png"
                  contain
                  max-height="96"
                  max-width="96"
                  class="d-inline-flex"
                />
                <h1 class="text-h1 font-weight-thin d-inline-flex logo-text">
                  BundleDAO
                </h1>
              </div>
            </v-col>
          </v-row>

          <v-row dense>
            <v-col offset="3" cols="9">
              <span class="text-h6 font-weight-light tagline">
                Content ownership and permanence on Arweave
              </span>
            </v-col>
          </v-row>
        </v-col>

        <v-col cols="6">
          <v-img
            class="mb-16"
            contain
            src="/WNrAt3Fn4P8Uw1rJus5zjdgpNyfu5qM0T4JY5JhAyJc.gif"
            position="right"
            height="960"
            max-height="960"
          />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

import { debounce } from '~/util'

@Component
export default class IndexPage extends Vue {
  @debounce
  async onLearnMoreClicked() {
    this.$vuetify.goTo('#learn-more')
  }
}
</script>

<style scoped>
.logo-row {
  margin-top: 12em;
}

.logo-container {
  display: flex;
  margin-top: 10em;
}

.logo-text {
  align-self: center;
}

.tagline {
  margin-left: 107px;
}
</style>
