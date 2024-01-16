<template>
  <v-app-bar
    id="app-bar"
    app
    color="transparent"
    fixed
    flat
  >
    <v-btn
      id="app-logo"
      variant="plain"
      to="/"
      :ripple="false"
      class="ma-0 pa-0"
    >
      <LogoBanner small />
    </v-btn>
  </v-app-bar>
</template>
