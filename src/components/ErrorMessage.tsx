import { View } from "@gluestack-ui/themed";
import { observer } from "mobx-react-lite";
import React from "react";
import { RobotoText } from "./common";
import { TextProps } from "react-native";
import { DELETE_BTN_COLOR } from "../consts";

interface ErrorMessageProps {
  shown: boolean
  // setShown: (shown: boolean) => void
  msg: string
};

export const ErrorMessage = observer((props: ErrorMessageProps & TextProps) => {
  return (
    <View display={props.shown ? 'flex' : 'none'}>
      <RobotoText color={DELETE_BTN_COLOR} {...props}>{props.msg}</RobotoText>
    </View>
  );
});
