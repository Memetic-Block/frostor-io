<template>
  <div class="index-page">
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="6">
        <h1>Welcome to the {{ $config.eventName }}!</h1>
        <v-divider />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

import { debounce, longTo32ByteArray } from '~/util'

@Component
export default class IndexPage extends Vue {
  fetchOnServer = false
  async fetch() {}

  @debounce
  async debouncedFetch() {
    if (!this.$fetchState.pending) {
      this.$fetch()
    }
  }
}
</script>
