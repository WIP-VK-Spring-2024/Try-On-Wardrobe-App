
import { observer } from "mobx-react-lite";
import React from "react";
import { Pressable } from "@gluestack-ui/themed";
import { BASE_COLOR, WINDOW_HEIGHT, WINDOW_WIDTH } from "../consts";
import { ImageSourceType, getImageSource } from "../utils";
import {ListRenderItemInfo } from "react-native";
import FastImage from "react-native-fast-image";
import { FetchDataType, InfiniteScrollList } from "../components/InfiniteScrollList";
import { PostData } from "../stores/common"

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

export const PostCard = observer((props: PostCardProps) => {
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

interface PostListProps {
  fetchData: FetchDataType<PostData>
  renderItem?: (data: ListRenderItemInfo<PostData>) => React.JSX.Element
  navigation: any
}

export const PostList = observer(({fetchData, navigation, renderItem}: PostListProps) => {
  if (renderItem === undefined) {
    renderItem = ((data: ListRenderItemInfo<PostData>) => {
      const {item} = data;
      console.log(item)
    
      return (
        <PostCard
          data={item}
          onPress={() => {
            navigation.navigate("Post", {
              ...item
            })
          }}
        />
      )
    })
  }

  return <InfiniteScrollList<PostData>
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
