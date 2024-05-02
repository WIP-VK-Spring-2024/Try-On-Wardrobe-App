import React, { useEffect, useState } from "react";
import { profileStore, Subscription, User } from "../stores/ProfileStore";
import { observer } from "mobx-react-lite";
import {
  Avatar,
  AvatarFallbackText,
  View,
  Button,
} from '@gluestack-ui/themed';
import { RobotoText } from "../components/common";
import { PRIMARY_COLOR } from "../consts";
import { BackButton, SubscribeButton } from "../components/Profile"
import { FetchDataType } from "../components/InfiniteScrollList";
import { PostData } from "../stores/common"
import { ajax } from "../requests/common"
import { convertPostResponse } from "../utils";
import { PostList } from "../components/Posts";

interface OtherUserHeaderProps {
  navigation: any
  user: Subscription
}

const OtherUserHeader = observer(({navigation, user}: OtherUserHeaderProps) => {
  const [isSubbed, setIsSubbed] = useState(user.is_subbed);

  return (
    <View flexDirection="row" w="100%" alignItems="center" $base-padding="$2">
      <BackButton navigation={navigation} flex={2} />

      <View flexDirection="row" alignItems="center" gap={20} flex={9}>
        <Avatar bg={PRIMARY_COLOR} borderRadius="$full" size="lg">
          <AvatarFallbackText>{user.name}</AvatarFallbackText>
        </Avatar>
        <RobotoText fontSize={18} numberOfLines={1}>
          {user.name}
        </RobotoText>
      </View>

      <View flex={5} marginRight={5}>
        <SubscribeButton
          isSubbed={isSubbed}
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
      />
      <PostList fetchData={fetchUserPosts} navigation={navigation}/>
    </View>
  );
});
