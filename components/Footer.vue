<template>
  <v-footer absolute app padless>
    <v-container fluid>
      <v-row>
        <v-col offset="4" cols="4" class="text-center">
          <v-btn
            to="/about"
            variant="text"
          >
            About
          </v-btn>

          <v-btn
            href="https://diamondapp.com/u/bundledao"
            target="_blank"
            variant="text"
            tile
          >
            DeSo
          </v-btn>

          <v-btn
            href="https://twitter.com/bundle_dao"
            target="_blank"
            variant="text"
          >
            <v-icon>mdi-twitter</v-icon>
          </v-btn>

          <v-btn
            href="https://github.com/memetic-block"
            target="_blank"
            variant="text"
          >
            <v-icon>mdi-github</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-footer>
</template>
