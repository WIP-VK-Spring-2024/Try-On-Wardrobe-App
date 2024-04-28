import React, { useEffect, useState } from "react";
import { profileStore, Subscription, User } from "../stores/ProfileStore";
import { observer } from "mobx-react-lite";
import {
  Avatar,
  AvatarFallbackText,
  View,
  Pressable,
  ChevronLeftIcon,
  Button,
} from '@gluestack-ui/themed';
import { RobotoText } from "../components/common";
import { PRIMARY_COLOR, ACTIVE_COLOR } from "../consts";
import { StackActions } from '@react-navigation/native'
import SearchIcon from "../../assets/icons/search.svg"
import { userUnsub, userSub } from "../requests/user"

export const BackButton = (props: {navigation: any, flex?: number}) => {
  const onBackPress = () => props.navigation.dispatch(StackActions.pop(1))

  return (
    <Pressable
      flexDirection="row"
      justifyContent="space-between"
      alignItems="flex-end"
      flex={props.flex}
      onPress={onBackPress}>
      <ChevronLeftIcon size="xl" color={ACTIVE_COLOR} />
    </Pressable>
  );
};



interface SubscribeButtonProps {
  isSubbed: boolean
  setIsSubbed: (isSubbed: boolean) => void
  user: Subscription
}

export const SubscribeButton = observer(
  ({ isSubbed, setIsSubbed, user }: SubscribeButtonProps) => {
    return (
      <Button
        size="xs"
        action={isSubbed ? 'secondary' : 'primary'}
        bgColor={isSubbed ? PRIMARY_COLOR : ACTIVE_COLOR}
        onPress={() => {
          if (isSubbed) {
            userUnsub(user.uuid).then(_ => {
              setIsSubbed(false);
              profileStore.currentUser?.removeSub(user.uuid);
            });
          } else {
            userSub(user.uuid).then(_ => {
              setIsSubbed(true);
              profileStore.currentUser?.addSub({
                uuid: user.uuid,
                name: user.name,
                is_subbed: true
              });
            });
          }
        }}>
        <RobotoText fontSize={14} color="#ffffff">
          {isSubbed ? 'Отписаться' : 'Подписаться'}
        </RobotoText>
      </Button>
    );
  },
);

interface SubProps {
  sub: Subscription
  navigation: any
  rowSize: number
}

export const Sub = observer(({sub, navigation, rowSize}: SubProps) => {
  return (
    <Pressable
      alignItems="center"
      w={`${100 / rowSize}%`}
      onPress={() => navigation.navigate('OtherProfile', {user: sub})}>
      <Avatar bg={PRIMARY_COLOR} borderRadius="$full" size="md">
        <AvatarFallbackText>{sub.name}</AvatarFallbackText>
      </Avatar>
      <RobotoText numberOfLines={1}>{sub.name}</RobotoText>
    </Pressable>
  );
});

export const NoSubsMessage = (
  <>
    <RobotoText>У вас пока нет подписок.</RobotoText>
    <RobotoText>
      Найдите интересующих вас авторов в ленте или в поиске!
    </RobotoText>
  </>
);

interface SubBlockProps extends SubsListProps {
  onSearch: () => void
}

export const SubsBlock = observer((props: SubBlockProps) => {
  return (
    <View flexDirection="row">
      <View flex={1} />
      <View gap={10} flex={8}>
        <View flexDirection="row" alignItems="center" gap={10}>
          <RobotoText fontSize={18}>Подписки</RobotoText>
          <Pressable onPress={() => props.onSearch()}>
            <SearchIcon fill={'#000000'} width={20} height={20} />
          </Pressable>
        </View>
        {props.subs.length > 0 ? (
          <SubsList
           {...props}
          />
        ) : (
          NoSubsMessage
        )}
      </View>
      <View flex={1} />
    </View>
  );
}); 

interface SubsListProps {
  subs: Subscription[]
  navigation: any
  displayedNum?: number
  rowSize: number
}

export const SubsList = observer(({subs, navigation, rowSize, displayedNum}: SubsListProps) => {
  const rowNum = Math.ceil((displayedNum || subs.length) / rowSize);

  return (
    <>
      {[...Array(rowNum)].map((_, i) =>
        <View flexDirection="row" key={i}>
          {subs.slice(rowSize * i, rowSize * (i + 1)).map((item, j) => (
            <Sub
              sub={item}
              navigation={navigation}
              rowSize={rowSize}
              key={j}
            />))}
        </View>
      )}
    </>
  );
}); 
