import React from 'react';

import {Avatar, AvatarFallbackText, Box} from '@gluestack-ui/themed';
import {active_color, base_color} from '../consts';
import {RobotoText} from './common';

import FilterIcon from '../../assets/icons/filter.svg';
import SettingsIcon from '../../assets/icons/settings.svg';
import SearchIcon from '../../assets/icons/search.svg';

export const Header = () => {
  return (
    <Box
      bg={base_color}
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
        <RobotoText color="#FFFFFF" fontSize="$2xl">
          Try-On
        </RobotoText>
      </Box>
      <Box display="flex" flexDirection="row" gap={20}>
        <FilterIcon />
        <SettingsIcon />
        <SearchIcon />
      </Box>
    </Box>
  );
};
