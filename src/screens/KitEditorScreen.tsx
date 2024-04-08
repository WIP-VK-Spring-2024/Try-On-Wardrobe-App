import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { KitEditor } from "../components/editor/Editor";
import { BackHeader } from "../components/Header";
import { Pressable, View } from "@gluestack-ui/themed";

import SaveIcon from '../../assets/icons/save.svg';
import { PRIMARY_COLOR } from "../consts";
import { SharedValue, useSharedValue } from "react-native-reanimated";
import { Rectangle, RectangleWithPayload } from "../components/editor/models";
import { GarmentKitItem, GarmentKitItemRect, garmentKit } from "../stores/GarmentKitStore";
import { autorun, toJS } from "mobx";
import { itemFromRect, rectFromItem } from "../components/editor/utils";

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

          fill={PRIMARY_COLOR}
        />
      </Pressable>}
    />
  )
}

export type GarmentRect = RectangleWithPayload<string>;

export const KitEditorScreen = observer(({navigation}: {navigation: any}) => {
  const positions = useSharedValue<GarmentRect[]>(garmentKit.items.map(rectFromItem));

  useEffect(() => {
    autorun(() => {
      positions.value = garmentKit.items.map(rectFromItem);
    })
  }, [])

  const onSave = () => {
    garmentKit.setItems(positions.value.map(itemFromRect));
  }

  return (
    <View
      height="100%"
    >
      <KitEditorHeader navigation={navigation} onSave={onSave}/>
      <KitEditor positions={positions}/>
    </View>
  )
});
