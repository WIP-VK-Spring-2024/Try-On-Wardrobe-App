import { View } from "@gluestack-ui/themed";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { Header } from "../components/Header";
import { ajax } from "../requests/common";
import { Footer } from "../components/Footer";
import { Pressable } from "@gluestack-ui/themed";
import { BASE_COLOR, PRIMARY_COLOR, WINDOW_HEIGHT, WINDOW_WIDTH } from "../consts";
import { ImageType } from "../models";
import { ImageSourceType, getImageSource, convertPostResponse } from "../utils";
import { FlatList, ImageSourcePropType, ListRenderItem, ListRenderItemInfo } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { appState } from "../stores/AppState";
import FastImage from "react-native-fast-image";
import { Image } from "@gluestack-ui/themed";
import { FetchDataType, InfiniteScrollList } from "../components/InfiniteScrollList";
import { PostData } from "../stores/common"
import { Avatar } from "@gluestack-ui/themed";
import { AvatarFallbackText } from "@gluestack-ui/themed";
import { RobotoText } from "./common";
import { processColorsInProps } from "react-native-reanimated/lib/typescript/reanimated2/Colors";
import { RatingBlock, RatingStatus, getRatingFromStatus, getStatusFromRating } from "./feed/RatingBlock";
import { feedPropsMediator } from "./feed/mediator";

interface PostCardProps {
  navigation: any
  data: PostData
  onPress: ()=>void
  updateRatingStatus: (status: RatingStatus)=>void
}

interface PostImageProps {
  source: ImageSourceType
}

const PostImage = observer((props: PostImageProps) => {
  return (
    <FastImage
      style={{
        width: "100%",
        height: "100%"
      }}
      source={{
        uri: props.source.uri
      }}
    />
  )
})

export const PostCard = observer((props: PostCardProps) => {
  return (
    <Pressable
      bg={BASE_COLOR}
      onPress={props.onPress}
      width={(WINDOW_WIDTH - 40) / 3}
      height={WINDOW_HEIGHT / 3}
      flexDirection="column"
      backgroundColor="white"
    >
      <Pressable
        flexDirection="row"
        justifyContent="center"
        alignItems="center"
        gap={10}
        onPress={() => {
          props.navigation.navigate('OtherProfile', {user: {
            name: props.data.user_name,
            uuid: props.data.user_id
          }})
        }}
      >
        <Avatar bg={PRIMARY_COLOR} borderRadius="$full" size="xs">
          <AvatarFallbackText>{props.data.user_name}</AvatarFallbackText>
        </Avatar>

        <RobotoText fontWeight='bold'>{props.data.user_name}</RobotoText>
      </Pressable>
      
      <View
        flex={1}
      >
        <PostImage source={getImageSource(props.data.outfit_image)} />
      </View>

      <RatingBlock
        rating={props.data.rating}
        status={getStatusFromRating(props.data.user_rating)}
        setStatus={props.updateRatingStatus}
      />
    </Pressable>
  );
})

interface PostListProps {
  fetchData: FetchDataType<PostData>
  renderItem?: (data: ListRenderItemInfo<PostData>) => React.JSX.Element
  navigation: any
}

export const PostList = observer(({fetchData, navigation, renderItem}: PostListProps) => {
  const [data, setData] = useState<PostData[]>([]);
  
  if (renderItem === undefined) {
    renderItem = ((listData: ListRenderItemInfo<PostData>) => {
      const {item} = listData;

      const updateRatingStatus = (status: RatingStatus) => {
        console.log(status)
        const postId = data.findIndex(post => post.uuid === item.uuid);
        if (postId === -1) {
          return;
        }

        const post = data[postId];

        const userRating = getRatingFromStatus(status);
        
        const originRating = post.rating - post.user_rating;

        post.user_rating = userRating;
        post.rating = originRating + userRating;

        const rateBody = {
          rating: post.rating
        }

        console.log('rate', rateBody)

        ajax.apiPost(`/posts/${item.uuid}/rate`, {
          credentials: true,
          body: JSON.stringify(rateBody)
        })
          .then(resp => {
            console.log(resp);
          })
          .catch(reason => console.error(reason));

        setData([...data.slice(0, postId), post, ...data.slice(postId + 1)]);
      }

      feedPropsMediator.subscribe({
        id: item.uuid,
        cb: (props: {status: RatingStatus}) => {
          updateRatingStatus(props.status);
        }
      });
    
      return (
        <PostCard
          key={item.uuid}
          navigation={navigation}
          data={item}
          onPress={() => {
            navigation.navigate("Post", {
              image: item.outfit_image,
              uuid: item.uuid,
              user_name: item.user_name,
              user_rating: item.user_rating,
              rating: item.rating,
              user_id: item.user_id,

              // updateRatingStatus: updateRatingStatus,
            })
          }}
          updateRatingStatus={updateRatingStatus}
        />
      )
    })
  }

  return <InfiniteScrollList<PostData>
    data={data}
    setData={setData}

    numColumns={3}
    fetchData={fetchData}
    keyExtractor={item => item.uuid}
    renderItem={renderItem}

    style={{
      width: "100%",
      padding: 10,
    }}

    contentContainerStyle={{
      gap: 10,
    }}

    columnWrapperStyle={{
      gap: 10,
    }}

  />
});
