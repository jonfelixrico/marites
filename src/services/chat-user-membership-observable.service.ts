import { RecordSubscription, UnsubscribeFunc } from 'pocketbase'
import { Subject } from 'rxjs'
import { usePocketbase } from './pocketbase.service'
import { PbCollection } from 'src/models/pb-collection.enum'
import { PBChatUserMembership } from 'src/models/pb-chat-user-membership.interface'

const subject = new Subject<RecordSubscription<PBChatUserMembership>>()
let pbSubscription: UnsubscribeFunc

/**
 * @deprecated
 * @returns
 */
export function useChatObservable() {
  const pb = usePocketbase()

  async function start() {
    if (!!pbSubscription) {
      console.warn('There is still an active subscription.')
      return
    }

    pbSubscription = await pb
      .collection(PbCollection.CHAT)
      .subscribe<PBChatUserMembership>('*', (event) => {
        console.debug('Received chat user membership %s', event.record.id)
        subject.next(event)
      })

    console.log('Started subscribing to chat user membership RT.')
  }

  async function stop() {
    if (!pbSubscription) {
      console.warn('No active subscription.')
      return
    }

    await pbSubscription()
    console.log('Stopped subscribing to chat user membership RT.')
  }

  return {
    observable: subject.asObservable(), // to make the subject "read only" outside of this composable
    start,
    stop,
  }
}
