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
        await this.pb
          .collection(PbCollection.USER)
          .authWithPassword(username, password)
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
