<template>
  <div>
    <v-text-field
      v-model="title"
      outlined
      label="Title"
      :rules="[
        () => !!title || 'Required',
        () => title.length <= 120 || 'Too long'
      ]"
      counter="120"
      :disabled="valid"
    ></v-text-field>

    <v-text-field
      v-model="description"
      outlined
      label="Description"
      :rules="[() => description.length <= 280 || 'Too long']"
      counter="280"
      :disabled="valid"
    ></v-text-field>

    <v-btn v-if="!valid" color="primary" text @click="ready">Next</v-btn>
    <v-btn v-else color="primary" text @click="submit" :loading="loading">
      Submit
    </v-btn>
  </div>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from 'nuxt-property-decorator'

import { debounce } from '~/util'

@Component
export default class SubmitControls extends Vue {
  title: string = ''
  titleMaxLength: number = 120
  description: string = ''
  descriptionMaxLength: number = 280
  valid: boolean = false

  @Prop({
    type: Boolean,
    required: false,
    default: false
  }) readonly loading: boolean | undefined

  @Prop({
    type: String,
    required: false,
    default: undefined
  }) readonly attendeeTitle?: string | undefined

  @Prop({
    type: String,
    required: false,
    default: undefined
  }) readonly attendeeDesc?: string | undefined

  mounted() {
    if (this.attendeeTitle) {
      this.title = this.attendeeTitle
    }

    if (this.attendeeDesc) {
      this.description = this.attendeeDesc
    }
  }

  @debounce
  ready() {
    this.valid = this.title.length > 0
      && this.title.length <= this.titleMaxLength
      && this.description.length <= this.descriptionMaxLength
  }

  @Emit('submit')
  @debounce
  submit() {
    return {
      title: this.title,
      description: this.description
    }
  }
}
</script>
