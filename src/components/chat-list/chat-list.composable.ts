import { Chat } from 'src/models/chat.interface'
import { useChatObservable } from 'src/services/chat-observable.service'
import { usePocketbase } from 'src/services/pocketbase.service'
import { useChatStore } from 'src/stores/chat.store'
import { PbCollection } from 'src/models/pb-collection.enum'

export function useChatList() {
  const pb = usePocketbase()
  const store = useChatStore()
  const { observable } = useChatObservable()

  async function loadChatList() {
    const items = await pb
      .collection(PbCollection.CHAT)
      .getFullList<Chat>(200, {
        sort: 'created',
      })

    for (const item of items) {
      store.storeChat(item)
    }
  }

  function listenForChatListUpdates(): () => void {
    const subscription = observable.subscribe(({ record }) => {
      store.storeChat(record)
    })

    return () => subscription.unsubscribe()
  }

  return {
    loadChatList,
    listenForChatListUpdates,
  }
}
