import { useQuasar } from 'quasar'
import { useChatApi } from 'src/composables/chat-api.composable'
import { useRouter } from 'vue-router'

export function useCreateChat() {
  const $q = useQuasar()
  const router = useRouter()
  const { createChat } = useChatApi()

  async function processChatCreation(name: string) {
    try {
      const { id } = await createChat({
        name,
      })
      console.log('Created chatroom "%s" with id %s', name, id)

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
