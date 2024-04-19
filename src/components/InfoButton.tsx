import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import { Pressable, View } from "@gluestack-ui/themed";
import InfoIcon from "../../assets/icons/info.svg";
import { RobotoText } from "./common";
import { StyleSheet, TouchableWithoutFeedback } from 'react-native'
import { ACTIVE_COLOR, BASE_COLOR, PRIMARY_COLOR, WINDOW_HEIGHT, WINDOW_WIDTH } from "../consts";
import { CARD_PROPS } from "./BaseList";
import { Pre } from "@expo/html-elements";

interface TooltipProps {
  shown: boolean
  hide: () => void
  top?: number;
  bottom?: number;
  margin?: number;
}

const styles = StyleSheet.create({
  modalContent: {
    flex: 1,
    justifyContent: 'center',
    margin: '5%',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    width: WINDOW_WIDTH,
    height: WINDOW_HEIGHT,
    backgroundColor: "#00000066"
  },
});

export const Tooltip = observer(
  (props: TooltipProps & React.PropsWithChildren) => {
    return (
      <Pressable
        onPress={props.hide}
        display={props.shown ? 'flex' : 'none'}
        position="absolute"
        marginHorizontal={props.margin}
        w="90%"
        bottom={props.bottom}
        top={props.top}
        backgroundColor={CARD_PROPS.backgroundColor}
        zIndex={1}
        padding={8}
        borderRadius={CARD_PROPS.borderRadius}
        borderColor={ACTIVE_COLOR}
        borderWidth={2}>
        {props.children}
      </Pressable>
    );
  },
);

interface InfoButtonProps {
  size?: number
  fill: string
  onPress: () => void
}

export const InfoButton = observer(({size, onPress, fill}: InfoButtonProps) => {
  return (
    <>
      <Pressable onPress={onPress}>
        <InfoIcon width={size} height={size} fill={fill} />
      </Pressable>
    </>
  );
});
