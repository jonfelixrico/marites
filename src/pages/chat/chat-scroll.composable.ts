import { debounce, scroll } from 'quasar'
import { ref } from 'vue'

export function useChatScroll() {
  const scrollEl = ref<HTMLElement | null>(null)
  const scrollHeight = ref<number>(0)

  const scrollListener = debounce((event: UIEvent) => {
    if (!event.target) {
      return
    }

    if (!scrollEl.value) {
      scrollEl.value = event.target as HTMLElement
    }

    scrollHeight.value = scrollEl.value.scrollHeight
  }, 250)

  function compensateScroll() {
    if (scrollEl.value && scrollHeight.value === 0) {
      const scrollTarget = scroll.getScrollTarget(scrollEl.value)
      scroll.setVerticalScrollPosition(scrollTarget, 0)
      console.debug('Scroll compensated.')
    }
  }

  return {
    scrollListener,
    compensateScroll,
  }
}
