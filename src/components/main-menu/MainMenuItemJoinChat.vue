<template>
  <q-item clickable @click="openJoinChatDialog">
    <q-item-section>
      {{ $t('mainMenu.joinChat') }}
    </q-item-section>
  </q-item>
</template>

<script lang="ts">
import { useQuasar } from 'quasar'
import { defineComponent } from 'vue'
import MainMenuItemJoinChatDialog from './MainMenuItemJoinChatDialog.vue'

export default defineComponent({
  setup() {
    const { dialog } = useQuasar()

    function openJoinChatDialog() {
      // TODO use custom component to make this comprehensive
      dialog({
        component: MainMenuItemJoinChatDialog,
      })
    }

    return {
      openJoinChatDialog,
    }
  },
})
</script>
