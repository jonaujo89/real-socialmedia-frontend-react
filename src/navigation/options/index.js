import React from 'react'
import { TouchableOpacity, StyleSheet } from 'react-native'
import { HeaderStyleInterpolators, CardStyleInterpolators, TransitionPresets } from '@react-navigation/stack'
import ViewPagerAdapter from 'react-native-tab-view-viewpager-adapter'

import * as navigationActions from 'navigation/actions'
import path from 'ramda/src/path'
import Layout from 'constants/Layout'

import LogoIcon from 'assets/svg/header/Logo'
import CameraIcon from 'assets/svg/header/Camera'
import DirectIcon from 'assets/svg/header/Direct'
import BackIcon from 'assets/svg/header/Back'

import * as authSelector from 'store/ducks/auth/selectors'
import { connect } from 'react-redux'

export const pageHeaderLeft = ({ onPress, testID = null, theme }) => {
  if (!onPress) {
    return null
  }

  return (
    <TouchableOpacity testID={testID} style={styles.button} onPress={onPress}>
      <BackIcon fill={path(['colors', 'primaryIcon'], theme)} />
    </TouchableOpacity>
  )
}

export const chatHeaderLeft = ({ navigation, theme }) => () => (
  <TouchableOpacity style={styles.button} onPress={navigationActions.navigateHome(navigation)}>
    <BackIcon fill={path(['colors', 'primaryIcon'], theme)} />
  </TouchableOpacity>
)

const homeHeaderLeft = ({ theme, navigation }) => () => (
  <TouchableOpacity style={styles.button} onPress={navigationActions.navigateCamera(navigation)}>
    <CameraIcon fill={path(['colors', 'primaryIcon'], theme)} />
  </TouchableOpacity>
)

const homeHeaderTitle = ({ theme }) => () => <LogoIcon height="28" fill={path(['colors', 'primaryIcon'], theme)} />

const mapStateToProps = (state, ownProps) => ({ user: authSelector.authUserSelector(state), ...ownProps })
const Next = connect(mapStateToProps)(({ user, theme, navigation }) => (
  <TouchableOpacity style={styles.chatButton} onPress={navigationActions.navigateChat(navigation)}>
    <DirectIcon fill={path(['colors', 'primaryIcon'], theme)} user={user} />
  </TouchableOpacity>
))

const homeHeaderRight = ({ theme, navigation }) => () => (
  <Next theme={theme} navigation={navigation} />
)

const AuthNavigationComponent = ({ theme }) => ({
  headerStyle: {
    backgroundColor: theme.colors.backgroundPrimary,
    shadowRadius: 0,
    shadowOffset: {
      height: 0,
    },
    borderBottomWidth: 0,
    shadowColor: 'transparent',
  },
  headerTitleStyle: {
    color: theme.colors.text,
  },
})

const HomeNavigationComponent = ({ navigation, theme }) => ({
  headerStyle: {
    backgroundColor: theme.colors.backgroundPrimary,
    shadowRadius: 0,
    shadowOffset: {
      height: 0,
    },
    borderBottomWidth: 0,
    shadowColor: 'transparent',
  },
  headerLeft: homeHeaderLeft({ navigation, theme }),
  headerTitle: homeHeaderTitle({ navigation, theme }),
  headerRight: homeHeaderRight({ navigation, theme }),
})

const pager = (props) => {
  const currentIndex = path(['navigationState', 'index'])(props)
  const nextIndex = path(['navigationState', 'routes', currentIndex, 'state', 'index'])(props)
  const swipeEnabled = !nextIndex || nextIndex === 0
  return <ViewPagerAdapter {...props} swipeEnabled={swipeEnabled} />
}

export const tabNavigatorDefaultProps = ({
  initialRouteName: 'Root',
  tabBar: () => null,
  lazy: true,
  sceneContainerStyle: {
    backgroundColor: 'transparent',
  },
  pager,
  gestureEnabled: false,
})

export const tabNavigatorAuthProps = ({ theme }) => ({
  sceneContainerStyle: {
    backgroundColor: theme.colors.backgroundPrimary,
  },
  tabBarOptions: {
    activeTintColor: theme.colors.text,
    inactiveTintColor: theme.colors.text,
    style: {
      backgroundColor: theme.colors.backgroundSecondary,
    },
    indicatorStyle: {
      backgroundColor: theme.colors.primary,
    },
  },
  pager,
})


export const stackNavigatorDefaultProps = ({ theme }) => ({
  screenOptions: {
    headerStyleInterpolator: HeaderStyleInterpolators.forUIKit,
  },
  cardStyle: {
    backgroundColor: theme.colors.backgroundPrimary,
  },
  gestureEnabled: 'vertical',
})

export const stackNavigatorCardProps = ({ theme }) => ({
  screenOptions: {
    gestureEnabled: true,
    cardOverlayEnabled: true,
    ...TransitionPresets.ModalPresentationIOS,
  },
  cardStyle: {
    backgroundColor: theme.colors.backgroundPrimary,
  },
  mode: 'modal',
})

/**
 * Used for Main Screens with application logo
 */
export const stackScreenDefaultProps = ({ theme }) => ({
  options: (props) => ({
    ...HomeNavigationComponent({ ...props, theme }),
    gestureResponseDistance: {
      horizontal: Layout.window.width,
      vertical: Layout.window.height,
    },
    cardStyle: {
      backgroundColor: theme.colors.backgroundPrimary,
    },
  }),
})

/**
 * Used for Main Screens with application logo
 */
export const stackScreenAuthProps = ({ theme }) => ({ options } = {}) => ({
  options: (props) => ({
    ...AuthNavigationComponent({ ...props, theme }),
    gestureEnabled: false,
    cardStyle: {
      backgroundColor: theme.colors.backgroundPrimary,
    },
    headerStyle: {
      backgroundColor: theme.colors.backgroundSecondary,
      shadowRadius: 0,
      shadowOffset: {
        height: 0,
      },
      borderBottomWidth: 0,
      shadowColor: 'transparent',
    },
    headerTitleStyle: {
      color: '#ffffff',
    },
    ...options,
  }),
})

/**
 * Used for Onboard Screens
 */
export const stackScreenOnboardProps = ({ theme }) => ({
  options: (props) => ({
    ...AuthNavigationComponent({ ...props, theme }),
    gestureEnabled: false,
    cardStyle: {
      backgroundColor: theme.colors.backgroundPrimary,
    },
    headerTitleStyle: {
      color: theme.colors.backgroundPrimary,
    },
    headerShown: false,
  }),
})

/**
 * Used for Camera without header
 */
export const stackScreenBlankProps = ({ theme }) => ({
  options: () => ({
    gestureResponseDistance: {
      horizontal: Layout.window.width,
      vertical: Layout.window.height,
    },
    cardStyle: {
      backgroundColor: theme.colors.backgroundPrimary,
    },
    headerShown: false,
  }),
})

/**
 * Used for Camera without header
 */
export const stackScreenModalProps = ({
  options: {
    gestureDirection: 'vertical',
    gestureResponseDistance: {
      horizontal: Layout.window.width,
      vertical: Layout.window.height,
    },
    cardStyle: {
      backgroundColor: 'transparent',
      gestureDirection: 'vertical',
    },
    headerShown: false,
    cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
  },
})

export const stackScreenModalStaticProps = ({
  options: () => ({
    cardStyle: {
      backgroundColor: '#000000',
    },
    gestureEnabled: false,
    headerShown: false,
    cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
  }),
})

export const stackScreenAuthModalProps = ({ theme }) => ({
  options: () => ({
    gestureDirection: 'vertical',
    gestureResponseDistance: {
      horizontal: Layout.window.width,
      vertical: Layout.window.height,
    },
    cardStyle: {
      backgroundColor: 'transparent',
      gestureDirection: 'vertical',
    },
    cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    headerStyle: {
      backgroundColor: theme.colors.backgroundPrimary,
      shadowRadius: 0,
      shadowOffset: {
        height: 0,
      },
      borderBottomWidth: 0,
      shadowColor: 'transparent',
    },
    headerTitleStyle: {
      color: theme.colors.text,
    },
  }),
})

/**
 * Used for Profile Screens without application logo but text
 */
export const stackScreenPageProps = ({ theme }) => ({ options } = {}) => ({
  options: () => {
    const backgroundColor = path(['colors', 'backgroundPrimary'])(theme)
    const color = path(['colors', 'text'])(theme)

    return {
      cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      gestureDirection: 'horizontal',
      gestureResponseDistance: {
        horizontal: Layout.window.width,
        vertical: Layout.window.height,
      },
      cardStyle: {
        backgroundColor,
      },
      headerTitleStyle: {
        color,
      },
      headerStyle: {
        backgroundColor,
        shadowRadius: 0,
        shadowOffset: {
          height: 0,
        },
        borderBottomWidth: 0,
        shadowColor: 'transparent',
      },
      headerLeft: (props) => pageHeaderLeft({ ...props, theme }),
      headerRight: () => null,
      headerTintColor: 'red',
      ...options,
    }
  },
})

/**
 * Used for Card Screens without application logo but text
 */
export const stackScreenCardProps = ({ theme }) => ({
  options: () => ({
    gestureResponseDistance: {
      horizontal: Layout.window.width,
      vertical: Layout.window.height,
    },
    cardStyle: {
      backgroundColor: theme.colors.backgroundPrimary,
    },
    cardStyleInterpolator: CardStyleInterpolators.forModalPresentationIOS,
    header: () => null,
  }),
})

export const tabNavigatorProps = ({ theme }) => {
  const activeTintColor = path(['colors', 'primaryIcon'])(theme)
  const inactiveTintColor = `${activeTintColor}90`
  const backgroundColor = path(['colors', 'backgroundPrimary'])(theme)

  return {
    tabBarOptions: {
      activeTintColor,
      inactiveTintColor,
      labelStyle: {
        fontSize: 10,
        paddingTop: 0,
      },
      style: {
        backgroundColor,
        borderTopWidth: 0,
      },
    },
  }
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 12,
  },
  chatButton: {
    paddingHorizontal: 12,
    height: 24,
  },
})
