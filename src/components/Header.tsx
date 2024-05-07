import React, { PropsWithChildren, ReactNode } from 'react';

import { Box, ChevronLeftIcon, Pressable, View} from '@gluestack-ui/themed';
import {PRIMARY_COLOR, ACTIVE_COLOR, HEADER_COLOR, HEADER_ICON_COLOR, TEXT_COLOR} from '../consts';
import {RobotoText} from './common';
import { StackActions } from '@react-navigation/native';

import FilterIcon from '../../assets/icons/filter.svg';
import SettingsIcon from '../../assets/icons/settings.svg';
import SearchIcon from '../../assets/icons/search.svg';
import { appState } from '../stores/AppState';
import { observer } from 'mobx-react-lite';

import { garmentScreenFilteredGarmentStore,
         tryOnScreenFilteredGarmentStore,
         outfitScreenFilteredGarmentStore} from '../store';

import { FilterStore } from '../stores/FilterStore';
import { GarmentCard } from '../stores/GarmentStore';
import { profileStore } from '../stores/ProfileStore';
import { Avatar } from './Avatar';
import { getOptionalImageSource } from '../utils';

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
  navigation: any
}

export const Header = observer(({ rightMenu, navigation }: HeaderProps) => {
  return (
    <HeaderBase>
      <Box display="flex" flexDirection="row" gap="$2" alignItems="center">
        <Pressable
          onPress={() => {
            navigation.navigate('Profile');
          }}>
          <Avatar
            name={profileStore.currentUser?.name || ''}
            source={
              getOptionalImageSource(profileStore.currentUser?.avatar)
            }
          />
        </Pressable>
        <RobotoText color={TEXT_COLOR} fontSize="$2xl">
          TryOn Wardrobe
        </RobotoText>
      </Box>
      {rightMenu === null || rightMenu || <GarmentHeaderButtons />}
    </HeaderBase>
  );
});

export const GarmentHeaderButtons = observer(() => {
  const getCurrentFilterStore = () => {
    if (appState.screen === 'Home') {
      return garmentScreenFilteredGarmentStore;
    }

    if (appState.screen === 'TryOn') {
      return tryOnScreenFilteredGarmentStore;
    }

    if (appState.screen === 'OutfitSelection') {
      return outfitScreenFilteredGarmentStore;
    }

    return undefined;
  }

  const filtersAreActive = (store: FilterStore<GarmentCard> | undefined) => {
    if (store === undefined) {
      return false;
    }

    return store.hasFilter('style_filter') || store.hasFilter('tags_filter');
  }

  const filterIconColor = filtersAreActive(getCurrentFilterStore())
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
      {/* <SearchIcon stroke={HEADER_ICON_COLOR} /> */}
    </Box>
  );
});

interface BackHeaderProps {
  navigation: any
  fontSize?: number
  rightMenu?: ReactNode
  text?: string
  textOverflowEllipsis?: boolean;
  onBackPress?: ()=>void
}

export const BackHeader = (props: BackHeaderProps & React.PropsWithChildren) => {
  const onBackPress = props.onBackPress || (() => {props.navigation.dispatch(StackActions.pop(1));})

  return (
    <HeaderBase>
      <Pressable
        flexDirection="row"
        justifyContent="space-between"
        alignItems="flex-end"
        flex={3}
        onPress={onBackPress}>
        <ChevronLeftIcon size="xl" color={ACTIVE_COLOR} />
      </Pressable>

      <View flex={10} alignItems="center">
        {props.children || (
          <RobotoText
            color="#000"
            numberOfLines={props.textOverflowEllipsis ? 1 : undefined}
            textAlign="center"
            fontSize={props.fontSize || 24}>
            {props.text}
          </RobotoText>
        )}
      </View>

      <View flex={3} alignItems="flex-end" marginRight={5}>
        {props.rightMenu}
      </View>
    </HeaderBase>
  );
};
