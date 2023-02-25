<template>
  <!-- TODO use appropriate dango icon -->
  <q-btn icon="menu" round flat dense>
    <q-menu>
      <q-list>
        <ChatToolbarMenuItemAddUser v-close-popup />
      </q-list>
    </q-menu>
  </q-btn>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ChatToolbarMenuItemAddUser from './ChatToolbarMenuItemAddUser.vue'

export default defineComponent({
  components: { ChatToolbarMenuItemAddUser },
})
</script>
