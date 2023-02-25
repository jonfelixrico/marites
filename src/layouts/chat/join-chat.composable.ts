import { useQuasar } from 'quasar'
import { useSessionApi } from 'src/composables/session-api.composable'
import { PbCollection } from 'src/models/pb-collection.enum'
import { usePocketbase } from 'src/services/pocketbase.service'
import { useRouter } from 'vue-router'

export function useJoinChat() {
  const { dialog } = useQuasar()
  const pb = usePocketbase()
  const router = useRouter()
  const { getSessionUser } = useSessionApi()

  async function processChatJoin(chatId: string) {
    const userId = getSessionUser().id

    try {
      await pb.collection(PbCollection.CHAT_MEMBER).create({
        chat: chatId,
        user: userId,
      })

      await router.push({
        name: 'chat',
        params: {
          chatId,
        },
      })
    } catch (e) {
      // TODO show a dialog or something
      console.error(e)
    }
  }

  function openJoinChatDialog() {
    // TODO use custom component to make this comprehensive
    dialog({
      title: 'Join chat',
      prompt: {
        model: '',
        type: 'text',
      },
      cancel: true,
    }).onOk((chatId: string) => {
      processChatJoin(chatId)
    })
  }

  return openJoinChatDialog
}
