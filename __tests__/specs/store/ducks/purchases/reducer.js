import { combineReducers } from 'redux'
import { applyActions } from 'tests/utils/helpers'
import purchases from 'store/ducks/purchases/reducer'
import * as actions from 'store/ducks/purchases/actions'
import * as selectors from 'store/ducks/purchases/selectors'

const reducer = combineReducers({ purchases })
const error = new Error('Error')

describe('Purchases reducer', () => {
  it('initial state', () => {
    const state = reducer(undefined, { type: 'MOCK_ACTION' })

    expect(selectors.purchasesRequest(state)).toEqual({
      error: '',
      status: 'idle',
    })
  })

  it('loading state', () => {
    const state = reducer(undefined, actions.purchaseRequest())

    expect(selectors.purchasesRequest(state)).toEqual({
      error: '',
      status: 'loading',
    })
  })

  it('error state', () => {
    const state = reducer(undefined, actions.purchaseFailure(error.message))

    expect(selectors.purchasesRequest(state)).toEqual({
      error: 'Error',
      status: 'failure',
    })
  })

  it('clear error on request', () => {
    const state = applyActions([
      actions.purchaseFailure(error.message),
      actions.purchaseRequest(),
    ], reducer) 

    expect(selectors.purchasesRequest(state)).toEqual({
      error: '',
      status: 'loading',
    })
  })
})
