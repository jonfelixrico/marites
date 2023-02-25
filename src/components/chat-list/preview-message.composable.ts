import { useMessageObservable } from 'src/services/message-observable.service'
import { useChatStore } from 'src/stores/chat.store'
import { computed, Ref } from 'vue'
import { useChatMessageApi } from 'src/composables/chat-message-api.composable'

export function usePreviewMessage(chatId: Ref<string>) {
  const store = useChatStore()
  const { getLastMessage } = useChatMessageApi()

  const { observable } = useMessageObservable()

  const previewMessage = computed(() => store.previewMessages[chatId.value])

  async function fetchLatestMessage() {
    const item = await getLastMessage(chatId.value)
    if (
      !item ||
      (previewMessage.value && previewMessage.value.created > item.created)
    ) {
      return
    }

    store.storePreviewMessage(item)
  }

  function listenForLatestMessage(): () => void {
    const subscription = observable.subscribe(({ action, record }) => {
      if (action !== 'create' || record.chat !== chatId.value) {
        return
      }

      store.storePreviewMessage(record)
    })

    return () => subscription.unsubscribe()
  }

  return {
    fetchLatestMessage,
    listenForLatestMessage,
    previewMessage,
  }
}
