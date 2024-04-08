import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { KitEditor } from "../components/editor/Editor";
import { BackHeader } from "../components/Header";
import { Pressable, View } from "@gluestack-ui/themed";

import SaveIcon from '../../assets/icons/save.svg';
import { ACTIVE_COLOR } from "../consts";
import { useSharedValue } from "react-native-reanimated";
import { RectangleWithPayload } from "../components/editor/models";
import { garmentKit } from "../stores/GarmentKitStore";
import { autorun } from "mobx";
import { itemFromRect, rectFromItem } from "../components/editor/utils";
import { useCanvasRef } from "@shopify/react-native-skia";

import RNFS from 'react-native-fs';

interface KitEditorHeaderProps {
  navigation: any
  onSave?: ()=>void
}

export const KitEditorHeader = (props: KitEditorHeaderProps) => {
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
    />
  )
}

export type GarmentRect = RectangleWithPayload<string>;

export const KitEditorScreen = observer(({navigation}: {navigation: any}) => {
  const positions = useSharedValue<GarmentRect[]>(garmentKit.items.map(rectFromItem));

  const canvasRef = useCanvasRef();

  useEffect(() => {
    autorun(() => {
      positions.value = garmentKit.items.map(rectFromItem);
    })
  }, [])

  const onSave = () => {
    garmentKit.setItems(positions.value.map(itemFromRect));

    canvasRef.current?.makeImageSnapshotAsync()
      .then(image => {
        const bytes = image.encodeToBase64();
        RNFS.mkdir(RNFS.DocumentDirectoryPath + '/outfit');

        const fileName = `${Date.now()}.png`

        RNFS.writeFile(RNFS.DocumentDirectoryPath + `/outfit/${fileName}`, bytes, 'base64');

        garmentKit.setImage({
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
      <KitEditorHeader navigation={navigation} onSave={onSave}/>
      <KitEditor positions={positions} canvasRef={canvasRef}/>
    </View>
  )
});
