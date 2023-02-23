<template>
  <q-btn icon="menu">
    <q-menu>
      <q-list>
        <ChatToolbarMenuItemAddUser />
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
