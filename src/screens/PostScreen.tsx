import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { BaseScreen } from "./BaseScreen";
import ImageModal from "react-native-image-modal";
import { ACTIVE_COLOR, PRIMARY_COLOR, WINDOW_HEIGHT, WINDOW_WIDTH } from "../consts";
import { Avatar, Input, InputField, View } from "@gluestack-ui/themed";
import { AvatarFallbackText } from "@gluestack-ui/themed";
import { RobotoText } from "../components/common";
import { Pressable } from "@gluestack-ui/themed";

import { getImageSource } from "../utils";
import { Image } from "@gluestack-ui/themed";
import { BackHeader } from "../components/Header";
import { PostComment, PostCommentProps, PostCommentTree, PostCommentTreeProps, RatingBlock, RatingStatus } from "../components/feed/PostComment";
import { AddCommentForm } from "../components/feed/AddCommentForm";
import { ajax } from "../requests/common";

import LikeIcon from '../../../assets/icons/my-like.svg';
import DislikeIcon from '../../../assets/icons/my-dislike.svg';


interface PostCommentBlockProps {
  comments: PostCommentTreeProps[]
};

export const PostCommentBlock = observer((props: PostCommentBlockProps) => {
  const [activeId, setActiveId] = useState<number | null>(null);

  return (
    <View
      w="100%"
      flexDirection="column"
      gap={10}
    >
      {
        props.comments.map((comment, i) => (
          <PostCommentTree
            key={i}
            authorName={comment.authorName}
            text={comment.text}
            replies={comment.replies}
            active={i === activeId}
          />
        ))
      }
    </View>
  )
})

interface PostScreenProps {
  navigation: any
  route: any
}

export const PostScreen = observer((props: PostScreenProps) => {
  const postData = props.route.params;
  
  const [ratingStatus, setRatingStatus] = useState<RatingStatus>(undefined);
  
  const [comments, setComments] = useState([
    {
      authorName: "nikstarling",
      text: "this is some long-long post text. It's purpose is to test rendering of comment",
    },
    {
      authorName: "nikstarling",
      text: "this is some long-long post text. It's purpose is to test rendering of comment",
    },
  ])

  const addComment = (comment: PostCommentProps) => {
    setComments([...comments, comment]);
  }

  useEffect(() => {
    console.log(postData.uuid)
    ajax.apiGet(`/posts/${postData.uuid}/comments`, {
      credentials: true
    }).then(resp => {
      console.log(resp);

      resp.json()
        .then(json => {
          console.log(json)
        })
        .catch(reason => console.error(reason))
    })
      .catch(reason => console.error(reason));
  })

  console.log(props.route.params)

  return (
    <BaseScreen
      header={<BackHeader navigation={props.navigation} text="Пост"/>}
      navigation={props.navigation}
      footer={<AddCommentForm addComment={addComment}/>}
    >
      <View
        w="100%"
        marginBottom={100}
        gap={20}
      >
        <View
          flexDirection='column' 
          alignContent='center'
          margin={10}
          >
          <ImageModal
            style={{
              width: WINDOW_WIDTH - 30,
              height: WINDOW_HEIGHT / 2,
              alignSelf: 'center'
            }}
            source={getImageSource(postData.image)}
            resizeMode="contain"
            />

        </View>
      
        <View
          w="100%"
          backgroundColor="#ffffff"
          padding={10}
          flexDirection="row"
          paddingRight={30}
          paddingLeft={30}
          justifyContent="space-between"
          alignItems="center"
          gap={10}
        >
          <View
            flexDirection="row"
            justifyContent="center"
            alignItems="center"
            gap={10}
          >
            <Avatar bg={PRIMARY_COLOR} borderRadius="$full" size="sm">
              <AvatarFallbackText>Nikita</AvatarFallbackText>
            </Avatar>

            <RobotoText fontWeight='bold'>Nikita</RobotoText>
          </View>

          <Pressable>
            <RobotoText>Подписаться</RobotoText>
          </Pressable>

          <RatingBlock
            rating={200}
            status={ratingStatus}
            setStatus={setRatingStatus}
          />
        </View>


        <PostCommentBlock
          comments={comments}
        />

      </View>
    </BaseScreen>
  )
})