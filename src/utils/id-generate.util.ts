import { customAlphabet } from 'nanoid'
import nanoidDictionary from 'nanoid-dictionary'

export function generateShortId(): string {
  const customGenerator = customAlphabet(nanoidDictionary.alphanumeric, 16)
  return customGenerator()
}
