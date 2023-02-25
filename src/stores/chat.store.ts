import { defineStore } from 'pinia'
import { Chat, ChatMember, ChatMessage } from 'src/models/chat.interface'

interface ChatStore {
  chats: {
    [chatId: string]: Chat
  }

  chatMembers: {
    [chatId: string]: {
      [memberId: string]: ChatMember
    }
  }

  previewMessages: {
    [chatId: string]: ChatMessage
  }
}

/**
 * @deprecated
 */
export const useChatStore = defineStore('chat', {
  state: (): ChatStore => ({
    chats: {},
    previewMessages: {},
    chatMembers: {},
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

    storeChatMember(member: ChatMember) {
      const { chat } = member
      if (!this.chatMembers[chat]) {
        this.chatMembers[chat] = {}
      }

      this.chatMembers[chat][member.id] = member
    },

    storeChatMembers(...members: ChatMember[]) {
      for (const member of members) {
        this.storeChatMember(member)
      }
    },
  },
})
