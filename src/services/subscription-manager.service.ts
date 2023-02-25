import { RecordSubscription, UnsubscribeFunc } from 'pocketbase'
import { Subject } from 'rxjs'

interface GenericRecordSubscription extends RecordSubscription<unknown> {
  collection: string
}

const subject = new Subject<RecordSubscription>()
const unsubscribers: Record<string, UnsubscribeFunc> = {}

export function useSubscriptionManager() {
  function unsubscribe() {
    console.debug('Starting the unsubscription process...')

    for (const key in unsubscribers) {
      unsubscribers[key]()
      delete unsubscribers[key]
      console.debug('Unsubscribed to %s', key)
    }

    console.log('Killed all subscriptions.')
  }

  return {
    unsubscribe,
  }
}
