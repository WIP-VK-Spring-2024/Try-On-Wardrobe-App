import React, { PropsWithChildren, ReactNode } from 'react';

import {Avatar, AvatarFallbackText, Box, ChevronLeftIcon, Pressable, View} from '@gluestack-ui/themed';
import {PRIMARY_COLOR, HEADER_COLOR, HEADER_ICON_COLOR, TEXT_COLOR} from '../consts';
import {RobotoText} from './common';
import { StackActions } from '@react-navigation/native';

import FilterIcon from '../../assets/icons/filter.svg';
import SettingsIcon from '../../assets/icons/settings.svg';
import SearchIcon from '../../assets/icons/search.svg';
import { appState } from '../stores/AppState';
import { observer } from 'mobx-react-lite';
import { login } from '../../config'

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
  rightMenu?: ReactNode
}

export const Header = observer(({ rightMenu }: HeaderProps) => {
  return (
    <HeaderBase>
      <Box display="flex" flexDirection="row" gap="$2" alignItems="center">
        <Avatar bg={PRIMARY_COLOR} borderRadius="$full">
          <AvatarFallbackText>{login}</AvatarFallbackText>
        </Avatar>
        <RobotoText color={TEXT_COLOR} fontSize="$2xl">
          Try-On
        </RobotoText>
      </Box>
      {rightMenu === null || rightMenu || <GarmentHeaderButtons />}
    </HeaderBase>
  );
});

export const GarmentHeaderButtons = observer(() => {
  const filterIconColor = appState.filterModalVisible
    ? PRIMARY_COLOR
    : HEADER_ICON_COLOR;

  return (
    <Box display="flex" flexDirection="row" gap={20}>
      <Pressable
        onPress={() => {
          appState.setFilterModalVisible(true);
        }}>
        <FilterIcon stroke={filterIconColor} />
      </Pressable>
      {/* <SettingsIcon stroke={HEADER_ICON_COLOR}/> */}
      <SearchIcon stroke={HEADER_ICON_COLOR} />
    </Box>
  );
});

interface BackHeaderProps {
  navigation: any
  fontSize?: number
  rightMenu?: ReactNode
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
        flex={3}
        gap={3}
        onPress={() => {
          props.navigation.dispatch(StackActions.pop(1));
        }}
      >
        <ChevronLeftIcon size="xl" color={PRIMARY_COLOR} />
      </Pressable>
      <RobotoText
        color="#000"
        flex={10}
        textAlign='center'
        fontSize={props.fontSize || 32}
      >
        {props.text}
      </RobotoText>
      <View flex={3} display='flex' alignItems='flex-end' marginRight={5}>
        {props.rightMenu}
      </View>
    </HeaderBase>
  )
};
