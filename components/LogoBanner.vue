<template>
  <v-container>
    <v-row>
      <v-col cols="2">
        <v-img
          src="/logo-black.png"
          :min-width="logoSize"
        />
      </v-col>
      <v-col cols="6">
        <h2
          v-if="props.small"
          class="d-inline-flex font-weight-light mt-1 ml-1"
        >
          frostor
        </h2>
        <h1
          v-else
          class="d-inline-flex font-weight-thin mt-5 ml-8"
        >
          frostor
        </h1>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
const props = defineProps<{small?: boolean}>()
const logoSize = computed(() => {
  return props.small ? '32px' : '6rem'
})
</script>
