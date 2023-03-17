export default {
  joinChat: 'Join chat',
  createChat: 'Create chat',
  showUserCode: 'Show my user code',

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

    userCodeShow: {
      title: 'Show user code',
      message: 'Your user code is {userCode}',

      reset: 'Reset my user code',
    },

    userCodeResetConfirm: {
      title: 'Reset user code',
      message:
        'Your current code will no longer be valid once you proceed. You will be given a new user code instead. Proceed?',

      ok: 'Yes, reset my code',
      cancel: 'No',
    },

    userCodeResetSuccess: {
      title: 'Reset user code',
      message:
        'Your user code has been reset. Your new user code is {userCode}',
    },
  },

  notif: {
    joinChatSuccess: 'You are now a member of {chatName}',
  },
}
