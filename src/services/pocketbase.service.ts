import Pocketbase from 'pocketbase'

export const pocketbase = new Pocketbase(process.env.PB_BASE_URL)
console.debug('Using %s as the Pocketbase URL')

export function usePocketbase() {
  return pocketbase
}
