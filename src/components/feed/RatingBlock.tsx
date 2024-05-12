import React from 'react';

import { observer } from 'mobx-react-lite';
import { View } from '@gluestack-ui/themed';
import { Pressable } from '@gluestack-ui/themed';
import { RobotoText } from '../common';
import { ACTIVE_COLOR, PRIMARY_COLOR } from '../../consts';

import HeartIcon from '../../../assets/icons/heart.svg';
import FilledHeartIcon from '../../../assets/icons/heart-filled.svg';
//import LikeIcon from '../../../assets/icons/my-like.svg';
import DislikeIcon from '../../../assets/icons/my-dislike.svg';

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
  const icon_size = 20;

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
    <Pressable
      flexDirection="row"
      justifyContent="center"
      alignItems="center"
      gap={5}
      padding={5}
      onPress={toggleRatingStatus('liked')}
    >
      {
        props.status === 'liked'
        ? <FilledHeartIcon
          width={icon_size}
          height={icon_size} 
          stroke={ACTIVE_COLOR}
          fill={ACTIVE_COLOR}
        />
        : <HeartIcon 
          width={icon_size}
          height={icon_size} 
        />
      }

      <RobotoText fontSize={14}>{props.rating}</RobotoText>
    </Pressable>
  )
})
