<template>
  <div class="logo-banner">
    <v-img
      src="/logo-black.png"
      contain
      :max-height="logoSize"
      :max-width="logoSize"
      class="d-inline-flex"
    />
    <h1 :class="appNameClass">
      BundleDAO
    </h1>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'

@Component
export default class LogoBanner extends Vue {
  @Prop({
    type: Boolean,
    required: false,
    default: false
  }) readonly small: boolean | undefined

  get logoSize() {
    if (this.small) {
      return '32'
    }

    switch (this.$vuetify.breakpoint.name) {
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
  }

  get appNameClass() {
    const textClasses = this.small
      ? [
          'text-h5',
          'font-weight-light',
          'text-none'
        ]
      : [
          'text-xl-h1',
          'text-md-h2',
          'text-sm-h3'
        ]

    return [
      ...textClasses,
      'font-weight-thin',
      'd-inline-flex',
      'logo-text'
    ]
  }
}
</script>

<style scoped>
.logo-banner {
  display: flex;
}

.logo-text {
  align-self: center;
}
</style>
