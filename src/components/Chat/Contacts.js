import React from 'react'
import PropTypes from 'prop-types'
import {
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native'
import path from 'ramda/src/path'
import { Text, Caption } from 'react-native-paper'
import RowsComponent from 'templates/Rows'
import RowsItemComponent from 'templates/RowsItem'
import UserRowComponent from 'templates/UserRow'
import Avatar from 'templates/Avatar'
import * as navigationActions from 'navigation/actions'

import { withTheme } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'
import { withTranslation } from 'react-i18next'

const Contacts = ({
  t,
  theme,
  chatGetChats,
  loading = false,
}) => {
  const styling = styles(theme)
  const navigation = useNavigation()

  return (
    <ScrollView
      style={styling.root}
      refreshControl={
        <RefreshControl
          tintColor={theme.colors.border}
          refreshing={loading}
        />
      }
    >
      <RowsComponent items={path(['data', 'items'])(chatGetChats)}>
        {(chat) => (
          <RowsItemComponent>
            <UserRowComponent
              avatar={
                <TouchableOpacity onPress={navigationActions.navigateChatDirect(navigation, { chat, user: path(['users', 'items', '0'])(chat) })}>
                  <Avatar
                    active
                    thumbnailSource={{ uri: path(['users', 'items', '0', 'photo', 'url64p'])(chat) }}
                    imageSource={{ uri: path(['users', 'items', '0', 'photo', 'url64p'])(chat) }}
                    themeCode={path(['users', 'items', '0', 'themeCode'])(chat)}
                  />
                </TouchableOpacity>
              }
              content={
                <TouchableOpacity onPress={navigationActions.navigateChatDirect(navigation, { chat, user: path(['users', 'items', '0'])(chat) })} style={styling.user}>
                  <Text style={styling.username}>{path(['users', 'items', '0', 'username'])(chat)}</Text>
                  <Caption style={styling.fullname}>{path(['messages', 'items', '0', 'text'])(chat)}</Caption>
                </TouchableOpacity>
              }
              action={null}
            />
          </RowsItemComponent>
        )}
      </RowsComponent>
    </ScrollView>
  )
}

const styles = theme => StyleSheet.create({
  root: {
    flex: 1,
    padding: theme.spacing.base,
  },
  user: {
    paddingHorizontal: 8,
  },
  username: {
  },
  fullname: {
  },
})

Contacts.propTypes = {
  theme: PropTypes.any,
}

export default withTranslation()(withTheme(Contacts))