import { handleActions } from 'redux-actions'
import update from 'immutability-helper'
import * as constants from 'store/ducks/subscriptions/constants'

const initialState = {
  subscriptionsMain: {
    data: [],
    status: 'idle',
  },
  subscriptionsPoll: {
    data: [],
    status: 'idle',
  },
}

/**
 *
 */
const subscriptionsMainRequest = (state) => update(state, {
  subscriptionsMain: {
    status: { $set: 'loading' },
  },
})

const subscriptionsMainSuccess = (state, action) => update(state, {
  subscriptionsMain: {
    data: { $set: state.subscriptionsMain.data.filter(item => item !== action.payload.data).concat(action.payload.data) },
    status: { $set: 'success' },
  },
})

const subscriptionsMainFailure = (state, action) => update(state, {
  subscriptionsMain: {
    data: { $set: state.subscriptionsMain.data.filter(item => item !== action.payload.data) },
    status: { $set: 'failure' },
  },
})

const subscriptionsMainIdle = (state, action) => update(state, {
  subscriptionsMain: {
    data: { $set: state.subscriptionsMain.data.filter(item => item !== action.payload.data) },
    status: { $set: 'idle' },
  },
})

/**
 *
 */
const subscriptionsPollRequest = (state) => update(state, {
  subscriptionsPoll: {
    status: { $set: 'loading' },
  },
})

const subscriptionsPollSuccess = (state, action) => update(state, {
  subscriptionsPoll: {
    data: { $set: action.payload.data },
    status: { $set: 'success' },
  },
})

const subscriptionsPollFailure = (state) => update(state, {
  subscriptionsPoll: {
    status: { $set: 'failure' },
  },
})

const subscriptionsPollIdle = (state) => update(state, {
  subscriptionsPoll: {
    data: { $set: initialState.themePreview.data },
    status: { $set: 'idle' },
  },
})

export default handleActions({
  [constants.SUBSCRIPTIONS_MAIN_REQUEST]: subscriptionsMainRequest,
  [constants.SUBSCRIPTIONS_MAIN_SUCCESS]: subscriptionsMainSuccess,
  [constants.SUBSCRIPTIONS_MAIN_FAILURE]: subscriptionsMainFailure,
  [constants.SUBSCRIPTIONS_MAIN_IDLE]: subscriptionsMainIdle,

  [constants.SUBSCRIPTIONS_POLL_REQUEST]: subscriptionsPollRequest,
  [constants.SUBSCRIPTIONS_POLL_SUCCESS]: subscriptionsPollSuccess,
  [constants.SUBSCRIPTIONS_POLL_FAILURE]: subscriptionsPollFailure,
  [constants.SUBSCRIPTIONS_POLL_IDLE]: subscriptionsPollIdle,
}, initialState)
