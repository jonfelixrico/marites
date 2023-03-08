<template>
  <q-layout view="hHh Lpr lFf">
    <q-drawer v-model="showDrawer" class="column">
      <div class="col-auto">
        <q-btn icon="menu" round flat dense @click="showDrawer = !showDrawer" />
      </div>
      <div class="col">
        <q-list>
          <q-item clickable @click="createChat">
            <q-item-section> Create chat </q-item-section>
          </q-item>
          <q-item clickable @click="joinChat">
            <q-item-section> Join chat </q-item-section>
          </q-item>
          <q-item clickable @click="promptLogOut">
            <q-item-section>
              {{ $t('session.logOut') }}
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useCreateChat } from './create-chat.composable'
import { useSessionService } from 'src/services/session.service'
import { useJoinChat } from './join-chat.composable'

export default defineComponent({
  setup() {
    const createChat = useCreateChat()
    const joinChat = useJoinChat()

    const showDrawer = ref(true)

    const { promptLogOut } = useSessionService()

    return {
      createChat,
      showDrawer,
      promptLogOut,
      joinChat,
    }
  },
})
</script>
