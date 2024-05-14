import React from "react";
import { observer } from "mobx-react-lite";
import { BaseScreen } from "./BaseScreen";
import { Box, HStack, View } from "@gluestack-ui/themed";
import { RobotoText } from "../components/common";
import { Header } from "../components/Header";
import { Image } from "@gluestack-ui/themed";
import { resultStore } from "../store";
import { PRIMARY_COLOR, WINDOW_HEIGHT } from "../consts";
import { RatingButtons } from "../components/TryOnRating";
import { StyleSheet } from 'react-native'
import { useFocusEffect } from "@react-navigation/native";
import { LoadingSpinner } from "../components/LoadingSpinner";

const style = StyleSheet.create({
    overlay: {
      // width: 3,
      // height: 3,
      position: 'absolute',
      // right: 10,
      bottom: 10,
    },
  });

export const ResultScreen = observer(({navigation}: {navigation: any}) => {
  useFocusEffect(React.useCallback(() => {
    return () => resultStore.clearResult();
  }, []));

  return (
    <BaseScreen
      navigation={navigation}
      header={<Header navigation={navigation} rightMenu={null} />}>
      <Box h={WINDOW_HEIGHT-130} w="100%" display="flex" alignItems="center" justifyContent="center">
        {resultStore.resultUrl === undefined ? (
          <LoadingSpinner />
        ) : (
          <Box w="100%" flex={1}>
            <Image
              w="100%"
              flex={1}
              // aspectRatio={1}
              source={resultStore.resultUrl}
              alt="result"
            />
            <RatingButtons
              style={style.overlay}
              buttonWidth={50}
              buttonHeight={50}
              uuid={resultStore.resultUUID || ''}
              rating={resultStore.resultRating || 0}
            />
          </Box>
        )}
      </Box>
    </BaseScreen>
  );
});
