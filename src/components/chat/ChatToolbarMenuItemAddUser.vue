<template>
  <q-item clickable @click="showDialog">
    <q-item-section>
      {{ $t('chat.addUser') }}
    </q-item-section>
  </q-item>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  methods: {
    showDialog() {
      // TODO use a custom dialog
      this.$q.dialog({
        title: this.$t('chat.toolbar.dialog.addUser.title'),
        message: this.$t('chat.toolbar.dialog.addUser.message'),
        prompt: {
          model: '',
          type: 'text',
        },
        cancel: {
          noCaps: true,
          flat: true,
        },
        ok: {
          label: this.$t('chat.toolbar.dialog.addUser.ok'),
          unelevated: true,
          color: 'primary',
        },
      })
    },
  },
})
</script>
