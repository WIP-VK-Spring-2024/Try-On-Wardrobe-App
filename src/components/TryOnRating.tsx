import React from 'react';
import LikeIcon from '../../assets/icons/like.svg';
import DislikeIcon from '../../assets/icons/dislike.svg';
import {observer} from 'mobx-react-lite';
import {Rating} from '../stores/TryOnStore';
import {
    likeTryOnResult,
    dislikeTryOnResult,
    removeTryOnResultRating,
} from '../requests/rate';
import {Pressable, Box} from '@gluestack-ui/themed';
import { ACTIVE_COLOR, PRIMARY_COLOR } from '../consts';

export const RatingButtons = observer(
    ({
        style,
        buttonWidth,
        buttonHeight,
        uuid,
        rating,
    }: {
        style?: any;
        buttonWidth: number;
        buttonHeight: number;
        uuid: string;
        rating: Rating;
    }) => {
        return (<Box
              style={style}
              w="100%"
              display="flex"
              flexDirection="row"
              justifyContent="space-around"
              alignItems="center">
              <LikeButton
                width={buttonWidth}
                height={buttonHeight}
                uuid={uuid}
                rating={rating}/>
              <DislikeButton
                width={buttonWidth}
                height={buttonHeight}
                uuid={uuid}
                rating={rating}/>
            </Box>);
})

export const DislikeButton = observer(
    ({
        width,
        height,
        uuid,
        rating,
    }: {
        width: number;
        height: number;
        uuid: string;
        rating: Rating;
    }) => {
        const strokeColor = rating == Rating.Dislike
                        ? ACTIVE_COLOR
                        : PRIMARY_COLOR
        return (
            <Pressable
                onPress={
                    rating == Rating.Dislike
                        ? removeTryOnResultRating(uuid)
                        : dislikeTryOnResult(uuid)
                }>
                <DislikeIcon
                    width={width}
                    height={height}
                    stroke={strokeColor}/>
            </Pressable>
        );
    },
);

export const LikeButton = observer(
    ({
        width,
        height,
        uuid,
        rating,
    }: {
        width: number;
        height: number;
        uuid: string;
        rating: Rating;
    }) => {
      const strokeColor = rating == Rating.Like
                      ? ACTIVE_COLOR
                      : PRIMARY_COLOR
        return (
            <Pressable
                onPress={
                    rating == Rating.Like
                        ? removeTryOnResultRating(uuid)
                        : likeTryOnResult(uuid)
                }>
                <LikeIcon
                    width={width}
                    height={height}
                    stroke={strokeColor}/>
            </Pressable>
        );
    },
);
