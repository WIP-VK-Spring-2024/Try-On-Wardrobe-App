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
import { PostComment, PostCommentProps, PostCommentTree, PostCommentTreeProps } from "../components/feed/PostComment";
import { AddCommentForm } from "../components/feed/AddCommentForm";
import { ajax } from "../requests/common";
import { PostData } from "../stores/common"

import { RatingBlock, RatingStatus, getRatingFromStatus, getStatusFromRating } from "../components/feed/RatingBlock";
import { profileStore } from "../stores/ProfileStore";
import { SubscribeButton } from "../components/Profile";


interface PostCommentBlockProps {
  navigation: any
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
            uuid={comment.uuid}
            authorName={comment.authorName}
            authorUUID={comment.authorUUID}
            text={comment.text}
            replies={comment.replies}
            active={i === activeId}
            rating={comment.rating}
            ratingStatus={comment.ratingStatus}
            navigation={props.navigation}
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
  const postData: PostData = props.route.params;
  const [isSubbed, setIsSubbed] = useState(
    profileStore.currentUser?.subs.find(
      item => item.uuid === postData.user_id,
    ) != undefined,
  );
  
  const [ratingStatus, setRatingStatus] = useState<RatingStatus>(getStatusFromRating(postData.user_rating));
  const [rating, setRating] = useState<number>(postData.rating);

  const updateRatingStatus = (status: RatingStatus) => {
    setRatingStatus(status);

    const rating = getRatingFromStatus(status);

    setRating(postData.rating + rating);

    const rateBody = {
      rating: rating
    }

    ajax.apiPost(`/posts/${postData.uuid}/rate`, {
      credentials: true,
      body: JSON.stringify(rateBody)
    })
      .then(resp => {
        console.log(resp);
      })
      .catch(reason => console.error(reason));
  }
  
  const [comments, setComments] = useState<PostCommentProps[]>([])

  const addComment = (comment: PostCommentProps) => {
    const commentBody = {
      body: comment.text
    };

    ajax.apiPost(`/posts/${postData.uuid}/comments`, {
      credentials: true,
      body:JSON.stringify(commentBody)
    })
      .then(resp => {
        console.log(resp);
        resp.json().then((json) => {
          console.log(json);
          comment.uuid = json.uuid;
          setComments([...comments, comment]);
        })
      })
      .catch(reason => console.error(reason));
  }

  useEffect(() => {
    console.log(postData.uuid)
    ajax.apiGet(`/posts/${postData.uuid}/comments?limit=10&since=${(new Date()).toISOString()}`, {
      credentials: true
    }).then(resp => {
      console.log(resp);

      resp.json()
        .then(json => {
          console.log(json)

          const responseToComment = (response: any) => ({
            text: response.body,
            authorName: response.user_name,
            authorUUID: response.user_id,
            rating: response.rating,
            ratingStatus: getStatusFromRating(response.user_rating),
            uuid: response.uuid
          })

          setComments(json.map(responseToComment));
        })
        .catch(reason => console.error(reason))
    })
      .catch(reason => console.error(reason));
  }, [])

  console.log(props.route.params)

  return (
    <BaseScreen
      header={<BackHeader navigation={props.navigation} text="Пост" />}
      navigation={props.navigation}
      footer={
        <AddCommentForm addComment={addComment} navigation={props.navigation} />
      }>
      <View w="100%" marginBottom={100} gap={20}>
        <View flexDirection="column" alignContent="center" margin={10}>
          <ImageModal
            style={{
              width: WINDOW_WIDTH - 30,
              height: WINDOW_HEIGHT / 2,
              alignSelf: 'center',
            }}
            source={getImageSource(postData.outfit_image)}
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
          gap={10}>
          <Pressable
            flexDirection="row"
            justifyContent="center"
            alignItems="center"
            gap={10}
            onPress={() => {
              if (postData.user_id != profileStore.currentUser?.uuid) {
                props.navigation.navigate('OtherProfile', {
                  user: {
                    name: postData.user_name,
                    uuid: postData.user_id,
                    is_subbed: isSubbed,
                  },
                });
              } else {
                props.navigation.navigate('Profile');
              }
            }}>
            <Avatar bg={PRIMARY_COLOR} borderRadius="$full" size="sm">
              <AvatarFallbackText>{postData.user_name}</AvatarFallbackText>
            </Avatar>

            <RobotoText fontWeight="bold">{postData.user_name}</RobotoText>
          </Pressable>

          {postData.user_id != profileStore.currentUser?.uuid && (
            <SubscribeButton
              isSubbed={isSubbed}
              setIsSubbed={setIsSubbed}
              user={{
                name: postData.user_name,
                uuid: postData.user_id,
                is_subbed: postData.is_subbed,
              }}
            />
          )}

          <RatingBlock
            rating={rating}
            status={ratingStatus}
            setStatus={updateRatingStatus}
          />
        </View>

        <PostCommentBlock navigation={props.navigation} comments={comments} />
      </View>
    </BaseScreen>
  );
})
