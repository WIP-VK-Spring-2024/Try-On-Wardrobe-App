import React, { useEffect, useState } from "react";
import { profileStore, Subscription, User } from "../stores/ProfileStore";
import { observer } from "mobx-react-lite";
import {
  Avatar,
  AvatarFallbackText,
  View,
  Pressable,
  ChevronLeftIcon,
} from '@gluestack-ui/themed';
import { RobotoText } from "../components/common";
import { PRIMARY_COLOR, ACTIVE_COLOR, DELETE_BTN_COLOR } from "../consts";
import { StackActions } from '@react-navigation/native'
import SearchIcon from "../../assets/icons/search.svg"

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
