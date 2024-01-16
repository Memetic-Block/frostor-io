<template>
  <div class="index-page">
    <v-container fluid>
      <v-row justify="center">
        <v-col cols="12" md="6" :style="verticalMargin">
          <LogoBanner />
          <div
            class="
              text-center
              text-md-caption
              text-lg-caption
              text-xl-h6
              font-weight-light
            "
          >
            Content ownership and permanence on Arweave
          </div>
        </v-col>

        <v-col cols="12" md="6">
          <v-img
            src="/WNrAt3Fn4P8Uw1rJus5zjdgpNyfu5qM0T4JY5JhAyJc.gif"
            contain
            position="right"
            :height="splashImageSize"
            :max-height="splashImageSize"
          />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { useDisplay } from 'vuetify'

const display = useDisplay()

const verticalMargin = computed(() => {
  switch (display.name.value) {
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
})

const splashImageSize = computed(() => {
  switch (display.name.value) {
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
})
</script>
