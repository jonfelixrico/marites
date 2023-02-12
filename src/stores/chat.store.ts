import { mapValues } from 'lodash'
import { defineStore } from 'pinia'
import { Chat, ChatMember, ChatMessage } from 'src/models/chat.interface'
import { useSessionStore } from './session-store'

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

export const useChatStore = defineStore('chat', {
  state: (): ChatStore => ({
    chats: {},
    previewMessages: {},
    chatMembers: {},
  }),

  getters: {
    /**
     * Gets the member id of the session user on each chat.
     * @param state
     * @returns
     */
    sessionUserMember(state) {
      const sessionStore = useSessionStore()

      if (!sessionStore.userId) {
        return {}
      }

      return mapValues(state.chatMembers, (members) => {
        const values = Object.values(members)
        return values.find(({ user }) => sessionStore.userId === user)
      })
    },
  },

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
