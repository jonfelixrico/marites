import { debounce, scroll } from 'quasar'
import { ref } from 'vue'

function isScrolledToEnd(el: HTMLElement): boolean {
  const scrollHeight = scroll.getScrollHeight(el)
  const rect = el.getBoundingClientRect()

  return scrollHeight - rect.height === el.scrollTop
}

export function useChatScroll() {
  const scrollEl = ref<HTMLElement | null>(null)
  const isScrollAtBottom = ref<boolean>(true)

  const scrollListener = debounce((event: UIEvent) => {
    if (!event.target) {
      return
    }

    const el = event.target as HTMLElement

    if (!scrollEl.value) {
      scrollEl.value = el
    }

    const isAtEnd = isScrolledToEnd(el)

    console.log('Is scrolled to end? %s', isAtEnd)
    isScrollAtBottom.value = isAtEnd
  }, 250)

  function scrollToBottom(duration?: number) {
    const el = scrollEl.value
    if (!el) {
      return
    }

    const target = scroll.getScrollTarget(el)
    const height = scroll.getScrollHeight(el)
    scroll.setVerticalScrollPosition(target, height, duration)
  }

  function keepScrollAtBottom() {
    if (isScrollAtBottom.value) {
      scrollToBottom()
      console.debug('Scroll compensated.')
    }
  }

  return {
    scrollListener,
    keepScrollAtBottom,
    isScrollAtBottom,
    scrollToBottom,
  }
}
