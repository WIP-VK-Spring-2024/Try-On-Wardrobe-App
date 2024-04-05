import React from "react";
import { observer } from "mobx-react-lite";
import { KitEditor } from "../components/editor/Editor";
import { BackHeader } from "../components/Header";
import { Pressable } from "@gluestack-ui/themed";

import SaveIcon from '../../assets/icons/save.svg';
import { active_color } from "../consts";

export const KitEditorScreen = observer(({navigation}: {navigation: any}) => {
  return (
    <KitEditor/>
  )
});

interface KitEditorHeaderProps {
  navigation: any
  onPress?: ()=>void
}

export const KitEditorHeader = (props: KitEditorHeaderProps) => {
  return (
    <BackHeader
      navigation={props.navigation}
      text="Карточка"
      rightMenu={
      <Pressable
        onPress={props.onPress}
      >
        <SaveIcon
          width={30}
          height={30}

          fill={active_color}
        />
      </Pressable>}
    />
  )
}
