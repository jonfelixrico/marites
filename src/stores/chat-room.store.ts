import { defineStore } from 'pinia'
import { ChatRoom } from 'src/models/chat-room.interface'
import { Message } from 'src/models/message.interface'

interface ChatRoomStore {
  chatRooms: {
    [id: string]: ChatRoom
  }
  previewMessages: {
    [chatRoomId: string]: Message
  }
}

export const useChatRoomStore = defineStore('chatRoom', {
  state: (): ChatRoomStore => ({
    chatRooms: {},
    previewMessages: {},
  }),

  actions: {
    /**
     * Stores a message as the preview message of the chat room it belongs to.
     * @param message
     */
    storePreviewMessage(message: Message) {
      this.previewMessages[message.chatRoomId] = message
    },

    storeChatRoom(chatRoom: ChatRoom) {
      this.chatRooms[chatRoom.id] = chatRoom
    },
  },
})
