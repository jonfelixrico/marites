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
    /**
     * @deprecated
     */
    processMessage(message: Message) {
      const inStore = this.messagePreview[message.chatRoomId]
      if (!inStore || message.created > inStore.created) {
        this.messagePreview[message.chatRoomId] = message
        return
      }
    },

    /**
     * Stores a message as the preview message of the chat room it belongs to.
     * @param message
     */
    setPreviewMessage(message: Message) {
      this.messagePreview[message.chatRoomId] = message
    },

    storeChatRoom(chatRoom: ChatRoom) {
      this.chatRooms[chatRoom.id] = chatRoom
    },
  },
})
