<template>
  <q-btn dense no-caps flat :color="color" @click="copyContent">
    <div class="q-gutter-x-xs">
      <span>{{ content }}</span>
      <q-icon class="text-weight-bold" name="content_copy" size="xs" />
    </div>
  </q-btn>
</template>

<script lang="ts">
import { copyToClipboard, useQuasar } from 'quasar'
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

    copyNotif: String,
  },

  emits: ['copy'],

  setup(props, { emit }) {
    const { notify } = useQuasar()

    async function copyContent() {
      const { content, copyNotif } = props

      await copyToClipboard(content)
      console.debug('Copied content %s to clipboard', content)
      emit('copy', content)

      if (copyNotif) {
        notify(copyNotif)
      }
    }

    return {
      copyContent,
    }
  },
})
</script>
