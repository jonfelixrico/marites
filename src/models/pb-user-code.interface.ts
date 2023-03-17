import { BasePBRecord } from 'src/models/pb-record.interface'

export interface PBUserCode extends BasePBRecord {
  user: string
  code: string
}
