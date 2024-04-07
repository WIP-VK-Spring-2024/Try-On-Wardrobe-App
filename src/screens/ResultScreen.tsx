import React from "react";
import { observer } from "mobx-react-lite";
import { BaseScreen } from "./base";
import { Box, HStack } from "@gluestack-ui/themed";
import { Spinner } from "@gluestack-ui/themed";
import { RobotoText } from "../components/common";
import { Image } from "@gluestack-ui/themed";
import { resultStore } from "../store";
import { ACTIVE_COLOR } from "../consts";
import { RatingButtons } from "../components/TryOnRating";
import { StyleSheet } from 'react-native'

const style = StyleSheet.create({
    overlay: {
      width: 3,
      height: 3,
      position: 'absolute',
      right: 10,
      bottom: 10,
    },
  });

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
            <Spinner size="large" color={ACTIVE_COLOR} />
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
            <RatingButtons
                style={style.overlay}
                buttonWidth={50}
                buttonHeight={50}
                uuid={resultStore.resultUUID || ''}
                rating={resultStore.resultRating || 0} />
          </Box>
        )}
      </Box>
    </BaseScreen>
  );
});
