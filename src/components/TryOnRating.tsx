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
import { ACTIVE_COLOR } from '../consts';

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
              <DislikeButton
                width={buttonWidth}
                height={buttonHeight}
                uuid={uuid}
                rating={rating}/>
              <LikeButton
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
                    stroke={ACTIVE_COLOR}
                    fill={rating == Rating.Dislike
                        ? ACTIVE_COLOR
                        : "transparent"
                    }/>
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
                    stroke={ACTIVE_COLOR}
                    fill={rating == Rating.Like
                        ? ACTIVE_COLOR
                        : "transparent"
                    }/>
            </Pressable>
        );
    },
);
