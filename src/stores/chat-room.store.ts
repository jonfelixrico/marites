import { defineStore } from 'pinia'
import { ChatRoom } from 'src/models/chat-room.interface'
import { Message } from 'src/models/message.interface'

interface ChatRoomStore {
  chatRooms: {
    [id: string]: ChatRoom
  }
  messagePreview: {
    [chatRoomId: string]: Message
  }
}

export const useChatRoomStore = defineStore('chatRoom', {
  state: (): ChatRoomStore => ({
    chatRooms: {},
    messagePreview: {},
  }),

  actions: {
    processMessage(message: Message) {
      const inStore = this.messagePreview[message.chatRoomId]
      if (!inStore || message.created > inStore.created) {
        this.messagePreview[message.chatRoomId] = message
        return
      }
    },

    storeChatRoom(chatRoom: ChatRoom) {
      this.chatRooms[chatRoom.id] = chatRoom
    },
  },
})
