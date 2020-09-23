import { call, put, takeEvery } from 'redux-saga/effects'
import * as actions from 'store/ducks/auth/actions'
import * as constants from 'store/ducks/auth/constants'
import * as errors from 'store/ducks/auth/errors'
import * as queries from 'store/ducks/auth/queries'
import * as queryService from 'services/Query'
import {
  getAuthUserPersist,
  saveAuthUserPersist,
} from 'services/Auth'

import * as entitiesActions from 'store/ducks/entities/actions'
import * as normalizer from 'normalizer/schemas'
import * as Logger from 'services/Logger'
import path from 'ramda/src/path'

class MissingUserAttributeError extends Error {
  constructor(...args) {
    super(...args)
    this.code = 'MISSING_USER_ATTRIBUTEE_ERROR'
  }
}

/**
 * Sentry logger
 */
export function* handleAuthLogger(api) {
  const dataSelector = path(['data', 'self'])

  const data = dataSelector(api)
  const authenticated = {
    id: data.userId,
    username: data.username,
    email: data.email,
  }
  console.log(authenticated)
  yield call([Logger, 'setUser'], authenticated)
}

/**
 * Spread user data through normalized reducers
 */
export function* handleAuthDataRequestData(req, api) {
  const dataSelector = path(['data', 'self'])

  const data = dataSelector(api)
  const meta = req.meta || {}
  const payload = req.payload || {}

  const normalized = normalizer.normalizeUserGet(data)
  yield put(entitiesActions.entitiesAlbumsMerge({ data: normalized.entities.albums || {} }))
  yield put(entitiesActions.entitiesPostsMerge({ data: normalized.entities.posts || {} }))
  yield put(entitiesActions.entitiesUsersMerge({ data: normalized.entities.users || {} }))
  yield put(entitiesActions.entitiesCommentsMerge({ data: normalized.entities.comments || {} }))
  yield put(entitiesActions.entitiesImagesMerge({ data: normalized.entities.images || {} }))

  return {
    data: normalized.result,
    meta,
    payload,
  }
}

/**
 * Get user data from api and cache into asyncstorage
 */
function* onlineData() {
  const response = yield queryService.apiRequest(queries.self)
  yield saveAuthUserPersist(response)

  if (!path(['data', 'self', 'userId'])(response)) {
    throw new MissingUserAttributeError()
  }

  return response
}

/**
 * Fetch cached data from asyncstorage
 */
function* offlineData() {
  const response = yield getAuthUserPersist()

  if (!path(['data', 'self', 'userId'])(response)) {
    throw new MissingUserAttributeError()
  }

  return response
}

/**
 * Handled anonymous user creation, throws an error if user already exists
 */
function* createAnonymousUser() {
  try {
    yield queryService.apiRequest(queries.createAnonymousUser)
  } catch (error) {
    // ignore
  }
}

function* handleAuthDataRequest(payload = {}) {
  if (payload.allowAnonymous) {
    yield createAnonymousUser()
  }

  try {
    const data = yield call(onlineData)
    const next = yield call(handleAuthDataRequestData, { meta: { type: 'ONLINE' } }, data)
    yield handleAuthLogger(data)
    return next
  } catch (error) {
    const data = yield call(offlineData)
    const next = yield call(handleAuthDataRequestData, { meta: { type: 'OFFLINE' } }, data)
    yield handleAuthLogger(data)
    return next
  }
}

/**
 * Conditional user data fetching with online/offline support
 */
function* authDataRequest(req) {
  try {
    const { data, meta } = yield handleAuthDataRequest(req.payload)
    yield put(actions.authDataSuccess({
      message: errors.getMessagePayload(constants.AUTH_FLOW_SUCCESS, 'GENERIC'),
      data,
      meta,
    }))
  } catch (error) {
    yield put(actions.authDataFailure({
      message: errors.getMessagePayload(constants.AUTH_FLOW_FAILURE, 'GENERIC', error.message),
      data: {},
      meta: {},
    }))
  }
}

export default () => [
  takeEvery(constants.AUTH_DATA_REQUEST, authDataRequest),
]