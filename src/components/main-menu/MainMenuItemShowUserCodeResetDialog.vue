<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="dialog-width">
      <q-card-section class="q-pb-none text-h6">
        <!-- title -->
      </q-card-section>

      <q-card-section>
        <!-- content -->
      </q-card-section>

      <q-card-actions>
        <!-- buttons -->
      </q-card-actions>
    </q-card>
  </q-dialog>
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
