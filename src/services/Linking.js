import UrlPattern from 'url-pattern'

export class MissingDeeplinkParamsError extends Error {
  constructor(...args) {
    super(...args)
    this.code = 'MISSING_DEEP_LINK_PARAMS_ERROR'
  }
}

const options = { segmentValueCharset: ':a-zA-Z0-9_-' }
 
const patterns = {
  post: new UrlPattern('*/user/(:userId)/post/(:postId)((/):action)(/)((/):actionId)(/)', options),
  profilePhoto: new UrlPattern('*/user/:userId/settings/photo(/)', options),
  inviteFriends: new UrlPattern('*/user/:userId/settings/contacts(/)', options),
  signUp: new UrlPattern('*/signup/:userId(/)', options),
}

export const deeplinkPath = (action) => {
  const [postMatch, profilePhotoMatch, inviteFriendsMatch, signUpMatch] = [
    patterns.post.match(action), 
    patterns.profilePhoto.match(action),
    patterns.inviteFriends.match(action),
    patterns.signUp.match(action),
  ]

  if (profilePhotoMatch !== null) {
    return { action: 'profilePhoto', ...profilePhotoMatch }
  }

  if (inviteFriendsMatch !== null) {
    return { action: 'inviteFriends', ...inviteFriendsMatch }
  }

  if (signUpMatch !== null) {
    return { action: 'signup', ...signUpMatch }
  }

  if (action === 'https://real.app/chat/') {
    return { action: 'chats' }
  }

  if (!postMatch || !postMatch.userId || !postMatch.postId) {
    throw new MissingDeeplinkParamsError('Missing userId or postId parameters for post endpoint')
  }

  return postMatch
}

export const deeplinkNavigation = (navigation, navigationActions, Linking) => (action) => {
  try {
    const params = deeplinkPath(action)

    /**
     * Chats screen
     */
    if (params.action === 'chats') {
      return navigationActions.navigateChat(navigation)()
    } else if (params && params.action === 'comments') {

    /**
     * Comments screen
     */
      return navigationActions.navigateNestedComments(navigation, params)()
    } else if (params && params.action === 'views') {

    /**
     * Views screen
     */
      return navigationActions.navigateNestedPostViews(navigation, params)()
    } else if (params && params.action === 'likes') {

    /**
     * Likes screen
     */
      return navigationActions.navigateNestedPostLikes(navigation, params)()
    } else if (params && !params.action) {

    /**
     * Post screen
     */
      return navigationActions.navigateNestedPost(navigation, params)()
    } else if (params && params.action === 'profilePhoto') {

      /**
       * Profile Photo Upload
       */
      return navigationActions.navigateProfilePhoto(navigation, params)()
    } else if (params && params.action === 'inviteFriends') {

      /**
       * Invite Friends
       */
      return navigationActions.navigateInviteFriends(navigation, params)()
    } else if (params && params.action === 'signup') {

      /**
       * Sign up
       */
      return navigationActions.navigateAuthUsername(navigation, params)()
    }
  } catch (error) {
    if (error.code === 'MISSING_DEEP_LINK_PARAMS_ERROR') {
      return Linking.openURL(action)
    }
  }
}
