import { defineStore } from 'pinia'
import { Chat, ChatMessage } from 'src/models/chat.interface'

interface ChatStore {
  chats: {
    [id: string]: Chat
  }
  previewMessages: {
    [chatId: string]: ChatMessage
  }
}

export const useChatStore = defineStore('chat', {
  state: (): ChatStore => ({
    chats: {},
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

    storeChat(chat: Chat) {
      this.chats[chat.id] = chat
    },
  },
})
