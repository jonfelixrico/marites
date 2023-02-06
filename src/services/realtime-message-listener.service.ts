import { UnsubscribeFunc } from 'pocketbase'
import { Message, useMessageStore } from 'src/stores/message.store'
import { usePocketbase } from './pocketbase.service'

export interface RealTimeMessageListener {
  start: () => Promise<void>
  stop: () => Promise<void>
}

type MessageStore = ReturnType<typeof useMessageStore>
type Pocketbase = ReturnType<typeof usePocketbase>

class RealTimeMessageListenerImpl implements RealTimeMessageListener {
  constructor(private store: MessageStore, private pb: Pocketbase) {}

  private unsubscriber: UnsubscribeFunc | null = null

  async start() {
    if (!this.unsubscriber) {
      console.warn('There is still an active subscription.')
      return
    }

    this.unsubscriber = await this.pb
      .collection('messages')
      .subscribe<Message>('*', ({ action, record }) => {
        // TODO verify if this is an actual pb action
        if (action !== 'create') {
          return
        }

        this.store.storeMessage(record)
        console.log(
          'Stored message %s with timestamp %s',
          record.id,
          record.created
        )
      })

    console.log('Started the subscription.')
  }

  async stop() {
    if (!this.unsubscriber) {
      console.warn('No active subscription.')
      return
    }

    await this.unsubscriber()
    console.log('Stopped the subscription.')
  }
}

/*
 * This approach where the value is from module-wide variable is an attempt
 * to simuilate an atomic service.
 */
let instance: RealTimeMessageListenerImpl

export function useRealTimeMessageListener(): RealTimeMessageListener {
  const store = useMessageStore()
  const pb = usePocketbase()

  if (!instance) {
    instance = new RealTimeMessageListenerImpl(store, pb)
    console.debug('Initialized the instance.')
  }

  return instance
}
