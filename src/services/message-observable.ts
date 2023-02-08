import { RecordSubscription, UnsubscribeFunc } from 'pocketbase'
import { Subject } from 'rxjs'
import { Message } from 'src/stores/message.store'
import { usePocketbase } from './pocketbase.service'

const subject = new Subject<RecordSubscription<Message>>()
let pbSubscription: UnsubscribeFunc

export function useMessageObservable() {
  const pb = usePocketbase()

  async function start() {
    if (!!pbSubscription) {
      console.warn('There is still an active subscription.')
      return
    }

    pbSubscription = await pb
      .collection('messages')
      .subscribe<Message>('*', (event) => {
        console.debug('Received message %s', event.record.id)
        subject.next(event)
      })

    console.log('Started subscribing to message RT.')
  }

  async function stop() {
    if (!pbSubscription) {
      console.warn('No active subscription.')
      return
    }

    await pbSubscription()
    console.log('Stopped subscribing to message RT.')
  }

  return {
    observable: subject.asObservable(),
    start,
    stop,
  }
}
