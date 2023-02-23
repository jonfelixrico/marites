export default {
  addUser: 'Add user to chat',
  dialog: {
    addUser: {
      title: 'Add user to chat',
      message: 'Enter the username of the user to add to the chat',
    },

    addUserError: {
      title: 'Cannot add user',
      message: {
        notFound: 'Cannot find user with the username {username}',
        alreadyAdded: 'User {username} is already in the chat!',
        generic:
          'Something went wrong while trying to add user {username} into the chat',
      },
    },
  },

  notif: {
    addUserSucess: 'Successfully added user {username} into the chat',
  },
}
