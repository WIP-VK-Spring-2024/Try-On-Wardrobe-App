import React from 'react';

import {Avatar, AvatarFallbackText, Box} from '@gluestack-ui/themed';
import {active_color, header_color, header_icon_color, text_color} from '../consts';
import {RobotoText} from './common';

import FilterIcon from '../../assets/icons/filter.svg';
import SettingsIcon from '../../assets/icons/settings.svg';
import SearchIcon from '../../assets/icons/search.svg';

export const Header = () => {
  return (
    <Box
      bg={header_color}
      $base-height={60}
      display="flex"
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
      $base-padding="$2">
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
    </Box>
  );
};
