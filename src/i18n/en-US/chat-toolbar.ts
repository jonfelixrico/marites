export default {
  addUser: 'Add user to chat',
  showJoinCode: 'Show join code',
  resetJoinCode: 'Reset join code',

  dialog: {
    addUser: {
      title: 'Add user to chat',
      message: 'Enter the id of the user to add to the chat',
      ok: 'Add user',
    },

    addUserError: {
      title: 'Cannot add user',
      message: {
        notFound: 'Cannot find user associated with code {code}',
        alreadyAdded: 'User with code {code} is already in the chat!',
        generic: 'Something went wrong while trying to process code {code}',
      },
    },

    addUserSuccess: {
      title: 'User added',
      message: 'You have added user {userId} to the chat',
    },

    showJoinCode: {
      title: 'Join code',
      message: 'Please use the code {joinCode} to join this chat.',
    },

    resetJoinCodePrompt: {
      title: 'Reset join code',
      message: 'Are you sure you want to reset the join code?',
    },

    resetJoinCodeSuccess: {
      title: 'Reset join code',
      message:
        "The chat's join code has been reset. The new join code is {joinCode}",
    },
  },

  notif: {
    joinCodeCopied: 'Join code has been copied',
  },
}
