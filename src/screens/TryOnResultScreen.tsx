import React from "react";
import { observer } from "mobx-react-lite";
import { WINDOW_WIDTH, WINDOW_HEIGHT, BASE_COLOR } from "../consts"
import { getImageSource } from "../utils"
import ImageModal from 'react-native-image-modal';
import { TryOnResultCard } from '../stores/TryOnStore'
import { View, Image } from "@gluestack-ui/themed"
import { BaseScreen } from "./BaseScreen";
import { BackHeader } from "../components/Header";

const TryOnImage = observer(({tryOnResult} : {tryOnResult: TryOnResultCard}) => {
  return (
    <ImageModal
      source={getImageSource(tryOnResult.image)}
      style={{
        width: WINDOW_WIDTH - 30,
        height: WINDOW_HEIGHT / 2,
      }}
      overlayBackgroundColor={BASE_COLOR + 'a0'}
      resizeMode="contain"
    />
  )
});

export const TryOnResultScreen = observer((props: {route: any, navigation: any}) => {
  const tryOnResult = props.route.params.tryOnResult as TryOnResultCard;
  const header = <BackHeader navigation={props.navigation} text="Результат примерки" />

  return (
    <BaseScreen 
      navigation={props.navigation}
      header={header}
      footer={null}
    >
      <View
        display="flex" 
        flexDirection='column' 
        gap={20}
        alignContent='center'
        marginLeft={20}
        marginRight={20}
        marginBottom={100}
      >
        <TryOnImage tryOnResult={tryOnResult}/>
        
      </View>
    </BaseScreen>
  );
});
