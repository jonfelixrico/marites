export default {
  joinChat: 'Join chat',
  createChat: 'Create chat',

  dialog: {
    // TODO rename to joinChatInput
    joinChat: {
      title: 'Join chat',
      message: 'Please enter the join code of the chat that you want to enter',

      error: {
        alreadyJoined: 'You already are a member of chat with code {joinCode}',
        notFound: 'No chat rooms match join code {joinCode}',
        generic:
          'Something went wrong while processing join code {joinCode}, please try again later.',
      },

      ok: 'Find chat',
      required: 'Please fill in the join code',
    },

    joinChatConfirm: {
      title: 'Join chat confirmation',
      message: 'Would you like to join {chatName}?',

      ok: 'Yes, join',
    },
  },

  notif: {
    joinChatSuccess: 'You are now a member of {chatName}',
  },
}
