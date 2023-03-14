export default {
  addUser: 'Add user to chat',
  showJoinCode: 'Show join code',

  dialog: {
    addUser: {
      title: 'Add user to chat',
      message: 'Enter the id of the user to add to the chat',
      ok: 'Add user',
    },

    addUserError: {
      title: 'Cannot add user',
      message: {
        notFound: 'Cannot find user id {userId}',
        alreadyAdded: 'User id {userId} is already in the chat!',
        generic:
          'Something went wrong while trying to add user with id {userId} into the chat',
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
  },

  notif: {
    joinCodeCopied: 'Join code has been copied',
  },
}
