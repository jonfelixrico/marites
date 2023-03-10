import { keyBy, mapValues } from 'lodash'
import { defineStore } from 'pinia'
import { APIChat, APIChatMember } from 'src/models/api-chat.interface'
import { PBChatMessage } from 'src/models/pb-chat-message.interface'

interface ChatMembersMap {
  [chatId: string]: {
    [userId: string]: APIChatMember
  }
}

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

  getters: {
    indexedChatMembers(): ChatMembersMap {
      return mapValues(this.chats, ({ members }) =>
        keyBy(members, ({ id }) => id)
      )
    },
  },

  actions: {
    /**
     * Stores a message as the preview message of the chat room it belongs to.
     * @param message
     */
    storePreviewMessage(message: PBChatMessage) {
      this.previewMessages[message.chat] = message
    },

    storeChat(chat: APIChat) {
      this.chats[chat.id] = chat
    },

    removeChat(chatId: string) {
      delete this.chats[chatId]
    },
  },
})
