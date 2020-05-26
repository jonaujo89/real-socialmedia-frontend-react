import { useEffect, useState } from 'react'
import { Keyboard } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import * as chatActions from 'store/ducks/chat/actions'
import * as authSelector from 'store/ducks/auth/selectors'
import { v4 as uuid } from 'uuid'
import { useNavigation, useRoute } from '@react-navigation/native'
import path from 'ramda/src/path'
import { ifIphoneX } from 'react-native-iphone-x-helper'
import * as chatSelector from 'store/ducks/chat/selectors'
import * as usersSelector from 'store/ducks/users/selectors'

const ChatDirectService = ({ children }) => {
  const dispatch = useDispatch()
  const navigation = useNavigation()
  const route = useRoute()

  const chatId = (
    path(['params', 'chat', 'chatId'])(route) ||
    path(['params', 'user', 'directChat', 'chatId'])(route)
  )
  const userId = path(['params', 'user', 'userId'])(route)

  const user = useSelector(authSelector.authUserSelector)
  const usersGetTrendingUsers = useSelector(usersSelector.usersGetTrendingUsersSelector())
  const chatCreateDirect = useSelector(state => state.chat.chatCreateDirect)
  const chatAddMessage = useSelector(state => state.chat.chatAddMessage)
  const chatGetChat = useSelector(chatSelector.chatGetChatSelector(chatId))

  useEffect(() => {
    dispatch(chatActions.chatGetChatRequest({ chatId }))
  }, [])

  useEffect(() => {
    dispatch(chatActions.chatGetChatRequest({ chatId }))
  }, [chatAddMessage.status])

  useEffect(() => {
    if (chatCreateDirect.status === 'success') {
      navigation.setParams({
        chat: chatCreateDirect.data,
      })
      dispatch(chatActions.chatCreateDirectIdle())
    }
  }, [chatCreateDirect.status])

  const chatCreateDirectRequest = () => {
    const chatId = uuid()
    const messageId = uuid()
    dispatch(chatActions.chatCreateDirectRequest({
      chatId,
      userId,
      messageId,
      messageText: '👋',
    }))
  }

  const chatAddMessageRequest = (payload) => {
    const messageId = uuid()
    dispatch(chatActions.chatAddMessageRequest({
      chatId,
      messageId,
      text: payload.text,
    }))
  }

  /**
   * Keyboard movement calculator 
   */
  const [offset, setOffset] = useState(0)

  const keyboardWillShow = (event) => {
    setOffset(event.endCoordinates.height - ifIphoneX(40, 0) + 12)
  }

  const keyboardWillHide = (event) => {
    setOffset(0)
  }

  useEffect(() => {
    const keyboardWillShowSub = Keyboard.addListener('keyboardWillShow', keyboardWillShow)
    const keyboardWillHideSub = Keyboard.addListener('keyboardWillHide', keyboardWillHide)

    return () => {
      keyboardWillShowSub.remove()
      keyboardWillHideSub.remove()
    }
  }, [])

  const marginBottom = offset + ifIphoneX(40, 0)

  return children({
    user,
    chatId,
    chatCreateDirect,
    chatAddMessage,
    chatAddMessageRequest,
    chatCreateDirectRequest,
    usersGetTrendingUsers,
    chatGetChat,
    marginBottom,
  })
}

export default ChatDirectService
