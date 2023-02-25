import { defineStore } from 'pinia'
import { APIChat } from 'src/models/api-chat.interface'
import { ChatMessage } from 'src/models/chat.interface'
import { PBChatMessage } from 'src/models/pb-chat-message.interface'

interface ChatStore {
  chats: {
    [chatId: string]: APIChat
  }

  /*
   * Messages are created at a much higher frequency than chats. To avoid mutating the chat state too much,
   * preview messages are made separate.
   */
  previewMessages: {
    [chatId: string]: PBChatMessage
  }
}

export const useChatStore = defineStore('chat-v2', {
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

    storeChat(chat: APIChat) {
      this.chats[chat.id] = chat
    },
  },
})
