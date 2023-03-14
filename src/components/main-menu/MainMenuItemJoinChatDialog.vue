<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card>
      <q-card-section class="text-h6 q-pb-none">
        {{ $t('mainMenu.dialog.joinChat.title') }}
      </q-card-section>

      <q-card-actions align="right">
        <q-btn color="primary" no-caps unelevated>{{
          $t('mainMenu.dialog.joinChat.join')
        }}</q-btn>
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
    return {
      ...useDialogPluginComponent(),
    }
  },
})
</script>
