import { ClientResponseError } from 'pocketbase'

/**
 * Formats a date to be compatible with PB filtering.
 * @param toConvert
 * @returns The date formatted to follow what PB accepts for date filters (Y-m-d H:i:s.uZ). Please see
 * https://github.com/pocketbase/pocketbase/issues/1640#issuecomment-1397009719 for more details.
 */
export function toFilterDate(toConvert: Date | string) {
  const asDate = toConvert instanceof Date ? toConvert : new Date(toConvert)
  /*
   * ISO dates are very close to what PB accepts. The only difference is that the former makes use
   * of 'T' to separate the date and time whereas the latter uses ' ' (space).
   */
  return asDate.toISOString().replace('T', ' ')
}

export function wrapString(toWrap: string): string {
  return `"${toWrap}"`
}

export function hasPBErrorStatus(error: Error, has: number): boolean {
  return error instanceof ClientResponseError && error.status === has
}
