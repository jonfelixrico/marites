import { defineStore } from 'pinia'
import { Chat } from 'src/models/chat.interface'
import { Message } from 'src/models/message.interface'

interface ChatRoomStore {
  chatRooms: {
    [id: string]: Chat
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

    storeChatRoom(chatRoom: Chat) {
      this.chatRooms[chatRoom.id] = chatRoom
    },
  },
})
