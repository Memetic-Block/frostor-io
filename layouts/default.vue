<template>
  <v-app class="app">
    <v-main class="app-main">
      <Header />
      <slot />
      <Footer />
    </v-main>
  </v-app>
</template>

<style>
@import "@/assets/styles/main.css";
</style>
