import { View } from "@gluestack-ui/themed";
import { observer } from "mobx-react-lite";
import React, { useState } from "react";
import { RobotoText } from "../common";
import { Pressable } from "@gluestack-ui/themed";
import { getImageSource, getOptionalImageSource } from "../../utils"

import ReplyIcon from '../../../assets/icons/reply.svg';
import { RatingBlock, RatingBlockProps, RatingStatus, getRatingFromStatus } from "./RatingBlock";
import { ajax } from "../../requests/common";
import { Avatar } from "../Avatar";
import { ImageType } from "../../models";


interface PostCommentAvatarColumnProps {
  authorName: string
  authorAvatar?: ImageType
}

interface PostCommentContentColumnProps {
  authorName: string
  authorAvatar?: ImageType
  authorUUID: string
  text: string
  navigation: any
}

const PostCommentContentColumn = observer((props: PostCommentContentColumnProps) => {
  return (
    <View
      w="100%"
      flexDirection="column"
      margin={10}
      flexShrink={1}
      gap={5}
    >
      <Pressable
        flexDirection="row"
        gap={10}
        alignItems="center"
        onPress={() => {
          props.navigation.navigate('OtherProfile', {user: {
            name: props.authorName,
            uuid: props.authorUUID,
            avatar: props.authorAvatar,
          }})
        }}
      >
        <Avatar size="sm" name={props.authorName} source={getOptionalImageSource(props.authorAvatar)}/>

        <RobotoText
          w="100%"
          fontSize={18}
          fontWeight='bold'
        >
          {props.authorName}
        </RobotoText>
      </Pressable>

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
    uuid: string
    rating: number
    ratingStatus: RatingStatus
}

interface PostCommentFooterProps extends RatingBlockProps {

}

const PostCommentFooter = observer((props: PostCommentFooterProps) => {
  const icon_size = 16;

  return (
    <View
      flexDirection="row"
      justifyContent="flex-start"
      paddingLeft={40}
      alignItems="center"
      gap={40}
    >
      <RatingBlock
        rating={props.rating}
        status={props.status}
        setStatus={props.setStatus}
      />

      {/* <Pressable
        padding={5}
      >
        <ProfileIcon width={icon_size + 3} height={icon_size + 3} stroke="#000000"/>
      </Pressable> */}

      <Pressable
        padding={5}
        flexDirection="row"
        alignItems="flex-start"
      >
        <ReplyIcon width={icon_size + 5} height={icon_size + 5} stroke="#000000"/>
        <RobotoText fontSize={14}>Ответить</RobotoText>
      </Pressable>
    </View>
  )
})
  
interface PostCommentFullProps extends PostCommentProps {
    active?: boolean
    onPress?: () => void
    onLongPress?: () => void
}

export const PostComment = observer((props: PostCommentFullProps) => {
  const [rating, setRating] = useState<number>(props.rating);
  const [ratingStatus, setRatingStatus] = useState<RatingStatus>(props.ratingStatus);

  console.log(props, rating, ratingStatus)

  const updateRatingStatus = (status: RatingStatus) => {
    setRatingStatus(status);
 
    const rating = getRatingFromStatus(status);

    setRating(props.rating + rating);

    const rateBody = {
      rating: rating
    }

    ajax.apiPost(`/comments/${props.uuid}/rate`, {
      credentials: true,
      body: JSON.stringify(rateBody)
    })
      .then(resp => {
        console.log(resp);
      })
      .catch(reason => console.error(reason));
  }

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
        <PostCommentContentColumn 
          authorAvatar={props.authorAvatar}
          authorName={props.authorName}
          authorUUID={props.authorUUID}
          text={props.text}
          navigation={props.navigation}
        />
      </View>
      
      <PostCommentFooter
        rating={rating}
        status={ratingStatus}
        setStatus={updateRatingStatus}
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
