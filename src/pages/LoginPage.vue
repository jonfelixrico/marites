<template>
  <q-page>
    <!--
      basic login impl
      TODO flesh this out
    -->
    <q-form @submit="authenticate">
      <q-input name="username" v-model="credentials.username" />
      <q-input name="password" v-model="credentials.password" type="password" />
      <q-btn label="Log In" type="submit" />
    </q-form>
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
