import { Message } from 'src/models/message.interface'
import { useMessageObservable } from 'src/services/message-observable.service'
import { usePocketbase } from 'src/services/pocketbase.service'
import { useChatRoomStore } from 'src/stores/chat-room.store'
import { toFilterDate } from 'src/utils/pocketbase.util'
import { computed, Ref } from 'vue'

export function usePreviewMessage(chatRoomId: Ref<string>) {
  const pb = usePocketbase()
  const store = useChatRoomStore()
  const { observable } = useMessageObservable()

  const previewMessage = computed(() => store.messagePreview[chatRoomId.value])

  async function fetchLatestMessage() {
    const { items } = await pb.collection('messages').getList<Message>(1, 1, {
      sort: '-created', // sorting by id to keep sorting consistent for same-timestamp messages
      filter: `created <= "${toFilterDate(new Date())}" && chatRoomId = "${
        chatRoomId.value
      }"`,
      // multiple instances can load at a single instance, so we have to set this to false
      // TODO set to false by default
      $autoCancel: false,
    })

    const item = items[0]

    if (!item) {
      return
    }

    if (previewMessage.value && previewMessage.value.created > item.created) {
      return
    }

    store.setPreviewMessage(item)
  }

  function listenForLatestMessage(): () => void {
    const subscription = observable.subscribe(({ action, record }) => {
      if (action !== 'create' || record.chatRoomId !== chatRoomId.value) {
        return
      }

      store.setPreviewMessage(record)
    })

    return () => subscription.unsubscribe()
  }

  return {
    fetchLatestMessage,
    listenForLatestMessage,
    previewMessage,
  }
}