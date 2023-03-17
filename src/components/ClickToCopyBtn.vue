<template>
  <q-btn dense no-caps flat :color="color" @click="copyContent">
    <div class="q-gutter-x-xs">
      <span>{{ content }}</span>
      <q-icon class="text-weight-bold" name="content_copy" size="xs" />
    </div>
  </q-btn>
</template>

<script lang="ts">
import { copyToClipboard } from 'quasar'
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    content: {
      required: true,
      type: String,
    },

    color: {
      type: String,
      default: 'primary',
    },
  },

  emits: ['copy'],

  setup(props, { emit }) {
    async function copyContent() {
      await copyToClipboard(props.content)
      emit('copy', props.content)
    }

    return {
      copyContent,
    }
  },
})
</script>
