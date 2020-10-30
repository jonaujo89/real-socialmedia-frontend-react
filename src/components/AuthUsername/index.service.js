import { useEffect, useCallback, useContext } from 'react'
import * as signupActions from 'store/ducks/signup/actions'
import * as navigationActions from 'navigation/actions'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigation } from '@react-navigation/native'
import { ThemeContext } from 'services/providers/Theme'
import trim from 'ramda/src/trim'
import compose from 'ramda/src/compose'
import toLower from 'ramda/src/toLower'
import pathOr from 'ramda/src/pathOr'
import { logEvent } from 'services/Analytics'
import { pageHeaderLeft } from 'navigation/options'
import * as authSelector from 'store/ducks/auth/selectors'
import testIDs from './test-ids'

const AuthUsernameComponentService = ({ children }) => {
  const dispatch = useDispatch()
  const navigation = useNavigation()
  const { theme } = useContext(ThemeContext)
  const authUserId = useSelector(authSelector.authUserIdSelector)

  const signupUsername = useSelector(state => state.signup.signupUsername)

  const handleFormSubmit = (payload) => {
    logEvent('SIGNUP_CHECK_REQUEST')
    dispatch(signupActions.signupUsernameRequest(payload))
  }

  /**
   * Navigation state reset on back button press
   */
  const handleClose = () => {
    dispatch(signupActions.signupUsernameIdle({}))
    dispatch(signupActions.signupCheckIdle({}))
  }

  const handleGoBack = useCallback(() => {
    if (authUserId) {
      navigationActions.navigateApp(navigation)
    } else {
      navigationActions.navigateAuthHome(navigation)
    }

    handleClose()
  }, [])

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => pageHeaderLeft({ 
        testID: testIDs.header.backBtn, 
        onPress: handleGoBack, 
        theme,
      }),
    })
  }, [])

  const formSubmitLoading = signupUsername.status === 'loading'
  const formSubmitDisabled = signupUsername.status === 'loading'
  const formErrorMessage = signupUsername.error.text

  const formInitialValues = {
    username: signupUsername.payload.username,
  }

  const handleFormTransform = (values) => ({
    username: compose(trim, toLower, pathOr('', ['username']))(values),
  })

  const handleErrorClose = handleClose

  return children({
    formErrorMessage,
    handleFormSubmit,
    handleFormTransform,
    handleErrorClose,
    formSubmitLoading,
    formSubmitDisabled,
    formInitialValues,
  })
}

export default AuthUsernameComponentService
