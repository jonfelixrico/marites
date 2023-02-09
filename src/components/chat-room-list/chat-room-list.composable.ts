import { ChatRoom } from 'src/models/chat-room.interface'
import { usePocketbase } from 'src/services/pocketbase.service'
import { useChatRoomStore } from 'src/stores/chat-room.store'

export function useChatRoomList() {
  const pb = usePocketbase()
  const store = useChatRoomStore()

  async function loadChatRoomList() {
    const items = await pb.collection('chatRooms').getFullList<ChatRoom>(200, {
      sort: 'created',
    })

    for (const item of items) {
      store.storeChatRoom(item)
    }
  }

  return {
    loadChatRoomList,
  }
}
