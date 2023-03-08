<template>
  <div class="fullscreen bg-grey-3 row justify-center items-center">
    <q-card flat>
      <q-card-section>
        <q-form @submit="authenticate" class="q-gutter-y-md">
          <div>
            <div class="text-weight-bold">
              {{ $t('session.logInForm.username') }}
            </div>
            <q-input name="username" outlined v-model="credentials.username" />
          </div>

          <div>
            <div class="text-weight-bold">
              {{ $t('session.logInForm.password') }}
            </div>
            <q-input
              name="password"
              outlined
              v-model="credentials.password"
              type="password"
            />
          </div>

          <div class="row">
            <q-btn
              unelevated
              color="primary"
              :label="$t('session.logInForm.button')"
              no-caps
              type="submit"
              class="col-12"
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </div>
</template>

<script lang="ts">
import { PBCollection } from 'src/models/pb-collection.enum'
import { usePocketbase } from 'src/services/pocketbase.service'
import { defineComponent, reactive } from 'vue'

export default defineComponent({
  setup() {
    const pb = usePocketbase()

    const credentials = reactive({
      username: '',
      password: '',
    })

    return {
      pb,
      credentials,
    }
  },

  methods: {
    async authenticate() {
      const { username, password } = this.credentials
      try {
        // TODO move this process to the session service
        await this.pb
          .collection(PBCollection.USER)
          .authWithPassword(username, password)
        console.log('Authentication succeded for %s', username)

        this.$router.push({
          name: 'home',
        })
      } catch (e) {
        console.error(e)
      }
    },
  },
})
</script>
