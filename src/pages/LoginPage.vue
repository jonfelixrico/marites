<template>
  <q-page>
    <q-input name="username" v-model="credentials.username" />
    <q-input name="password" v-model="credentials.password" type="password" />
    <q-btn @click="authenticate" label="Log In" />
  </q-page>
</template>

<script lang="ts">
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
        await this.pb.collection('users').authWithPassword(username, password)
        console.log('Authetnication succeded for %s', username)
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
