<template>
  <v-app dark>
    <Header />

    <v-main>
      <Nuxt />
    </v-main>

    <Footer />

  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

import Footer from '~/components/layout/Footer.vue'
import Header from '~/components/layout/Header.vue'

@Component({ components: { Footer, Header } })
export default class DefaultLayout extends Vue {}
</script>
