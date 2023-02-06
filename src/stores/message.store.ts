import { defineStore } from 'pinia'

// TODO move this out into its own file
export interface Message {
  content: string
  chatRoomId: string
  senderId: string
  id: string
  created: Date
  updated: Date
}

interface MessageStore {
  chatRooms: {
    [chatRoomId: string]: {
      [messageId: string]: Message
    }
  }
}

export const useMessageStore = defineStore('message', {
  state: (): MessageStore => ({
    chatRooms: {},
  }),

  actions: {
    storeMessage(message: Message) {
      const { chatRoomId } = message

      if (!this.chatRooms[chatRoomId]) {
        this.chatRooms[chatRoomId] = {}
      }

      this.chatRooms[chatRoomId][message.id] = message
    },

    storeMessages(...messages: Message[]) {
      for (const message of messages) {
        this.storeMessage(message)
      }
    },
  },
})
