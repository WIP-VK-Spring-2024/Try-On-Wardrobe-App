import React from "react";
import { Avatar as GluestackAvatar, AvatarFallbackText, AvatarImage } from "@gluestack-ui/themed"
import { ImageSourcePropType } from 'react-native'
import { observer } from "mobx-react-lite";
import { PRIMARY_COLOR } from "../consts"

interface AvatarProps {
  name: string
  source?: string | ImageSourcePropType
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}

export const Avatar = observer(({ name, source, size }: AvatarProps) => {
  return (
    <GluestackAvatar bg={PRIMARY_COLOR} borderRadius="$full" size={size}>
      <AvatarFallbackText>{name}</AvatarFallbackText>
      <AvatarImage w="100%" h="100%" source={source} alt={name}/>
    </GluestackAvatar>
  );
});
