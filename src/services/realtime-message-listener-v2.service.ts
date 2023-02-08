import { RecordSubscription, UnsubscribeFunc } from 'pocketbase'
import { Subject } from 'rxjs'
import { Message } from 'src/stores/message.store'
import { usePocketbase } from './pocketbase.service'

const subject = new Subject<RecordSubscription<Message>>()
let pbSubscription: UnsubscribeFunc

export function useRealTimeMessageListener() {
  const pb = usePocketbase()

  async function start() {
    if (!!pbSubscription) {
      console.warn('There is still an active subscription.')
      return
    }

    pbSubscription = await pb
      .collection('messages')
      .subscribe<Message>('*', (record) => {
        subject.next(record)
      })
  }

  async function stop() {
    if (!pbSubscription) {
      console.warn('No active subscription.')
      return
    }

    await pbSubscription()
  }

  return {
    events: subject.asObservable(),
    start,
    stop,
  }
}
