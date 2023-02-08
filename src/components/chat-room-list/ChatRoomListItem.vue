<template>
  <q-item
    clickable
    @click="$router.push({ name: 'chat', params: { chatRoomId: chatRoom.id } })"
    :active="chatRoom.id === $route.params.chatRoomId"
  >
    <q-item-section>
      <div>{{ chatRoom.name }}</div>
      <div>{{ message?.content }}</div>
    </q-item-section>
  </q-item>
</template>

<script lang="ts">
import { computed, defineComponent, onBeforeMount, PropType } from 'vue'
import { ChatRoom } from 'src/models/chat-room.interface'
import { useChatRoomStore } from 'src/stores/chat-room.store'
import { usePocketbase } from 'src/services/pocketbase.service'
import { Message } from 'src/models/message.interface'
import { toFilterDate } from 'src/utils/pocketbase.util'

export default defineComponent({
  props: {
    chatRoom: {
      type: Object as PropType<ChatRoom>,
      required: true,
    },
  },

  setup(props) {
    const store = useChatRoomStore()
    const pb = usePocketbase()

    onBeforeMount(async () => {
      // take the latest message for the chat room
      const { items } = await pb.collection('messages').getList<Message>(1, 1, {
        sort: '-created', // sorting by id to keep sorting consistent for same-timestamp messages
        filter: `created <= "${toFilterDate(new Date())}" && chatRoomId = "${
          props.chatRoom.id
        }"`,
        // multiple instances can load at a single instance, so we have to set this to false
        // TODO set to false by default
        $autoCancel: false,
      })

      if (!items.length) {
        return
      }

      store.processMessage(items[0])
    })

    return {
      message: computed(() => store.messagePreview[props.chatRoom.id]),
    }
  },
})
</script>
