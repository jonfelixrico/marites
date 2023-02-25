import { useChatStore } from 'src/stores/chat-v2.store'
import { useChatApi } from 'src/composables/chat-api.composable'
import { APIChat } from 'src/models/api-chat.interface'
import { PBSubscriptionAction } from 'src/models/pb-subscription-action.enum'

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

  async function loadChatList() {
    const items = await listChats()

    for (const item of items) {
      store.storeChat(item)
    }
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

  return {
    loadChatList,
    listenForChatListUpdates,
  }
}
