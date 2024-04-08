import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { OutfitEditor } from "../components/editor/Editor";
import { BackHeader } from "../components/Header";
import { Pressable, View } from "@gluestack-ui/themed";

import SaveIcon from '../../assets/icons/save.svg';
import { ACTIVE_COLOR } from "../consts";
import { useSharedValue } from "react-native-reanimated";
import { RectangleWithPayload } from "../components/editor/models";
import { autorun } from "mobx";
import { itemFromRect, rectFromItem } from "../components/editor/utils";
import { useCanvasRef } from "@shopify/react-native-skia";

import RNFS from 'react-native-fs';
import { Outfit } from "../stores/OutfitStore";
import { StackActions } from "@react-navigation/native";

interface OutfitEditorHeaderProps {
  navigation: any
  onSave?: ()=>void
}

export const OutfitEditorHeader = (props: OutfitEditorHeaderProps) => {
  return (
    <BackHeader
      navigation={props.navigation}
      text="Карточка"
      rightMenu={
      <Pressable
        onPress={props.onSave}
      >
        <SaveIcon
          width={30}
          height={30}

          fill={ACTIVE_COLOR}
        />
      </Pressable>}
      onBackPress={()=>{
        props.navigation.dispatch(StackActions.pop(2));
      }}
    />
  )
}

export type GarmentRect = RectangleWithPayload<string>;

interface OutfitEditorScreenProps {
  navigation: any
  route: any
}

export const OutfitEditorScreen = observer((props: OutfitEditorScreenProps) => {
  const { outfit }: {outfit: Outfit} = props.route.params;

  const positions = useSharedValue<GarmentRect[]>(outfit.items.map(rectFromItem));

  const canvasRef = useCanvasRef();

  useEffect(() => {
    autorun(() => {
      positions.value = outfit.items.map(rectFromItem);
    })
  }, [])

  const onSave = () => {
    outfit.setItems(positions.value.map(itemFromRect));

    canvasRef.current?.makeImageSnapshotAsync()
      .then(image => {
        const bytes = image.encodeToBase64();
        RNFS.mkdir(RNFS.DocumentDirectoryPath + '/outfit');

        const fileName = `${Date.now()}.png`

        RNFS.writeFile(RNFS.DocumentDirectoryPath + `/outfit/${fileName}`, bytes, 'base64');

        outfit.setImage({
          type: 'local',
          uri: `/outfit/${fileName}`
        });

      })
      .catch(reason => console.error(reason))
  }

  return (
    <View
      height="100%"
    >
      <OutfitEditorHeader navigation={props.navigation} onSave={onSave}/>
      <OutfitEditor positions={positions} outfit={outfit} canvasRef={canvasRef}/>
    </View>
  )
});
