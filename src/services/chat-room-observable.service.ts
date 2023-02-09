import { RecordSubscription, UnsubscribeFunc } from 'pocketbase'
import { Subject } from 'rxjs'
import { ChatRoom } from 'src/models/chat-room.interface'
import { usePocketbase } from './pocketbase.service'

const subject = new Subject<RecordSubscription<ChatRoom>>()
let pbSubscription: UnsubscribeFunc

export function useChatRoomObservable() {
  const pb = usePocketbase()

  async function start() {
    if (!!pbSubscription) {
      console.warn('There is still an active subscription.')
      return
    }

    pbSubscription = await pb
      .collection('chatrooms')
      .subscribe<ChatRoom>('*', (event) => {
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
