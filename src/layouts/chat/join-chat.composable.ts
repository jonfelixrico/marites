import { useQuasar } from 'quasar'
import { PbCollection } from 'src/models/pb-collection.enum'
import { usePocketbase } from 'src/services/pocketbase.service'
import { useRouter } from 'vue-router'

export function useJoinChat() {
  const { dialog } = useQuasar()
  const pb = usePocketbase()
  const router = useRouter()

  async function processChatJoin(chatId: string) {
    const userId = pb.authStore.model?.id

    try {
      await pb.collection(PbCollection.CHAT).getOne(chatId)
      await pb.collection(PbCollection.CHAT_MEMBER).create({
        chat: chatId,
        user: userId,
      })

      await router.push({
        name: 'chat',
        params: {
          chatId: chatId,
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
