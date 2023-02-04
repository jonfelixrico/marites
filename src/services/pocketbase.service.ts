import Pocketbase from 'pocketbase'

export const pocketbase = new Pocketbase(process.env.PB_BASE_URL)

export function usePocketbase() {
  return pocketbase
}
