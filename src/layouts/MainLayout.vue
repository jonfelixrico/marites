<template>
  <q-layout view="hHh Lpr lFf">
    <q-drawer v-model="showDrawer" class="column" behavior="mobile">
      <div class="col">
        <!-- TODO make a separate component to contain main menu items -->
        <q-list>
          <q-item clickable @click="createChat">
            <q-item-section>{{ $t('mainMenu.createChat') }}</q-item-section>
          </q-item>
          <MainMenuItemJoinChat />
          <MainMenuItemShowUserCode />
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
import MainMenuItemJoinChat from 'src/components/main-menu/MainMenuItemJoinChat.vue'
import MainMenuItemShowUserCode from 'src/components/main-menu/MainMenuItemShowUserCode.vue'

export default defineComponent({
  components: { MainMenuItemJoinChat, MainMenuItemShowUserCode },

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
