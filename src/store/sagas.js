import { all, takeEvery } from 'redux-saga/effects'
import signup from 'store/ducks/signup/saga'
import camera from 'store/ducks/camera/saga'
import theme from 'store/ducks/theme/saga'
import albums from 'store/ducks/albums/saga'
import chat from 'store/ducks/chat/saga'
import users from 'store/ducks/users/saga'
import layout from 'store/ducks/layout/saga'
import translation from 'store/ducks/translation/saga'
import cache from 'store/ducks/cache/saga'
import subscriptions from 'store/ducks/subscriptions/saga'

import auth from 'store/ducks/auth/saga'
import authCheck from 'store/ducks/auth/saga/authCheck'
import authSigninCognito from 'store/ducks/auth/saga/authSigninCognito'
import authSigninGoogle from 'store/ducks/auth/saga/authSigninGoogle'
import authUpgradeGoogle from 'store/ducks/auth/saga/authUpgradeGoogle'
import authSigninApple from 'store/ducks/auth/saga/authSigninApple'

import posts from 'store/ducks/posts/saga'
import postsCreate from 'store/ducks/posts/saga/postsCreate'
import postsShare from 'store/ducks/posts/saga/postsShare'
import postsReportPostViews from 'store/ducks/posts/saga/postsReportPostViews'

import * as Logger from 'services/Logger'
import path from 'ramda/src/path'

const captureErrors = (payload) => {
  const message = path(['payload', 'message'])(payload)
  const type = path(['type'])(payload)

  Logger.withScope(scope => {
    scope.setExtra('message', message)
    Logger.captureMessage(type)
  })
}

export default function* rootSaga(persistor) {
  yield all([]
    .concat(signup())
    .concat(camera())
    .concat(theme())
    .concat(albums())
    .concat(chat())
    .concat(users())
    .concat(layout())
    .concat(translation())
    .concat(cache())
    .concat(subscriptions())

    .concat(auth(persistor))
    .concat(authCheck(persistor))
    .concat(authSigninCognito(persistor))
    .concat(authSigninGoogle(persistor))
    .concat(authUpgradeGoogle(persistor))
    .concat(authSigninApple(persistor))

    .concat(posts())
    .concat(postsCreate())
    .concat(postsShare())
    .concat(postsReportPostViews())

    .concat([
      takeEvery(action => /FAILURE$/.test(action.type), captureErrors),
    ]),
  )
}
