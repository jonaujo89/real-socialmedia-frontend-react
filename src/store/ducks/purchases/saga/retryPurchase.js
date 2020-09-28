import * as RNIap from 'react-native-iap'
import isEmpty from 'ramda/src/isEmpty'
import { put, call, delay, race, all } from 'redux-saga/effects'
import * as actions from 'store/ducks/purchases/actions'
import purchaseRequest, { purchaseComplete } from 'store/ducks/purchases/saga/purchase'
import * as Logger from 'services/Logger'

/**
 *
 */
function* completePendingTransactions(transactions) {
  const { timeout } = yield race({
    timeout: delay(10000),
    done: all(transactions.map((purchase) => call(purchaseComplete, purchase))),
  })

  if (timeout) {
    throw new Error('Finish pending purchases request timeout')
  }
}

/**
 *
 */
function* retryPurchaseRequest(req) {
  try {
    const { transactions } = yield race({
      timeout: delay(10000),
      transactions: call([RNIap, 'getPendingPurchasesIOS']),
    })

    if (transactions === undefined || isEmpty(transactions)) {
      yield call(purchaseRequest, req.payload)
    } else {
      yield call(completePendingTransactions, transactions)
    }

    yield put(actions.retryPurchaseSuccess())
  } catch (error) {
    yield call([RNIap, 'clearTransactionIOS'])
    yield put(actions.retryPurchaseFailure(error.message))
    yield call([Logger, 'captureException'], error)
  }
}

export default retryPurchaseRequest
