import { Avatar, Divider, View } from "@gluestack-ui/themed";
import { observer } from "mobx-react-lite";
import React, { useState } from "react";
import { ACTIVE_COLOR, PRIMARY_COLOR } from "../../consts";
import { AvatarFallbackText } from "@gluestack-ui/themed";
import { RobotoText } from "../common";
import { Pressable } from "@gluestack-ui/themed";


import LikeIcon from '../../../assets/icons/my-like.svg';
import DislikeIcon from '../../../assets/icons/my-dislike.svg';
import ProfileIcon from '../../../assets/icons/profile.svg';
import ReplyIcon from '../../../assets/icons/reply.svg';


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
      w="100%"
      flexDirection="column"
      margin={10}
      flexShrink={1}
    >
      <View
        w="100%"
      >
        <RobotoText
          w="100%"
          fontSize={18}
          fontWeight='bold'
        >
          {props.authorName}
        </RobotoText>
      </View>

      <View
        w="100%"
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

type RatingStatus = 'liked' | 'disliked' | undefined

interface PostCommentFooterProps {
  rating: number
  status: RatingStatus

  setStatus: (status: RatingStatus) => void
}

const PostCommentFooter = observer((props: PostCommentFooterProps) => {
  const icon_size = 20;

  const toggleRatingStatus = (status: RatingStatus) => {
    return () => {
      if (props.status === status) {
        props.setStatus(undefined);
      } else {
        props.setStatus(status);
      }
    }
  }

  return (
    <View
      flexDirection="row"
      justifyContent="center"
      alignItems="center"
      gap={40}
    >
      <View
        flexDirection="row"
        justifyContent="center"
        alignItems="center"
        gap={5}
      >
        <Pressable
          padding={5}
          onPress={toggleRatingStatus('liked')}
        >
          <LikeIcon 
            width={icon_size}
            height={icon_size} 
            stroke="#000000"
            fill={props.status === 'liked' ? PRIMARY_COLOR: "#ffffff"}
          />
        </Pressable>

        <RobotoText fontSize={14}>{props.rating}</RobotoText>

        <Pressable
          padding={5}
          onPress={toggleRatingStatus('disliked')}
        >
          <DislikeIcon
            width={icon_size}
            height={icon_size}
            stroke={"#000000"}
            fill={props.status === 'disliked' ? PRIMARY_COLOR : "#ffffff"}
          />
        </Pressable>
      </View>

      <Pressable
        padding={5}
      >
        <ProfileIcon width={icon_size + 3} height={icon_size + 3} stroke="#000000"/>
      </Pressable>

      <Pressable
        padding={5}
      >
        <ReplyIcon width={icon_size + 5} height={icon_size + 5} stroke="#000000"/>
      </Pressable>
    </View>
  )
})
  
interface PostCommentFullProps extends PostCommentProps {
    active: boolean
    onPress?: () => void
    onLongPress?: () => void
}

export const PostComment = observer((props: PostCommentFullProps) => {
  const [status, setStatus] = useState<RatingStatus>(undefined);

  return (
    <Pressable
      backgroundColor={props.active ? "#ffefd5" : "white"}
      padding={10}
      onPress={props.onPress}
      onLongPress={props.onLongPress}
    >
      <View
        flexDirection="row"
        gap={5}
      >
        <PostCommentAvatarColumn authorName={props.authorName}/>
        <PostCommentContentColumn authorName={props.authorName} text={props.text}/>
      </View>
      <Divider h="$0.5" marginTop={5} marginBottom={5}/>
      <PostCommentFooter
        rating={300}
        status={status}
        setStatus={setStatus}
      />
    </Pressable>
  )
})

const VecticalLine = () => {
  return (
    <View 
      width={2}
      height="100%"
      backgroundColor="#0f0f0f"
      marginLeft={10}
      marginRight={10}
    />
  )
}

export interface PostCommentTreeProps extends PostCommentFullProps {
  depth?: number
  replies?: PostCommentTreeProps[]
}

export const PostCommentTree = observer((props: PostCommentTreeProps) => {
  const depth = props.depth || 0;

  const [isCollapsed, setCollapsed] = useState(false);

  const toggleCollapsed = () => {
    setCollapsed(!isCollapsed);
  }

  const RepliesList = () => {
    if (props.replies === undefined) {
      return undefined;
    }

    if (isCollapsed) {
      return (
        <Pressable
          onPress={() => setCollapsed(false)}
        >
          <RobotoText>Раскрыть</RobotoText>
        </Pressable>
      )
    }

    return (
      props.replies.map((reply, i) => {
        return (
          <PostCommentTree
            key={i}
            {...reply}
            depth={depth + 1}
          />
        )
      })

    )
  }

  return (
    <View
      flex={1}
      flexDirection="column"
      marginTop={10}
    >
      <PostComment 
        {...props}
        onLongPress={()=>toggleCollapsed()}
      />
      <View
        flexDirection="row"
      >
        <VecticalLine/>
        <View
          flex={1}
          flexDirection="column"
        >
          <RepliesList/>
        </View>
      </View>
    </View>
  )
})
