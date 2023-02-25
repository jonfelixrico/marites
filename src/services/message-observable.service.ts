import { RecordSubscription, UnsubscribeFunc } from 'pocketbase'
import { Subject } from 'rxjs'
import { PBChatMessage } from 'src/models/pb-chat-message.interface'
import { PBCollection } from 'src/models/pb-collection.enum'
import { usePocketbase } from './pocketbase.service'

const subject = new Subject<RecordSubscription<PBChatMessage>>()
let pbSubscription: UnsubscribeFunc

/**
 * @deprecated
 * @returns
 */
export function useMessageObservable() {
  const pb = usePocketbase()

  async function start() {
    if (!!pbSubscription) {
      console.warn('There is still an active subscription.')
      return
    }

    pbSubscription = await pb
      .collection(PBCollection.CHAT_MESSAGE)
      .subscribe<PBChatMessage>('*', (event) => {
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
