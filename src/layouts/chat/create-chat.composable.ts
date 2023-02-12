import { useQuasar } from 'quasar'
import { PbCollection } from 'src/models/pb-collection.enum'
import { usePocketbase } from 'src/services/pocketbase.service'
import { useRouter } from 'vue-router'

export function useCreateChat() {
  const $q = useQuasar()
  const pb = usePocketbase()
  const router = useRouter()

  async function processChatCreation(name: string) {
    const userId = pb.authStore.model?.id

    try {
      const { id } = await pb.collection(PbCollection.CHAT).create({
        name,
        owner: userId,
      })
      console.log('Created chatroom "%s" with id %s', name, id)

      await pb.collection(PbCollection.CHAT_MEMBER).create({
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
