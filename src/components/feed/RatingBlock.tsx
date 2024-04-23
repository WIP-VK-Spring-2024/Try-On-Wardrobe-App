import React from 'react';

import LikeIcon from '../../../assets/icons/my-like.svg';
import DislikeIcon from '../../../assets/icons/my-dislike.svg';
import { observer } from 'mobx-react-lite';
import { View } from '@gluestack-ui/themed';
import { Pressable } from '@gluestack-ui/themed';
import { RobotoText } from '../common';
import { PRIMARY_COLOR } from '../../consts';

export type RatingStatus = 'liked' | 'disliked' | undefined

export const getRatingFromStatus = (status: RatingStatus) => {
  if (status === 'liked') {
    return 1;
  } 

  if (status === 'disliked') {
    return -1;
  }

  return 0;
}

export const getStatusFromRating = (rating: number) => {
  if (rating === 1) {
    return 'liked';
  }

  if (rating === -1) {
    return 'disliked';
  }

  return undefined;
}

export interface RatingBlockProps {
  rating: number
  status: RatingStatus

  setStatus: (status: RatingStatus) => void
}

export const RatingBlock = observer((props: RatingBlockProps) => {
  const icon_size = 16;

  const toggleRatingStatus = (status: RatingStatus) => {
    return () => {
      if (props.status === status) {
        props.setStatus(undefined);
      } else {
        props.setStatus(status);
      }
    }
  }

  return (
    <View
      flexDirection="row"
      justifyContent="center"
      alignItems="center"
      gap={5}
    >
      <Pressable
        padding={5}
        onPress={toggleRatingStatus('liked')}
      >
        <LikeIcon 
          width={icon_size}
          height={icon_size} 
          stroke="#000000"
          fill={props.status === 'liked' ? PRIMARY_COLOR: "#ffffff"}
        />
      </Pressable>

      <RobotoText fontSize={14}>{props.rating}</RobotoText>

      <Pressable
        padding={5}
        onPress={toggleRatingStatus('disliked')}
      >
        <DislikeIcon
          width={icon_size}
          height={icon_size}
          stroke={"#000000"}
          fill={props.status === 'disliked' ? PRIMARY_COLOR : "#ffffff"}
        />
      </Pressable>
    </View>
  )
})
