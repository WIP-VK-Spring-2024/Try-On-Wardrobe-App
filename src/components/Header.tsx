import React, { PropsWithChildren } from 'react';

import {Avatar, AvatarFallbackText, Box, ChevronLeftIcon, Pressable, View} from '@gluestack-ui/themed';
import {active_color, header_color, header_icon_color, text_color} from '../consts';
import {RobotoText} from './common';

import FilterIcon from '../../assets/icons/filter.svg';
import SettingsIcon from '../../assets/icons/settings.svg';
import SearchIcon from '../../assets/icons/search.svg';
import { StackActions } from '@react-navigation/native';

const HeaderBase = (props: PropsWithChildren) => {
  return (
    <Box
      bg={header_color}
      $base-height={60}
      display="flex"
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
      $base-padding="$2"
      {...props}
      >
      {props.children}
    </Box>
  )
}

export const Header = () => {
  return (
    <HeaderBase>
      <Box display="flex" flexDirection="row" gap="$2" alignItems="center">
        <Avatar bg={active_color} borderRadius="$full">
          <AvatarFallbackText>nikstarling</AvatarFallbackText>
        </Avatar>
        <RobotoText color={text_color} fontSize="$2xl">
          Try-On
        </RobotoText>
      </Box>
      <Box display="flex" flexDirection="row" gap={20}>
        <FilterIcon stroke={header_icon_color}/>
        <SettingsIcon stroke={header_icon_color}/>
        <SearchIcon stroke={header_icon_color}/>
      </Box>
    </HeaderBase>
  );
};

export const backHeader = (props: {navigation: any}) => {
  return (
    <HeaderBase>
      <Pressable
        display='flex'
        flexDirection='row'
        justifyContent='space-between'
        alignItems='flex-end'
        flex={1}
        gap={3}
        onPress={() => {
          props.navigation.dispatch(StackActions.pop(1));
        }}
      >
        <ChevronLeftIcon size="xl" color={active_color}/>
      </Pressable>
      <RobotoText
        color="#000"
        flex={10}
        textAlign='center'
        fontSize={32}
      >
        Толстовка
      </RobotoText>
      <View flex={1}></View>
    </HeaderBase>
  )
}
