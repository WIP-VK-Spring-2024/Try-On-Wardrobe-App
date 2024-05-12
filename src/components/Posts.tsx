
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { Pressable, View } from "@gluestack-ui/themed";
import { ImageSourceType, getImageSource, getOptionalImageSource } from "../utils";
import { BASE_COLOR, PRIMARY_COLOR, WINDOW_HEIGHT, WINDOW_WIDTH } from "../consts";
import {ListRenderItemInfo } from "react-native";
import FastImage from "react-native-fast-image";
import { FetchDataType, InfiniteScrollList } from "../components/InfiniteScrollList";
import { PostData } from "../stores/common"
import { RobotoText } from "./common";
import { RatingBlock, RatingStatus, getRatingFromStatus, getStatusFromRating } from "./feed/RatingBlock";
import { MediatorPropType, feedAvatarMediator, feedPropsMediator, feedUserMediator } from "./feed/mediator";
import { ajax } from "../requests/common";
import { Avatar } from "./Avatar";
import { profileStore } from "../stores/ProfileStore";
import { ImageType } from "../models";

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
      backgroundColor="white">
      <Pressable
        width="100%"
        padding={4}
        flexDirection="row"
        justifyContent="center"
        alignItems="center"
        gap={10}
        onPress={() => {
          props.data.user_id != profileStore.currentUser?.uuid &&
            props.navigation.navigate('OtherProfile', {
              user: {
                name: props.data.user_name,
                uuid: props.data.user_id,
                is_subbed: props.data.is_subbed,
                avatar: props.data.user_image,
              },
            });
        }}>

        <Avatar
          size="xs"
          name={props.data.user_name}
          source={getOptionalImageSource(props.data.user_image)}
        />

        <RobotoText fontWeight='bold' numberOfLines={1} flex={1}>{props.data.user_name}</RobotoText>
      </Pressable>

      <View flex={1}>
        <PostImage source={getImageSource(/* props.data.try_on_image ||  */props.data.outfit_image)} />
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

  const updateSubscribed = (userId: string, isSubbed: boolean) => {
    console.log('updating subscription', userId, isSubbed)
    
    const newData = data.map(post => {
      if (post.user_id !== userId) {
        return post;
      }

      return {
        ...post,
        is_subbed: isSubbed
      };
    })

    console.log(newData.map(i => ([i.user_id, i.is_subbed])))

    setData(newData);
  }

  feedUserMediator.subscribe({
    id: '0',
    cb: prop => updateSubscribed(prop.user_id, prop.isSubbed)
  })

  useEffect(() => {
    return () => {
      feedAvatarMediator.clear();
      feedPropsMediator.clear();
      feedUserMediator.clear();
    }
  }, []);
  
  if (renderItem === undefined) {
    renderItem = ((listData: ListRenderItemInfo<PostData>) => {
      const {item} = listData;

      const updateRatingStatus = (status: RatingStatus) => {
        console.log(status);

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
        };

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
        cb: (prop: MediatorPropType ) => {
          if (prop.propType === 'status') {
            updateRatingStatus(prop.payload);
          }
        }
      });

      const updateAvatar = (avatar: ImageType) => {
        const postsCopy = data.map(post => {
          if (post.user_id === item.user_id) {
            post.user_image = avatar;
          }
          return post;
        });

        setData(postsCopy);
      };

      feedAvatarMediator.subscribe({
        id: item.user_id,
        cb: (props: {avatar: ImageType}) => {
          updateAvatar(props.avatar);
        },
      });
    
      return (
        <PostCard
          key={item.uuid}
          navigation={navigation}
          data={item}
          onPress={() => {
            navigation.navigate("Post", {
              ...item
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
      paddingLeft: 10,
      paddingRight: 10
    }}

    contentContainerStyle={{
      gap: 10,
    }}

    columnWrapperStyle={{
      gap: 10,
    }}
  />
});
