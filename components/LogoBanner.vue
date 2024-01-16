<template>
  <div class="logo-banner">
    <v-img
      class="ma-2 d-inline-flex"
      src="/logo-black.png"
      :max-height="logoSize"
      :height="logoSize"
      :max-width="logoSize"
      :width="logoSize"
    />
    <h1
      class="
        text-decoration-none
        logo-text
        d-inline-flex
      "
      :class="
        props.small
          ? 'font-weight-light text-h5'
          : 'font-weight-thin text-xl-h1 text-md-h2 text-sm-h3'
      "
      :style="props.small ? '' : 'justify-content: center'"
    >
      Frostor
    </h1>
  </div>
</template>

<style scoped>
.logo-banner {
  display: flex;
}

.logo-text {
  align-self: center;
}
</style>

<script setup lang="ts">
import { useDisplay } from 'vuetify'

const props = defineProps<{small?: boolean}>()
const display = useDisplay()
const logoSize = computed(() => {
  if (props.small) {
    return '32'
  }

  switch (display.name.value) {
    case 'xs':
    case 'sm':
      return '3rem'
    case 'md':
      return '3.75rem'
    case 'lg':
      return '6rem'
    case 'xl':
    default:
      return '6rem'
  }
})
</script>
