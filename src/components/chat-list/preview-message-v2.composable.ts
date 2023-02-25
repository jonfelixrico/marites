import { useChatMessageApi } from 'src/composables/chat-message-api.composable'
import { useChatStore } from 'src/stores/chat-v2.store'
import { useSubscriptionManager } from 'src/services/subscription-manager.service'
import { PBCollection } from 'src/models/pb-collection.enum'
import { PBChatMessage } from 'src/models/pb-chat-message.interface'
import { PBSubscriptionAction } from 'src/models/pb-subscription-action.enum'

export function usePreviewMessage() {
  const { getLastMessage } = useChatMessageApi()
  const store = useChatStore()
  const { getObservable } = useSubscriptionManager()

  async function fetchLatestMessage(chatId: string) {
    const message = await getLastMessage(chatId)
    if (message) {
      store.storePreviewMessage(message)
    }
  }

  function listenForLatestMessage(): () => void {
    const subscription = getObservable<PBChatMessage>(
      PBCollection.CHAT_MESSAGE
    ).subscribe(({ action, record }) => {
      if (action !== PBSubscriptionAction.CREATE) {
        return
      }

      store.storePreviewMessage(record)
    })

    return () => subscription.unsubscribe()
  }

  return {
    fetchLatestMessage,
    listenForLatestMessage,
  }
}
