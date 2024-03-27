import React from "react";
import { observer } from "mobx-react-lite";
import { BaseScreen } from "./base";
import { Box, HStack } from "@gluestack-ui/themed";
import { Spinner } from "@gluestack-ui/themed";
import { RobotoText } from "../components/common";
import { Image } from "@gluestack-ui/themed";
import { resultStore } from "../store";

import LikeIcon from '../../assets/icons/like.svg';
import DislikeIcon from '../../assets/icons/dislike.svg';
import { active_color } from "../consts";

export const ResultScreen = observer(({navigation}: {navigation: any}) => {
  return (
    <BaseScreen navigation={navigation}>
      <Box
        h={800}
        w="100%"
        display="flex"
        justifyContent="center"
        alignItems="center">
        {resultStore.resultUrl === undefined ? (
          <HStack>
            <Spinner size="large" color={active_color} />
            <RobotoText>Загрузка...</RobotoText>
          </HStack>
        ) : (
          <Box w="100%" h="100%" display="flex" flexDirection="column">
            <Image
              w="100%"
              h="80%"
              source={resultStore.resultUrl}
              alt="result"
            />
            <Box
              w="100%"
              display="flex"
              flexDirection="row"
              justifyContent="space-around"
              alignItems="center">
              <DislikeIcon width={50} height={50} />
              <LikeIcon width={50} height={50} />
            </Box>
          </Box>
        )}
      </Box>
    </BaseScreen>
  );
});
