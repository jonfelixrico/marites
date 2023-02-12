import { defineStore } from 'pinia'
import { Chat, ChatMessage } from 'src/models/chat.interface'

interface ChatRoomStore {
  chatRooms: {
    [id: string]: Chat
  }
  previewMessages: {
    [chatId: string]: ChatMessage
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
    storePreviewMessage(message: ChatMessage) {
      this.previewMessages[message.chat] = message
    },

    storeChatRoom(chatRoom: Chat) {
      this.chatRooms[chatRoom.id] = chatRoom
    },
  },
})
