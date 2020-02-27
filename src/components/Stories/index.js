import React from 'react'
import PropTypes from 'prop-types'
import {
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native'
import path from 'ramda/src/path'
import Avatar from 'templates/Avatar'
import { Caption } from 'react-native-paper'

import { withTheme } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'

const Stories = ({
  theme,
  authUser,
  usersGetFollowedUsersWithStories,
}) => {
  const styling = styles(theme)
  const { t } = useTranslation()
  const navigation = useNavigation()

  const handleUserStoryPress = (user) => () => {
    navigation.navigate('Story', {
      user,
      usersGetFollowedUsersWithStories,
    })
  }

  return (
    <ScrollView
      style={styling.root}
      horizontal
      showsHorizontalScrollIndicator={false}
    >
      <TouchableOpacity
        key={authUser.userId}
        onPress={() => navigation.navigate('Camera')}
        style={styling.story}
      >
        <Avatar
          active
          size="medium"
          thumbnailSource={{ uri: path(['photoUrl64p'])(authUser) }}
          imageSource={{ uri: path(['photoUrl480p'])(authUser) }}
          icon={true}
        />
        <Caption style={styling.username}>{path(['username'])(authUser)}</Caption>
      </TouchableOpacity>

      {(usersGetFollowedUsersWithStories.data || []).map((user, key) => (
        <TouchableOpacity
          key={key}
          onPress={handleUserStoryPress(user)}
          style={styling.story}
        >
          <Avatar
            active
            size="medium"
            thumbnailSource={{ uri: path(['photoUrl64p'])(user) }}
            imageSource={{ uri: path(['photoUrl480p'])(user) }}
            themeCode={path(['themeCode'])(user)}
          />
          <Caption style={styling.username}>{path(['username'])(user)}</Caption>
        </TouchableOpacity>
      ))}
    </ScrollView>
  )
}

const styles = theme => StyleSheet.create({
  root: {
    height: 115,
    padding: theme.spacing.base,
    backgroundColor: theme.colors.backgroundPrimary,
  },
  story: {
    alignItems: 'center',
    marginRight: 10,
  },
  username: {
    marginTop: 6,
    color: theme.colors.text,
  },
})

Stories.propTypes = {
  theme: PropTypes.any,
  authUser: PropTypes.any,
  usersGetFollowedUsersWithStories: PropTypes.any,
}

export default withTheme(Stories)
