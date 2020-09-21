import { put, getContext, takeEvery } from 'redux-saga/effects'
import path from 'ramda/src/path'
import {
  federatedAppleSignin,
} from 'services/AWS'
import {
  saveAppleSigninPersist,
  getAppleSigninPersist,
} from 'services/Auth'
import * as actions from 'store/ducks/auth/actions'
import * as constants from 'store/ducks/auth/constants'
import * as errors from 'store/ducks/auth/errors'

/**
 *
 */
function* mergeAppleCache(apple) {
  const cachedAppleUser = yield getAppleSigninPersist()
  const isSameCachedUser = path(['user', 'id'])(apple) === path(['user', 'id'])(cachedAppleUser)
  const isNewAppleUser = path(['user', 'email'])(apple)
  const isCachedAppleUser = path(['user', 'email'])(cachedAppleUser)

  if (isNewAppleUser) {
    yield saveAppleSigninPersist(apple)
    return apple
  } else if (isCachedAppleUser && isSameCachedUser) {
    return ({ ...apple, user: ({ ...apple.user, name: cachedAppleUser.user.name, email: cachedAppleUser.user.email }) })
  } else {
    return apple
  }
}

function* handleAuthAppleRequest() {
  const AwsAuth = yield getContext('AwsAuth')

  const apple = yield federatedAppleSignin()
  const cached = yield mergeAppleCache(apple)

  const userPayload = {
    id: apple.user.id,
    name: cached.user.name,
    email: cached.user.email,
    authProvider: 'APPLE',
    token: apple.token,
  }

  yield AwsAuth.federatedSignIn('appleid.apple.com', {
    token: apple.token,
    expires_at: apple.expires_at,
  }, userPayload)

  return apple
}

/**
 *
 */
function* authSigninAppleRequest(req) {
  try {
    const data = yield handleAuthAppleRequest(req.payload)
    yield put(actions.authSigninAppleSuccess({
      message: errors.getMessagePayload(constants.AUTH_SIGNIN_APPLE_SUCCESS, 'GENERIC'),
      data,
    }))
  } catch (error) {
    if (error.message && error.message.includes('The user canceled the sign in request')) {
      yield put(actions.authSigninAppleFailure({
        message: errors.getMessagePayload(constants.AUTH_SIGNIN_APPLE_FAILURE, 'CANCELED', error.message),
      }))
    } else {
      yield put(actions.authSigninAppleFailure({
        message: errors.getMessagePayload(constants.AUTH_SIGNIN_APPLE_FAILURE, 'GENERIC', error.message),
      }))
    }
  }
}

export default () => [
  takeEvery(constants.AUTH_SIGNIN_APPLE_REQUEST, authSigninAppleRequest),
]