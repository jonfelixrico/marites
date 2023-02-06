import Pocketbase from 'pocketbase'

export const pocketbase = new Pocketbase(process.env.POCKETBASE_URL)
console.debug('Using %s as the Pocketbase URL', process.env.POCKETBASE_URL)

export function usePocketbase() {
  return pocketbase
}
