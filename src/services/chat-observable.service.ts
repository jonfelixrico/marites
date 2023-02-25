import { RecordSubscription, UnsubscribeFunc } from 'pocketbase'
import { Subject } from 'rxjs'
import { usePocketbase } from './pocketbase.service'
import { PbCollection } from 'src/models/pb-collection.enum'
import { PBChat } from 'src/models/pb-chat.interface'

const subject = new Subject<RecordSubscription<PBChat>>()
let pbSubscription: UnsubscribeFunc

export function useChatObservable() {
  const pb = usePocketbase()

  async function start() {
    if (!!pbSubscription) {
      console.warn('There is still an active subscription.')
      return
    }

    pbSubscription = await pb
      .collection(PbCollection.CHAT)
      .subscribe<PBChat>('*', (event) => {
        console.debug('Received chat room %s', event.record.id)
        subject.next(event)
      })

    console.log('Started subscribing to chatroom RT.')
  }

  async function stop() {
    if (!pbSubscription) {
      console.warn('No active subscription.')
      return
    }

    await pbSubscription()
    console.log('Stopped subscribing to chatroom RT.')
  }

  return {
    observable: subject.asObservable(), // to make the subject "read only" outside of this composable
    start,
    stop,
  }
}
