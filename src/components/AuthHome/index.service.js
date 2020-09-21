import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import * as authActions from 'store/ducks/auth/actions'
import { useNavigation } from '@react-navigation/native'
import toLower from 'ramda/src/toLower'

const AuthHomeComponentService = ({ children }) => {
  const guessUsernameType = (username) => {
    const hasEmail = /\S+@\S+\.\S+/.test(username)
    const hasPhone = /^[0-9 ()+-]+$/.test(username)

    return (() => {
      if (hasEmail) return 'email'
      if (hasPhone) return 'phone'
      return 'username'
    })()
  }

  const dispatch = useDispatch()
  const navigation = useNavigation()
  const authCheck = useSelector(state => state.auth.authCheck)
  const authGoogle = useSelector(state => state.auth.authGoogle)
  const authApple = useSelector(state => state.auth.authApple)
  const authSigninCognito = useSelector(state => state.auth.authSigninCognito)

  const authGoogleRequest = () => 
    dispatch(authActions.authGoogleRequest())

  const authAppleRequest = () => 
    dispatch(authActions.authAppleRequest())
  
  const authSigninCognitoRequest = (payload) => {
    const usernameType = guessUsernameType(payload.username)
    dispatch(authActions.authSigninCognitoRequest({
      usernameType,
      username: toLower(payload.username),
      password: payload.password,
    }))
  }
  
  const authSigninCognitoIdle = () => 
    dispatch(authActions.authSigninCognitoIdle({}))

  useEffect(() => {
    if (authGoogle.status === 'success') {
      dispatch(authActions.authCheckIdle({}))
      dispatch(authActions.authCheckRequest(authGoogle.data))
      dispatch(authActions.authGoogleIdle({}))
      dispatch(authActions.authSigninCognitoIdle({}))
    }
  }, [
    authGoogle.status,
  ])

  useEffect(() => {
    if (authApple.status === 'success') {
      dispatch(authActions.authCheckIdle({}))
      dispatch(authActions.authCheckRequest(authApple.data))
      dispatch(authActions.authAppleIdle({}))
      dispatch(authActions.authSigninCognitoIdle({}))
    }
  }, [
    authApple.status,
  ])
  
  useEffect(() => {
    if (authSigninCognito.status === 'success') {
      dispatch(authActions.authCheckRequest())
      dispatch(authActions.authSigninCognitoIdle({}))
    }

    if (authSigninCognito.status === 'failure' && authSigninCognito.nextRoute) {
      navigation.navigate(authSigninCognito.nextRoute)
      dispatch(authActions.authSigninCognitoIdle({}))
    }
  }, [
    authSigninCognito.status,
  ])

  useEffect(() => {
    const shouldRedirect = [
      'AuthHome',
      'AuthCognito',
      'AuthSignupConfirm',
    ].includes(authCheck.nextRoute)
    if (shouldRedirect) {
      navigation.navigate(authCheck.nextRoute)
    }
  }, [
    authCheck.nextRoute,
  ])

  return children({
    authCheck,
    authGoogle,
    authGoogleRequest,
    authApple,
    authAppleRequest,
    authSigninCognito,
    authSigninCognitoRequest,
    authSigninCognitoIdle,
  })
}

export default AuthHomeComponentService
