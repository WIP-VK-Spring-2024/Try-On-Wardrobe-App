import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { BaseScreen } from "./BaseScreen";
import ImageModal from "react-native-image-modal";
import { WINDOW_HEIGHT, WINDOW_WIDTH, BASE_COLOR, ACTIVE_COLOR } from "../consts";
import { View } from "@gluestack-ui/themed";
import { RobotoText } from "../components/common";
import { Pressable } from "@gluestack-ui/themed";

import { Avatar } from "../components/Avatar";

import { getImageSource, getOptionalImageSource, share } from "../utils";
import { BackHeader } from "../components/Header";
import { PostCommentProps, PostCommentTree, PostCommentTreeProps } from "../components/feed/PostComment";
import { AddCommentForm } from "../components/feed/AddCommentForm";
import { ajax } from "../requests/common";
import { PostData } from "../stores/common";

import { RatingBlock, RatingStatus, getRatingFromStatus, getStatusFromRating } from "../components/feed/RatingBlock";
import { feedPropsMediator, feedUserMediator } from "../components/feed/mediator";
import { profileStore } from "../stores/ProfileStore";
import { SubscribeButton } from "../components/Profile";

import ShareIcon from "../../assets/icons/share.svg";
import { TryOnOutfitFooter, TryOnOutfitFooterStatus } from "../components/TryOnOutfitFooter";
import { TryOnButton } from "../components/TryOnButton";

interface PostCommentBlockProps {
  navigation: any
  comments: PostCommentTreeProps[]
  onDelete: (uuid: string) => void
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
            authorAvatar={comment.authorAvatar}
            authorName={comment.authorName}
            authorUUID={comment.authorUUID}
            text={comment.text}
            replies={comment.replies}
            active={i === activeId}
            rating={comment.rating}
            ratingStatus={comment.ratingStatus}
            navigation={props.navigation}
            onDelete={props.onDelete}
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

  console.log(postData)

  const setIsSubbed = (isSubbed: boolean) => {
    feedUserMediator.propagate('0', {
      user_id: postData.user_id,
      isSubbed: isSubbed
    })

    props.navigation.setParams({
      is_subbed: isSubbed
    })
  }

  console.log('is subbed', props.route.params.is_subbed)
  
  const [ratingStatus, setRatingStatus] = useState<RatingStatus>(getStatusFromRating(postData.user_rating));
  const [rating, setRating] = useState<number>(postData.rating);

  const updateRatingStatus = (status: RatingStatus) => {
    feedPropsMediator.propagate(postData.uuid, {propType: "status", payload: status});
    
    setRatingStatus(status);

    const rating = getRatingFromStatus(status);

    setRating(postData.rating - postData.user_rating + rating);
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
    ajax.apiGet(`/posts/${postData.uuid}/comments?limit=100&since=${(new Date()).toISOString()}`, {
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

  const [status, setStatus] = useState<TryOnOutfitFooterStatus>('outfit');

  return (
    <>
    <BaseScreen
      header={<BackHeader navigation={props.navigation} text="Пост" />}
      navigation={props.navigation}
      footer={
        <AddCommentForm addComment={addComment} navigation={props.navigation} />
      }>
      <View w="100%" marginBottom={100} gap={10}>
        <View flexDirection="column" alignContent="center" margin={10} marginBottom={0}>
          {postData.tryonable &&
            <TryOnButton
              tryOnType='post'
              navigation={props.navigation}
              marginBottom={0}
              outfitId={postData.outfit_id}
            />
          }
          <ImageModal
            style={{
              width: WINDOW_WIDTH - 30,
              height: WINDOW_HEIGHT / 2,
              alignSelf: 'center',
            }}
            source={getImageSource(status === 'outfit' ?  postData.outfit_image : postData.try_on_image!)}
            resizeMode="contain"
            overlayBackgroundColor={BASE_COLOR}
          />

          {postData.try_on_image && <TryOnOutfitFooter status={status} setStatus={setStatus}/>}
        </View>

        <View
          backgroundColor="#ffffff"
          padding={10}
          flexDirection="row"
          paddingRight={25}
          paddingLeft={25}
          justifyContent="space-between"
          alignItems="center"
          gap={8}>
          <Pressable
            flex={1}
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
                    is_subbed: props.route.params.is_subbed,
                    avatar: postData.user_image,
                  },
                });
              } else {
                props.navigation.navigate('Profile');
              }
            }}>
            <Avatar size="sm" name={postData.user_name} source={getOptionalImageSource(postData.user_image)}/>

            <RobotoText fontWeight="bold" numberOfLines={1} flex={1}>{postData.user_name}</RobotoText>
          </Pressable>

          {postData.user_id != profileStore.currentUser?.uuid && (
            <View>
              <SubscribeButton
                isSubbed={props.route.params.is_subbed}
                setIsSubbed={setIsSubbed}
                user={{
                  name: postData.user_name,
                  avatar: postData.user_image,
                  uuid: postData.user_id,
                  is_subbed: postData.is_subbed,
                }}
              />
            </View>
          )}

          <RatingBlock
            rating={rating}
            status={ratingStatus}
            setStatus={updateRatingStatus}
          />

          <Pressable onPress={() => {
            const images = [postData.outfit_image];
            if (postData.try_on_image) {
              images.push(postData.try_on_image);
            }
            
            share({
              title: 'Поделиться образом',
              images: images,
            })
          }}>
            <ShareIcon fill={ACTIVE_COLOR} width={20} height={20}/>
          </Pressable>
        </View>

        <PostCommentBlock
          navigation={props.navigation}
          comments={comments}
          onDelete={(uuid: string) => {
            ajax.apiDelete(`comments/${uuid}`, {credentials: true}).then(_ => {
              setComments(comments.filter(comment => comment.uuid != uuid));
            });
          }}
        />
      </View>
    </BaseScreen>
  </>
  );
})
