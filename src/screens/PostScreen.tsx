import { observer } from "mobx-react-lite";
import React from "react";
import { BaseScreen } from "./BaseScreen";
import ImageModal from "react-native-image-modal";
import { PRIMARY_COLOR, WINDOW_HEIGHT, WINDOW_WIDTH } from "../consts";
import { Avatar, View } from "@gluestack-ui/themed";
import { AvatarFallbackText } from "@gluestack-ui/themed";
import { RobotoText } from "../components/common";

interface PostCommentAvatarColumnProps {
  authorName: string
}

const PostCommentAvatarColumn = observer((props: PostCommentAvatarColumnProps) => {
  return (
    <View
      marginTop={10}
    >
      <Avatar bg={PRIMARY_COLOR} borderRadius="$full">
        <AvatarFallbackText>{props.authorName}</AvatarFallbackText>
      </Avatar>
    </View>
  )
})

interface PostCommentContentColumnProps {
  authorName: string
  text: string
}

const PostCommentContentColumn = observer((props: PostCommentContentColumnProps) => {
  return (
    <View
      flexDirection="column"
      margin={10}
      flexShrink={1}
    >
      <View>
        <RobotoText
          fontSize={18}
          fontWeight='bold'
        >
          {props.authorName}
        </RobotoText>
      </View>

      <View
        flex={1}
      >
        <RobotoText
          width="100%"
          flex={1}
          flexWrap="wrap"
          flexShrink={1}
          fontSize={16}
        >
          {props.text}
        </RobotoText>
      </View>
    </View>
  )
})

interface PostCommentProps extends 
  PostCommentAvatarColumnProps, 
  PostCommentContentColumnProps {

}

export const PostComment = observer((props: PostCommentProps) => {

  return (
    <View
      flexDirection="row"
      backgroundColor="white"
      padding={10}
      borderRadius={15}
    >
      <PostCommentAvatarColumn authorName={props.authorName}/>
      <PostCommentContentColumn authorName={props.authorName} text={props.text}/>
    </View>
  )
})

interface PostScreenProps {
  navigation: any
}

export const PostScreen = observer((props: PostScreenProps) => {
  return (
    <BaseScreen
      navigation={props.navigation}
    >
      <View
        flexDirection='column' 
        gap={20}
        alignContent='center'
        marginLeft={20}
        marginRight={20}
        marginBottom={100}
      >
        <ImageModal
          style={{
            width: WINDOW_WIDTH - 30,
            height: WINDOW_HEIGHT / 2,
            alignSelf: 'center'
          }}
          source={{uri: "https://via.placeholder.com/600/f9cee5"}}
          resizeMode="contain"
        />

        <PostComment
          authorName="nikstarling"
          text="this is some long-long post text. It's purpose is to test rendering of comment"
        />
      </View>
    </BaseScreen>
  )
})
