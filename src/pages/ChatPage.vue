<template>
  <div class="column">
    <div class="col"></div>
    <!-- TODO add validation; must not be blank -->
    <q-form @submit="handleSubmit">
      <div class="row">
        <q-input type="textarea" v-model="content" />
      </div>
    </q-form>
  </div>
</template>

<script lang="ts">
import { usePocketbase } from 'src/services/pocketbase.service'
import { defineComponent, ref } from 'vue'

export default defineComponent({
  setup() {
    const pb = usePocketbase()
    const content = ref('')

    return {
      content,
      pb,
    }
  },

  methods: {
    async handleSubmit() {
      await this.sendMessage(this.content)
    },

    async sendMessage(content: string) {
      await this.pb.collection('messages').create({
        content,
        senderId: [this.pb.authStore.model?.id],
        chatRoomId: this.$route.params.chatId,
      })
    },
  },
})
</script>
