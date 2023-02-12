import { Chat } from 'src/models/chat.interface'
import { useChatRoomObservable } from 'src/services/chat-room-observable.service'
import { usePocketbase } from 'src/services/pocketbase.service'
import { useChatRoomStore } from 'src/stores/chat-room.store'
import { PbCollection } from 'src/models/pb-collection.enum'

export function useChatRoomList() {
  const pb = usePocketbase()
  const store = useChatRoomStore()
  const { observable } = useChatRoomObservable()

  async function loadChatRoomList() {
    const items = await pb
      .collection(PbCollection.CHAT)
      .getFullList<Chat>(200, {
        sort: 'created',
      })

    for (const item of items) {
      store.storeChatRoom(item)
    }
  }

  function listenForChatRoomListUpdates(): () => void {
    const subscription = observable.subscribe(({ record }) => {
      store.storeChatRoom(record)
    })

    return () => subscription.unsubscribe()
  }

  return {
    loadChatRoomList,
    listenForChatRoomListUpdates,
  }
}
