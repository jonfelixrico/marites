import Pocketbase from 'pocketbase'

export const pocketbase = new Pocketbase(process.env.POCKETBASE_URI)

export function usePocketbase() {
  return pocketbase
}
