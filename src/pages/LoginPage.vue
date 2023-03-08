<template>
  <div class="fullscreen bg-grey-3 column justify-center items-center">
    <q-form @submit="authenticate">
      <q-card flat>
        <q-card-section>
          <div class="q-gutter-y-md">
            <q-input name="username" outlined v-model="credentials.username" />
            <q-input
              name="password"
              outlined
              v-model="credentials.password"
              type="password"
            />
            <div class="row">
              <q-btn
                unelevated
                color="primary"
                label="Log In"
                type="submit"
                class="col-12"
              />
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-form>
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
