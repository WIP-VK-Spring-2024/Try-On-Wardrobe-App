import { View } from "@gluestack-ui/themed";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { Header } from "../components/Header";
import { ajax } from "../requests/common";
import { Footer } from "../components/Footer";
import { Pressable } from "@gluestack-ui/themed";
import { BASE_COLOR, WINDOW_HEIGHT, WINDOW_WIDTH } from "../consts";
import { ImageType } from "../models";
import { ImageSourceType, getImageSource } from "../utils";
import { FlatList, ImageSourcePropType, ListRenderItem, ListRenderItemInfo } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { appState } from "../stores/AppState";
import FastImage from "react-native-fast-image";
import { Image } from "@gluestack-ui/themed";


interface PostResponse {
  uuid: string
  updated_at: string
  outfit_id: string
  outfit_image: string
}

interface PostData {
  uuid: string
  outfit_id: string
  outfit_image: ImageType
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
  const [data, setData] = useState<PostData[]>([]);

  useFocusEffect(() => {
    appState.setScreen('Feed');
  })

  useEffect(() => {
    const time = new Date();
    ajax.apiGet(`/posts?limit=10&since=${time.toISOString()}`,{
      credentials: true
    }).then((resp: any) => {
      console.log(resp);

      resp.json().then((json: PostResponse[]) => {
        console.log(json);
        setData(json.map(item => ({
          ...item,
          outfit_image: {
            type: 'remote',
            uri: item.outfit_image
          }
        })));
      })
    })
  }, [])

  const renderItem: ListRenderItem<PostData> = ((data: ListRenderItemInfo<PostState>) => {
    const {item} = data;
    console.log(item)
  

    return (
      <PostCard
        data={item}
        onPress={() => {
          props.navigation.navigate("Post", {
            image: item.outfit_image
          })
        }}
      />
    )
  })
  
  return (
    <View height="100%">
      <Header/>

      <FlatList
        numColumns={3}
        data={data}
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
      
      <Footer navigation={props.navigation}/>
    </View>
  )
});
