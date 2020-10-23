import { useMemo } from 'react'
import { Linking } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigation } from '@react-navigation/native'
import * as usersActions from 'store/ducks/users/actions'
import * as navigationActions from 'navigation/actions'
import * as LinkingService from 'services/Linking'

const FeedCardsService = ({ children }) => {
  const dispatch = useDispatch()
  const navigation = useNavigation()
  const usersGetCards = useSelector((state) => state.users.usersGetCards)

  const { usersDeleteCardRequest, handleCardPress } = useMemo(
    () => ({
      usersDeleteCardRequest: ({ cardId }) => {
        dispatch(usersActions.usersGetCardsOptimistic({ cardId }))
        dispatch(usersActions.usersDeleteCardRequest({ cardId }))
      },
      handleCardPress: ({ action, cardId }) => {
        usersDeleteCardRequest({ cardId })
        LinkingService.deeplinkNavigation(navigation, navigationActions, Linking)(action)
      },
    }),
    [],
  )

  return children({
    usersGetCards,
    handleCardPress,
    usersDeleteCardRequest,
  })
}

export default FeedCardsService
