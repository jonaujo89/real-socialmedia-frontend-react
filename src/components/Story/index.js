import React from 'react'
import PropTypes from 'prop-types'
import {
  StyleSheet,
  View,
  TouchableOpacity,
} from 'react-native'
import path from 'ramda/src/path'
import Carousel from 'react-native-snap-carousel'
import Layout from 'constants/Layout'
import StepsTemplate from 'templates/Steps'
import HeaderComponent from 'components/Story/Header'
import CameraTemplate from 'templates/Camera'
import CameraHeaderTemplate from 'templates/Camera/Header'
import TextOnlyComponent from 'templates/TextOnly'
import { BlurView } from '@react-native-community/blur'
import pathOr from 'ramda/src/pathOr'
import CacheComponent from 'components/Cache'
import ActionComponent from 'components/Post/Action'
import ViewShot from 'react-native-view-shot'
import * as navigationActions from 'navigation/actions'

import { withTheme } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'
import { withTranslation } from 'react-i18next'

const StoryCarousel = ({
  ref,
  theme,
  countStories,
  currentStory,
  onNextStory,
  onPrevStory,
  onCloseStory,
  createTextPostRef,
  getTextPostRef,
  textPostRefs,
  navigation,
  postsShareRequest,
  postsOnymouslyLikeRequest,
  postsDislikeRequest,
}) => ({
  item: user,
  index,
}) => {
  const styling = styles(theme)

  const post = pathOr(0, ['stories', 'items', currentStory], user)

  const handlePostShare = () => {
    if (post.postType === 'TEXT_ONLY') {
      textPostRef.capture()
    }

    if (post.postType === 'IMAGE') {
      navigationActions.navigatePostShare(navigation, { post })()
    }
  }

  const onCapture = (renderUri) => {
    navigationActions.navigatePostShare(navigation, { post, renderUri })()
  }

  if (!post) {
    return null
  }

  const textPostRef = getTextPostRef(post)
  const viewshotRef = element => textPostRefs.current[post.postId] = element

  return (
    <View style={styling.sliderItem}>
      <View style={styling.backdrop} />
      <BlurView style={styling.blur} />

      <CameraTemplate
        steps={(
          <StepsTemplate steps={user.stories.items.length} currentStep={currentStory} />
        )}
        header={(
          <CameraHeaderTemplate
            content={(
              <HeaderComponent story={post} usersGetProfile={{ data: user }} />
            )}
            handleClosePress={onCloseStory}
          />
        )}
        content={(
          <React.Fragment>
            {post.postType === 'IMAGE' ?
              <CacheComponent
                thread="story"
                images={[
                  [path(['image', 'url480p'])(post), true],
                  [path(['image', 'url4k'])(post), true],
                ]}
                fallback={path(['image', 'url4k'])(post)}
                priorityIndex={1}
                resizeMode="contain"
              />
            : null}

            {post.postType === 'TEXT_ONLY' ?
              <ViewShot ref={viewshotRef} onCapture={onCapture}>
                <TextOnlyComponent
                  text={post.text}
                />
              </ViewShot>
            : null}
          </React.Fragment>
        )}
        footer={null}
        selector={(
          <ActionComponent
            user={user}
            post={post}
            postsShareRequest={postsShareRequest}
            postsOnymouslyLikeRequest={postsOnymouslyLikeRequest}
            postsDislikeRequest={postsDislikeRequest}
            handlePostShare={handlePostShare}
          />
        )}
        wrapper={(
          <React.Fragment>
            <TouchableOpacity style={styling.wrapperLeft} onPress={onPrevStory} />
            <TouchableOpacity style={styling.wrapperRight} onPress={onNextStory} />
          </React.Fragment>
        )}
      />
    </View>
  )
}

const Story = ({
  t,
  theme,
  userId,
  usersGetFollowedUsersWithStories,
  storyRef,
  countStories,
  currentStory,
  onNextStory,
  onPrevStory,
  onCloseStory,
  onSnapItem,
  createTextPostRef,
  getTextPostRef,
  textPostRefs,
  postsShareRequest,
  postsOnymouslyLikeRequest,
  postsDislikeRequest,
}) => {
  const styling = styles(theme)
  const navigation = useNavigation()
  
  return (
    <View style={styling.root} key={currentStory}>
      <View style={styling.backdrop} />
      <BlurView style={styling.blur} />

      <Carousel
        firstItem={usersGetFollowedUsersWithStories.data.findIndex(user => user.userId === userId)}
        ref={storyRef}
        data={usersGetFollowedUsersWithStories.data}
        renderItem={StoryCarousel({
          storyRef,
          theme,
          countStories,
          currentStory,
          onNextStory,
          onPrevStory,
          onCloseStory,
          createTextPostRef,
          getTextPostRef,
          textPostRefs,
          navigation,
          postsShareRequest,
          postsOnymouslyLikeRequest,
          postsDislikeRequest,
        })}
        sliderWidth={Layout.window.width}
        itemWidth={Layout.window.width}
        removeClippedSubviews={false}
        slideStyle={{
          margin: 0,
          padding: 0,
        }}
        inactiveSlideScale={1}
        inactiveSlideOpacity={1}
        layout="stack"
        onScrollIndexChanged={onSnapItem}
      />
    </View>
  )
}

const styles = theme => StyleSheet.create({
  root: {
    flex: 1,
  },
  photo: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
  },
  wrapperLeft: {
    position: 'absolute',
    top: 120,
    left: 0,
    bottom: 120,
    zIndex: 1,
    width: '30%',
  },
  wrapperRight: {
    position: 'absolute',
    top: 120,
    right: 0,
    bottom: 120,
    zIndex: 1,
    width: '70%',
  },
  footer: {
    height: 60,
  },
  sliderItem: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    width: '100%',
    height: '100%',
    backgroundColor: theme.colors.backgroundPrimary,
    opacity: 0.6,
  },
  blur: {
    ...StyleSheet.absoluteFill,
    width: '100%',
    height: '100%',
  },
  steps: {
    ...StyleSheet.absoluteFill,
    zIndex: 1,
    height: 50,
    paddingTop: 20,
  },
  header: {
    ...StyleSheet.absoluteFill,
    top: 50,
    zIndex: 1,
    height: 30,
    paddingHorizontal: 10,
  },
})

Story.propTypes = {
  theme: PropTypes.any,
  countStories: PropTypes.any,
  currentStory: PropTypes.any,
  onNextStory: PropTypes.any,
  onPrevStory: PropTypes.any,
  onCloseStory: PropTypes.any,
  t: PropTypes.any,
  userId: PropTypes.any,
  usersGetFollowedUsersWithStories: PropTypes.any,
  storyRef: PropTypes.any,
  onSnapItem: PropTypes.any,
}

export default withTranslation()(withTheme(Story))
