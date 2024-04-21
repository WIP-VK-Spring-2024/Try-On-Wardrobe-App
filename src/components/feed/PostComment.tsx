import { Avatar, View } from "@gluestack-ui/themed";
import { observer } from "mobx-react-lite";
import React from "react";
import { PRIMARY_COLOR } from "../../consts";
import { AvatarFallbackText } from "@gluestack-ui/themed";
import { RobotoText } from "../common";
import { Pressable } from "@gluestack-ui/themed";


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

export interface PostCommentProps extends 
  PostCommentAvatarColumnProps, 
  PostCommentContentColumnProps {
  
}
  
interface PostCommentFullProps extends PostCommentProps {
    active: boolean
    onPress?: () => void
}

export const PostComment = observer((props: PostCommentFullProps) => {
  return (
    <Pressable
      flexDirection="row" 
      backgroundColor={props.active ? "#ffefd5" : "white"}
      padding={10}
      w="100%"
      onPress={props.onPress}
    >
      <PostCommentAvatarColumn authorName={props.authorName}/>
      <PostCommentContentColumn authorName={props.authorName} text={props.text}/>
    </Pressable>
  )
})
