<template>
  <div class="index-page">
    <v-container fluid>
      <v-row>
        <v-col cols="12" md="6">
          <v-row :style="verticalMargin">
            <v-col offset="2" offset-sm="3" cols="10" sm="9">
              <LogoBanner />
            </v-col>
          </v-row>

          <v-row dense>
            <v-col cols="9" offset="3">
              <span
                class="
                  text-md-caption
                  text-lg-caption
                  text-xl-h6
                  font-weight-light
                "
                :style="taglineMargin"
              >
                Content ownership and permanence on Arweave
              </span>
            </v-col>
          </v-row>
        </v-col>

        <v-col cols="12" md="6">
          <v-img
            class="mb-16"
            contain
            src="/WNrAt3Fn4P8Uw1rJus5zjdgpNyfu5qM0T4JY5JhAyJc.gif"
            position="right"
            :height="splashImageSize"
            :max-height="splashImageSize"
          />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

import LogoBanner from '~/components/LogoBanner.vue'
import { debounce } from '~/util'

@Component({
  components: {
    LogoBanner
  }
})
export default class IndexPage extends Vue {
  get verticalMargin() {
    switch (this.$vuetify.breakpoint.name) {
      case 'xs':
      case 'sm':
        return 'margin-top: 4em;'
      case 'md':
      case 'lg':
        return 'margin-top: 12em;'
      case 'xl':
      default:
        return 'margin-top: 24em;'
    }
  }

  get taglineMargin() {
    switch (this.$vuetify.breakpoint.name) {
      case 'xs':
        return 'margin-left: -84px;'
      case 'sm':
        return 'margin-left: -22px;'
      case 'md':
        return 'margin-left: 70px;'
      case 'lg':
        return 'margin-left: 105px;'
      case 'xl':
      default:
        return 'margin-left: 107px;'
    }
  }

  get splashImageSize() {
    switch (this.$vuetify.breakpoint.name) {
      case 'xs':
        return '350'
      case 'sm':
        return '620'
      case 'md':
        return '500'
      case 'lg':
        return '620'
      case 'xl':
      default:
        return '960'
    }
  }

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
</style>
