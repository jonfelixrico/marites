<template>
  <q-layout view="hHh Lpr lFf">
    <q-drawer v-model="showDrawer" class="column" behavior="mobile">
      <div class="col">
        <q-list>
          <q-item clickable @click="createChat">
            <q-item-section> Create chat </q-item-section>
          </q-item>
          <q-item clickable @click="joinChat">
            <q-item-section> Join chat </q-item-section>
          </q-item>
          <q-item
            clickable
            @click="promptLogOut"
            class="text-red text-weight-bold"
          >
            <q-item-section>
              {{ $t('session.logOut') }}
            </q-item-section>
          </q-item>
        </q-list>
      </div>
      <div>{{ $t('general.buildLabel', { version }) }}</div>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent, computed, onUnmounted } from 'vue'
import { useMainLayoutStore } from 'stores/main-layout.store'
import { useCreateChat } from './create-chat.composable'
import { useSessionService } from 'src/services/session.service'
import { useJoinChat } from './join-chat.composable'
import { getBuildVersion } from 'src/utils/app.util'

export default defineComponent({
  setup() {
    const createChat = useCreateChat()
    const joinChat = useJoinChat()

    const store = useMainLayoutStore()

    const showDrawer = computed({
      get() {
        return store.showDrawer
      },

      set(value: boolean) {
        store.setShowDrawer(value)
      },
    })

    onUnmounted(() => {
      showDrawer.value = false
    })

    const { promptLogOut } = useSessionService()

    return {
      createChat,
      promptLogOut,
      joinChat,
      showDrawer,
      version: getBuildVersion(),
    }
  },
})
</script>
