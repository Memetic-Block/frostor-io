<template>
  <v-app-bar
    id="app-bar"
    app
    color="transparent"
    fixed
    flat
  >
    <template #prepend>
      <router-link v-slot="{navigate}" to="/" custom>
        <div class="logo-container" @click="navigate">
          <LogoBanner small />
        </div>
      </router-link>
    </template>
  </v-app-bar>
</template>

<style scoped>
.logo-container {
  height: 100%;
  cursor: pointer;
}

.logo {
  height: 100%;
  width: auto;
  cursor: pointer;
}
</style>
