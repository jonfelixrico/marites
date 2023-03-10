import { useChatStore } from 'src/stores/chat.store'
import { useChatApi } from 'src/composables/chat-api.composable'
import { APIChat } from 'src/models/api-chat.interface'
import { PBSubscriptionAction } from 'src/models/pb-subscription-action.enum'
import { useChatMessageApi } from 'src/composables/chat-message-api.composable'
import { PBCollection } from 'src/models/pb-collection.enum'
import { PBChatMessage } from 'src/models/pb-chat-message.interface'
import { useSubscriptionManager } from 'src/services/subscription-manager.service'

type NonDeleteEvent = {
  record: APIChat
  action: PBSubscriptionAction.CREATE | PBSubscriptionAction.UPDATE
}
function isNonDeleteEvent(obj: { action: string }): obj is NonDeleteEvent {
  return obj.action !== PBSubscriptionAction.DELETE
}

export function useChatList() {
  const store = useChatStore()
  const { getChatListObservable, listChats } = useChatApi()
  const { getLastMessage } = useChatMessageApi()
  const { getObservable } = useSubscriptionManager()

  async function fetchLatestMessage(chatId: string) {
    const message = await getLastMessage(chatId)
    if (message) {
      store.storePreviewMessage(message)
    }
  }

  async function loadChatList() {
    const items = await listChats()

    for (const item of items) {
      store.storeChat(item)
    }

    items.forEach(({ id }) => fetchLatestMessage(id))
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

  function listenForChatListUpdates(): () => void {
    const subscription = getChatListObservable().subscribe((event) => {
      if (!isNonDeleteEvent(event)) {
        store.removeChat(event.record.id)
        return
      }

      store.storeChat(event.record)
    })

    return () => subscription.unsubscribe()
  }

  function subscribeToChatActivities() {
    const unsubscribers = [listenForChatListUpdates(), listenForLatestMessage()]
    return () => unsubscribers.forEach((fn) => fn())
  }

  return {
    loadChatList,
    subscribeToChatActivities,
  }
}
