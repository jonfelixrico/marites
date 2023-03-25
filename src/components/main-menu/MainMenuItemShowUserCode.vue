<template>
  <q-item clickable @click="showDialog">
    <q-item-section>
      {{ $t('mainMenu.showUserCode') }}
    </q-item-section>
  </q-item>
</template>

<script lang="ts">
import { useQuasar } from 'quasar'
import { useSessionApi } from 'src/composables/session-api.composable'
import { useUserCodeAPI } from 'src/composables/user-api.composable'
import { defineComponent } from 'vue'
import MainMenuItemShowUserCodeDialog from './MainMenuItemShowUserCodeDialog.vue'

export default defineComponent({
  setup() {
    const sessionAPI = useSessionApi()
    const codeAPI = useUserCodeAPI()
    const { dialog, loading } = useQuasar()

    async function getUserCode() {
      const userId = sessionAPI.getSessionUser().id
      return await codeAPI.getUserCode(userId)
    }

    async function showDialog() {
      loading.show()
      try {
        const userCode = await getUserCode()
        dialog({
          component: MainMenuItemShowUserCodeDialog,
          componentProps: {
            userCode: userCode,
          },
        })
      } finally {
        loading.hide()
      }
    }

    return {
      showDialog,
    }
  },
})
</script>
