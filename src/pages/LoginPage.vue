<template>
  <div class="fullscreen">
    <!--
      basic login impl
      TODO flesh this out
    -->
    <q-form @submit="authenticate">
      <q-input name="username" v-model="credentials.username" />
      <q-input name="password" v-model="credentials.password" type="password" />
      <q-btn label="Log In" type="submit" />
    </q-form>
  </div>
</template>

<script lang="ts">
import { PbCollection } from 'src/models/pb-collection.enum'
import { usePocketbase } from 'src/services/pocketbase.service'
import { useSessionStore } from 'src/stores/session-store'
import { defineComponent, reactive } from 'vue'

export default defineComponent({
  setup() {
    const pb = usePocketbase()
    const sessionStore = useSessionStore()

    const credentials = reactive({
      username: '',
      password: '',
    })

    return {
      pb,
      credentials,
      sessionStore,
    }
  },

  methods: {
    async authenticate() {
      const { username, password } = this.credentials
      try {
        // TODO move this process to the session service
        const { record } = await this.pb
          .collection(PbCollection.USER)
          .authWithPassword(username, password)
        console.log('Authentication succeded for %s', username)
        this.sessionStore.setUserId(record.id)

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
