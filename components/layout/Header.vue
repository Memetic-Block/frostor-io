<template>
  <v-app-bar
    app
    color="white"
    fixed
    flat
    id="app-bar"
  >
    <v-btn id="app-logo" text tile plain to="/">
      <v-img max-height="36" max-width="36" src="/logo-black.png" contain />
      BundleDAO
    </v-btn>

    <v-spacer></v-spacer>

    <!-- <v-btn
      class="app-bar-button"
      to="/demo"
      text
      tile
    >
      demo
    </v-btn> -->
  </v-app-bar>
</template>

<style scoped>
#app-bar >>> .v-toolbar__content {
  height: 100%;
  margin-left: auto;
  margin-right: auto;
  padding: 0;
}
</style>
