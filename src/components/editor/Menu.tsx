import { View } from "@gluestack-ui/themed";
import { observer } from "mobx-react-lite";
import React from "react";
import { RobotoText } from "../common";

export const EditorMenu = observer(() => {
  return (
    <View
      display='flex'
      flexDirection="row"
      justifyContent="center"
      padding={20}

    >
      <RobotoText>text</RobotoText>
    </View>
  )
});
