import { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: {
      name: 'login',
    },
  },
  {
    path: '/login',
    component: () => import('pages/LoginPage.vue'),
    name: 'login',
  },

  {
    path: '/home',
    name: 'home',
    component: () => import('layouts/chat/ChatLayout.vue'),
    children: [
      {
        path: '',
        name: 'chatIndex',
        component: () => import('pages/chat/IndexChatPage.vue'),
      },
      {
        path: ':chatRoomId',
        name: 'chat',
        component: () => import('pages/chat/ChatPage.vue'),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
