import React, { PropsWithChildren, ReactNode } from 'react';

import {Avatar, AvatarFallbackText, Box, ChevronLeftIcon, Pressable, View} from '@gluestack-ui/themed';
import {active_color, header_color, header_icon_color, text_color} from '../consts';
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

interface HeaderProps {
  filterColor: string
}
export const Header = (props: HeaderProps) => {
  const filter_icon_color = appState.filterModalVisible ? active_color : header_icon_color
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
        <Pressable onPress={()=>{
            appState.setFilterModalVisible(true)
          }}>
          <FilterIcon stroke={props.filterColor}/>
        </Pressable>
        <SettingsIcon stroke={header_icon_color}/>
        <SearchIcon stroke={header_icon_color}/>
      </Box>
    </HeaderBase>
  );
};

interface BackHeaderProps {
  navigation: any
  rightMenu: ReactNode
  text: string
}

export const BackHeader = (props: BackHeaderProps) => {
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
        {props.text}
      </RobotoText>
      <View flex={1}>
        {props.rightMenu}
      </View>
    </HeaderBase>
  )
};
