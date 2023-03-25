<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide"></q-dialog>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useDialogPluginComponent } from 'quasar'

export default defineComponent({
  emits: [...useDialogPluginComponent.emits],

  setup() {
    const pluginComp = useDialogPluginComponent()

    return {
      ...pluginComp,
    }
  },
})
</script>
