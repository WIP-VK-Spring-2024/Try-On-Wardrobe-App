import React, { useState } from "react";
import { Subscription, User } from "../stores/ProfileStore";
import { observer } from "mobx-react-lite";
import { View } from '@gluestack-ui/themed';
import { RobotoText } from "../components/common";
import { BackButton, SubscribeButton } from "../components/Profile"
import { FetchDataType } from "../components/InfiniteScrollList";
import { PostData } from "../stores/common"
import { ajax } from "../requests/common"
import { convertPostResponse, getOptionalImageSource } from "../utils";
import { PostList } from "../components/Posts";
import { Avatar } from "../components/Avatar";
import { feedUserMediator } from "../components/feed/mediator";

interface OtherUserHeaderProps {
  navigation: any
  route: any
  user: Subscription
}

const OtherUserHeader = observer(({navigation, route, user}: OtherUserHeaderProps) => {
  const setIsSubbed = (isSubbed: boolean) => {
    feedUserMediator.propagate('0', {
      user_id: user.uuid,
      isSubbed
    })

    navigation.setParams({
      user: {
        ...user,
        is_subbed: isSubbed
      }
    })
  }

  return (
    <View flexDirection="row" w="100%" alignItems="center" $base-padding="$2">
      <BackButton navigation={navigation} flex={2} onBackPress={() => {
        navigation.navigate({
          name: "Post",
          params: {
            is_subbed: route.params.user.is_subbed
          },
          merge: true
        })
      }}/>

      <View flexDirection="row" alignItems="center" gap={20} flex={9}>
        <Avatar size="lg" name={user.name} source={getOptionalImageSource(user.avatar)}/>
        <RobotoText fontSize={18} numberOfLines={1}>
          {user.name}
        </RobotoText>
      </View>

      <View flex={5} marginRight={5}>
        <SubscribeButton
          isSubbed={route.params.user.is_subbed}
          setIsSubbed={setIsSubbed}
          user={user}
        />
      </View>
    </View>
  );
});

export const OtherUserProfileScreen = observer(({navigation, route}: {navigation: any, route: any}) => {
  const user: Subscription = route.params.user;

  const fetchUserPosts: FetchDataType<PostData> = React.useCallback(
    (limit: number, since: string) => {
      const urlParams = new URLSearchParams({
        limit: limit.toString(),
        since: since,
      });
      return ajax
        .apiGet(`/users/${user.uuid}/posts?` + urlParams.toString(), {
          credentials: true,
        })
        .then(resp => {
          return resp.json();
        })
        .then(json => {
          return json.map(convertPostResponse);
        });
    },
    [user.uuid],
  );

  return (
    <View height="100%">
      <OtherUserHeader
        user={user}
        navigation={navigation}
        route={route}
      />
      <PostList fetchData={fetchUserPosts} navigation={navigation}/>
    </View>
  );
});
