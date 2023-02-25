import { useQuasar } from 'quasar'
import { useSessionApi } from 'src/composables/session-api.composable'
import { PBCollection } from 'src/models/pb-collection.enum'
import { usePocketbase } from 'src/services/pocketbase.service'
import { useRouter } from 'vue-router'

export function useCreateChat() {
  const $q = useQuasar()
  const pb = usePocketbase()
  const router = useRouter()
  const { getSessionUser } = useSessionApi()

  async function processChatCreation(name: string) {
    const userId = getSessionUser().id

    try {
      const { id } = await pb.collection(PBCollection.CHAT).create({
        name,
        owner: userId,
      })
      console.log('Created chatroom "%s" with id %s', name, id)

      await pb.collection(PBCollection.CHAT_MEMBER).create({
        chat: id,
        user: userId,
      })

      await router.push({
        name: 'chat',
        params: {
          chatId: id,
        },
      })
    } catch (e) {
      // TODO show a dialog or something
      console.error(e)
    }
  }

  function openCreateChatDialog() {
    // TODO use custom component to make this comprehensive
    $q.dialog({
      title: 'Create chat',
      prompt: {
        model: '',
        type: 'text',
      },
      cancel: true,
    }).onOk((name: string) => {
      processChatCreation(name)
    })
  }

  return openCreateChatDialog
}
