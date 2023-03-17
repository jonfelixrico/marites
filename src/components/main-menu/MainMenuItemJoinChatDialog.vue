<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="dialog-width">
      <q-form @submit.prevent="processJoin">
        <q-card-section class="text-h6 q-pb-none">
          {{ $t('mainMenu.dialog.joinChat.title') }}
        </q-card-section>

        <q-card-section>
          <div v-if="errorBanner" class="bg-yellow-4 q-pa-sm q-mb-sm">
            <i18n-t :keypath="errorBanner.key">
              <template #joinCode>
                <span class="text-weight-bold">{{ errorBanner.joinCode }}</span>
              </template>
            </i18n-t>
          </div>

          <q-input
            dense
            v-model="inputModel"
            outlined
            :rules="[(val) => !!val || $t('mainMenu.dialog.joinChat.required')]"
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat no-caps v-close-popup>{{ $t('general.cancel') }}</q-btn>

          <q-btn color="primary" no-caps unelevated type="submit">{{
            $t('mainMenu.dialog.joinChat.ok')
          }}</q-btn>
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useDialogPluginComponent, useQuasar } from 'quasar'
import { hasPBErrorStatus } from 'src/utils/pocketbase.util'
import { useChatJoinCodeAPI } from 'src/composables/chat-join-code-api.composable'
import { useChatMembershipAPI } from 'src/composables/chat-membership-api.composable'
import { useSessionApi } from 'src/composables/session-api.composable'

interface ErrorBanner {
  joinCode: string
  key: string
}

export default defineComponent({
  emits: [...useDialogPluginComponent.emits],

  setup() {
    const pluginComp = useDialogPluginComponent()

    const { loading } = useQuasar()
    const { hasUserAlreadyJoined } = useChatMembershipAPI()
    const { getIdFromJoinCode } = useChatJoinCodeAPI()
    const { getSessionUser } = useSessionApi()

    const inputModel = ref<string>('')
    const errorBanner = ref<ErrorBanner | null>(null)

    async function processJoin() {
      const joinCode = inputModel.value

      try {
        loading.show()
        const id = await getIdFromJoinCode(joinCode)

        if (await hasUserAlreadyJoined(id, getSessionUser().id)) {
          errorBanner.value = {
            key: 'mainMenu.dialog.joinChat.error.alreadyJoined',
            joinCode,
          }
          return
        }

        pluginComp.onDialogOK(id)
      } catch (e) {
        if (hasPBErrorStatus(e, 404)) {
          errorBanner.value = {
            key: 'mainMenu.dialog.joinChat.error.notFound',
            joinCode,
          }
        } else {
          errorBanner.value = {
            key: 'mainMenu.dialog.joinChat.error.generic',
            joinCode,
          }
        }
      } finally {
        loading.hide()
      }
    }

    return {
      ...pluginComp,
      errorBanner,
      processJoin,
      inputModel,
    }
  },
})
</script>
