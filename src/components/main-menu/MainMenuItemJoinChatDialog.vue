<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card>
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

          <q-input dense v-model="inputModel" outlined />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat no-caps v-close-popup>{{ $t('general.cancel') }}</q-btn>

          <q-btn color="primary" no-caps unelevated type="submit">{{
            $t('mainMenu.dialog.joinChat.join')
          }}</q-btn>
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useDialogPluginComponent, useQuasar } from 'quasar'
import { useChatApi } from 'src/composables/chat-api.composable'
import { hasPBErrorStatus } from 'src/utils/pocketbase.util'
import { ProjectError } from 'src/models/project-error.class'
import { ProjectErrorCode } from 'src/models/project-error-code.enum'

interface ErrorBanner {
  joinCode: string
  key: string
}

export default defineComponent({
  emits: [...useDialogPluginComponent.emits],

  setup() {
    const pluginComp = useDialogPluginComponent()

    const { loading } = useQuasar()
    const { getChatByJoinCode, joinChat } = useChatApi()

    const inputModel = ref<string>('')
    const errorBanner = ref<ErrorBanner | null>(null)

    async function processJoin() {
      const joinCode = inputModel.value

      try {
        loading.show()
        const { id } = await getChatByJoinCode(joinCode)
        await joinChat({ chatId: id })
        pluginComp.onDialogOK()
      } catch (e) {
        if (hasPBErrorStatus(e, 404)) {
          errorBanner.value = {
            key: 'mainMenu.dialog.joinChat.error.notFound',
            joinCode,
          }
        } else if (
          e instanceof ProjectError &&
          e.code === ProjectErrorCode.CHAT_MEMBER_ALREADY_JOINED
        ) {
          errorBanner.value = {
            key: 'mainMenu.dialog.joinChat.error.alreadyJoined',
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
