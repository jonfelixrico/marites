import { boot } from 'quasar/wrappers'
import { getBuildVersion } from 'src/utils/app.util'

export default boot(() => {
  console.log('Using build %s', getBuildVersion())
})
