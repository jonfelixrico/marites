import { computed } from 'vue'
import { useRoute } from 'vue-router'

export function useChatIdFromRoute() {
  const route = useRoute()
  return computed(() => String(route.params.chatId))
}
