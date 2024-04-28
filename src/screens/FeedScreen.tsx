import { View } from "@gluestack-ui/themed";
import { observer } from "mobx-react-lite";
import React, { useEffect, useRef, useState } from "react";
import { Header } from "../components/Header";
import { ajax } from "../requests/common";
import { Footer } from "../components/Footer";
import { Pressable } from "@gluestack-ui/themed";
import { BASE_COLOR, WINDOW_HEIGHT, WINDOW_WIDTH } from "../consts";
import { ImageType } from "../models";
import { ImageSourceType, getImageSource, convertPostResponse } from "../utils";
import { FlatList, ImageSourcePropType, ListRenderItem, ListRenderItemInfo } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { appState } from "../stores/AppState";
import FastImage from "react-native-fast-image";
import { Image } from "@gluestack-ui/themed";
import { FetchDataType, InfiniteScrollList } from "../components/InfiniteScrollList";
import { PostData } from "../stores/common"
import { PostList } from "../components/Posts";


interface PostResponse {
  uuid: string
  created_at: string
  updated_at: string
  outfit_id: string
  outfit_image: string
  user_name: string
}

interface PostCardProps {
  data: PostData
  onPress: ()=>void
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

const PostCard = observer((props: PostCardProps) => {
  return (
    <Pressable
      bg={BASE_COLOR}
      onPress={props.onPress}
      width={(WINDOW_WIDTH - 40) / 3}
      height={WINDOW_HEIGHT / 3}
    >
      <PostImage source={getImageSource(props.data.outfit_image)} />
    </Pressable>
  );
})

interface FeedScreenProps {
  navigation: any
}

export const FeedScreen = observer((props: FeedScreenProps) => {
  useFocusEffect(() => {
    appState.setScreen('Feed');
  })

  const fetchData = (limit: number, since: string) => {
      return ajax.apiGet(`/posts?limit=${limit}&since=${since}`,{
        credentials: true
      }).then((resp: any) => {
  
        return resp.json().then((json: PostResponse[]) => {
          console.log(json);
          const data = json.map(convertPostResponse);
          return data;
        })
      })
  }

  const renderItem = ((data: ListRenderItemInfo<PostData>) => {
    const {item} = data;

    return (
      <PostCard
        data={item}
        onPress={() => {
          console.log('item:', item)
          props.navigation.navigate("Post", {
            ...item
          })
        }}
      />
    )
  })
  
  return (
    <View height="100%">
      <Header navigation={props.navigation}/>

      <PostList 
        fetchData={fetchData}
        navigation={props.navigation}
        renderItem={renderItem}
      />
      
      <Footer navigation={props.navigation}/>
    </View>
  )
});
