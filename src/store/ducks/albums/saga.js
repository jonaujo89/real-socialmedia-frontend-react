import { put, takeLatest } from 'redux-saga/effects'
import * as actions from 'store/ducks/albums/actions'
import * as queries from 'store/ducks/albums/queries'
import * as constants from 'store/ducks/albums/constants'
import * as postsActions from 'store/ducks/posts/actions'
import path from 'ramda/src/path'
import compose from 'ramda/src/compose'
import omit from 'ramda/src/omit'
import * as queryService from 'services/Query'

const postsResourcePoolMergeAlbumItems = (data) => data.reduce((acc, album) => acc.concat(album.posts.items), [])

/**
 * 
 */
function* albumsGetRequest(req) {
  try {
    const data = yield queryService.apiRequest(queries.getAlbums, req.payload)
    const dataSelector = path(['data', 'user', 'albums', 'items'])
    const metaSelector = compose(omit(['items']), path(['data', 'user', 'albums']))

    yield put(postsActions.postsResourcePoolMerge({ data: postsResourcePoolMergeAlbumItems(dataSelector(data)) }))
    yield put(actions.albumsGetSuccess({ data: dataSelector(data), payload: req.payload, meta: metaSelector(data) }))
  } catch (error) {
    yield put(actions.albumsGetFailure({ message: error.message, payload: req.payload }))
  }
}

/**
 * 
 */
function* albumsCreateRequest(req) {
  try {
    const data = yield queryService.apiRequest(queries.addAlbum, req.payload)
    const selector = path(['data', 'addAlbum'])

    yield put(actions.albumsCreateSuccess({ data: selector(data), payload: req.payload, meta: data }))
  } catch (error) {
    yield put(actions.albumsCreateFailure({ message: error.message, payload: req.payload }))
  }
}

/**
 * 
 */
function* albumsEditRequest(req) {  
  try {
    const data = yield queryService.apiRequest(queries.editAlbum, req.payload)
    const selector = path(['data', 'user', 'albums', 'items'])
    const metaSelector = compose(omit(['items']), path(['data', 'user', 'albums']))
  
    yield put(actions.albumsEditSuccess({ data: selector(data), payload: req.payload, meta: metaSelector(data) }))
  } catch (error) {
    yield put(actions.albumsEditFailure({ message: error.message }))
  }
}

/**
 * 
 */
function* albumsDeleteRequest(req) {  
  try {
    const data = yield queryService.apiRequest(queries.deleteAlbum, req.payload)
    const selector = path(['data', 'user', 'albums', 'items'])
    const metaSelector = compose(omit(['items']), path(['data', 'user', 'albums']))
    
    yield put(actions.albumsDeleteSuccess({ data: selector(data), payload: req.payload, meta: metaSelector(data) }))
  } catch (error) {
    yield put(actions.albumsDeleteFailure({ message: error.message }))
  }
}

export default () => [
  takeLatest(constants.ALBUMS_GET_REQUEST, albumsGetRequest),
  takeLatest(constants.ALBUMS_CREATE_REQUEST, albumsCreateRequest),
  takeLatest(constants.ALBUMS_EDIT_REQUEST, albumsEditRequest),
  takeLatest(constants.ALBUMS_DELETE_REQUEST, albumsDeleteRequest),
]