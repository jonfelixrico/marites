import { defineStore } from 'pinia'
import { Message } from 'src/models/message.interface'

interface MessageStore {
  chatRooms: {
    [chatRoomId: string]: Message[]
  }
}

export const useMessageStoreV2 = defineStore('message', {
  state: (): MessageStore => ({
    chatRooms: {},
  }),

  actions: {
    storeMessage(message: Message, direction: 'append' | 'prepend') {
      const { chatRoomId } = message

      if (!this.chatRooms[chatRoomId]) {
        this.chatRooms[chatRoomId] = []
      }

      const arr = this.chatRooms[chatRoomId]
      if (direction === 'append') {
        arr.push(message)
      } else {
        arr.unshift(message)
      }
    },

    storeMessages(direction: 'append' | 'prepend', ...messages: Message[]) {
      for (const message of messages) {
        this.storeMessage(message, direction)
      }
    },
  },
})
