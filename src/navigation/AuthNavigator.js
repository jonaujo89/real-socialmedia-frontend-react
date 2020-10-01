import React from 'react'
import PropTypes from 'prop-types'
import { createStackNavigator } from '@react-navigation/stack'
import { withTheme } from 'react-native-paper'

import * as navigationOptions from 'navigation/options'
import SignupNavigator from 'navigation/Auth/Signup'
import SigninNavigator from 'navigation/Auth/Signin'
import ForgotNavigator from 'navigation/Auth/Forgot'

import AuthHomeScreen from 'screens/AuthHomeScreen'
import AuthUsernameScreen from 'screens/AuthUsernameScreen'
import AuthPasswordScreen from 'screens/AuthPasswordScreen'
import AuthPhoneConfirmScreen from 'screens/AuthPhoneConfirmScreen'
import AuthEmailConfirmScreen from 'screens/AuthEmailConfirmScreen'
import VerificationScreen from 'screens/VerificationScreen'
import CameraScreen from 'screens/CameraScreen'
import AuthForgotConfirmScreen from 'screens/AuthForgotConfirmScreen'
import AuthCognitoScreen from 'screens/AuthCognitoScreen'

const AuthNavigator = ({ theme }) => {
  const Stack = createStackNavigator()

  const stackScreenOnboardProps = navigationOptions.stackScreenOnboardProps({ theme })
  const stackScreenBlankProps = navigationOptions.stackScreenBlankProps({ theme })
  const stackNavigatorDefaultProps = navigationOptions.stackNavigatorDefaultProps({ theme })
  const stackScreenAuthProps = navigationOptions.stackScreenAuthProps({ theme })
  const stackScreenAuthModalProps = navigationOptions.stackScreenAuthModalProps({ theme })

  return (
    <Stack.Navigator {...stackNavigatorDefaultProps}>
      <Stack.Screen
        name="AuthHome"
        component={AuthHomeScreen}
        {...stackScreenOnboardProps}
      />

      <Stack.Screen
        name="Signup"
        component={SignupNavigator}
        {...stackScreenAuthProps({ options: { title: 'Signup', headerLeft: navigationOptions.pageHeaderLeft, gestureEnabled: true } })}
      />

      <Stack.Screen
        name="Signin"
        component={SigninNavigator}
        {...stackScreenAuthProps({ options: { title: 'Log In', headerLeft: navigationOptions.pageHeaderLeft, gestureEnabled: true } })}
      />

      <Stack.Screen
        name="Forgot"
        component={ForgotNavigator}
        {...stackScreenAuthProps({ options: { title: 'Forgot', headerLeft: navigationOptions.pageHeaderLeft, gestureEnabled: true } })}
      />

      <Stack.Screen
        name="AuthUsername"
        component={AuthUsernameScreen}
        {...stackScreenAuthProps({ options: { title: 'Signup', headerLeft: navigationOptions.pageHeaderLeft, gestureEnabled: true } })}
      />

      <Stack.Screen
        name="AuthPassword"
        component={AuthPasswordScreen}
        {...stackScreenAuthProps({ options: { title: 'Signup', headerLeft: navigationOptions.pageHeaderLeft, gestureEnabled: true } })}
      />

      <Stack.Screen
        name="AuthEmailConfirm"
        component={AuthEmailConfirmScreen}
        {...stackScreenAuthProps({ options: { title: 'Enter 6-digit code', headerLeft: navigationOptions.pageHeaderLeft, gestureEnabled: true } })}
      />

      <Stack.Screen
        name="AuthPhoneConfirm"
        component={AuthPhoneConfirmScreen}
        {...stackScreenAuthProps({ options: { title: 'Enter 6-digit code', headerLeft: navigationOptions.pageHeaderLeft, gestureEnabled: true } })}
      />

      <Stack.Screen
        name="Verification"
        component={VerificationScreen}
        {...stackScreenAuthModalProps}
      />

      <Stack.Screen
        name="AuthCamera"
        component={CameraScreen}
        {...stackScreenBlankProps}
      />

      <Stack.Screen
        name="AuthForgotConfirm"
        component={AuthForgotConfirmScreen}
        {...stackScreenAuthProps({ options: { title: 'Forgot Confirm', headerLeft: navigationOptions.pageHeaderLeft, gestureEnabled: true } })}
      />

      <Stack.Screen
        name="AuthCognito"
        component={AuthCognitoScreen}
        {...stackScreenAuthProps({ options: { title: 'Signup', headerLeft: null } })}
      />
    </Stack.Navigator>
  )
}

AuthNavigator.propTypes = {
  theme: PropTypes.any,
}

export default withTheme(AuthNavigator)