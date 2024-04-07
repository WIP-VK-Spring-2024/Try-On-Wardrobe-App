import React, { PropsWithChildren, ReactNode } from 'react';

import {Avatar, AvatarFallbackText, Box, ChevronLeftIcon, Pressable, View} from '@gluestack-ui/themed';
import {ACTIVE_COLOR, HEADER_COLOR, HEADER_ICON_COLOR, TEXT_COLOR} from '../consts';
import {RobotoText} from './common';
import { StackActions } from '@react-navigation/native';

import FilterIcon from '../../assets/icons/filter.svg';
import SettingsIcon from '../../assets/icons/settings.svg';
import SearchIcon from '../../assets/icons/search.svg';
import { appState } from '../stores/AppState';
import { observer } from 'mobx-react-lite';


const HeaderBase = (props: PropsWithChildren) => {
  return (
    <Box
      bg={HEADER_COLOR}
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

interface HeaderProps {
  filterColor: string
}
export const Header = (props: HeaderProps) => {
  const filter_icon_color = appState.filterModalVisible ? ACTIVE_COLOR : HEADER_ICON_COLOR
  return (
    <HeaderBase>
      <Box display="flex" flexDirection="row" gap="$2" alignItems="center">
        <Avatar bg={ACTIVE_COLOR} borderRadius="$full">
          <AvatarFallbackText>nikstarling</AvatarFallbackText>
        </Avatar>
        <RobotoText color={TEXT_COLOR} fontSize="$2xl">
          Try-On
        </RobotoText>
      </Box>
      <Box display="flex" flexDirection="row" gap={20}>
        <Pressable onPress={()=>{
            appState.setFilterModalVisible(true)
          }}>
          <FilterIcon stroke={props.filterColor}/>
        </Pressable>
        <SettingsIcon stroke={HEADER_ICON_COLOR}/>
        <SearchIcon stroke={HEADER_ICON_COLOR}/>
      </Box>
    </HeaderBase>
  );
};

export const BackHeader = (props: {navigation: any, rightMenu: ReactNode}) => {
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
        <ChevronLeftIcon size="xl" color={ACTIVE_COLOR}/>
      </Pressable>
      <RobotoText
        color="#000"
        flex={10}
        textAlign='center'
        fontSize={32}
      >
        Толстовка
      </RobotoText>
      <View flex={1}>
        {props.rightMenu}
      </View>
    </HeaderBase>
  )
};
