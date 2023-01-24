<template>
  <v-app-bar
    app
    color="transparent"
    fixed
    flat
    id="app-bar"
  >
    <v-btn id="app-logo" text tile plain to="/" :ripple="false">
      <LogoBanner small />
    </v-btn>

    <v-spacer></v-spacer>
  </v-app-bar>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import LogoBanner from '../LogoBanner.vue'

@Component({ components: { LogoBanner } })
export default class Header extends Vue {}
</script>

<style scoped>
#app-bar >>> .v-toolbar__content {
  height: 100%;
  margin-left: auto;
  margin-right: auto;
  padding: 0;
}
</style>
