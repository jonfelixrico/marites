<template>
  <!-- TODO use appropriate dango icon -->
  <q-btn icon="more_vert" round flat dense>
    <q-menu>
      <q-list style="width: 250px; max-width: 80vw" dense>
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
