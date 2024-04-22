import React from "react";
import { observer } from "mobx-react-lite";
import { CloseIcon, Pressable, View } from "@gluestack-ui/themed";
import InfoIcon from "../../assets/icons/info.svg";
import { ACTIVE_COLOR, BASE_COLOR, PRIMARY_COLOR, WINDOW_HEIGHT, WINDOW_WIDTH } from "../consts";
import { CARD_PROPS } from "./BaseList";

interface TooltipProps {
  isOpen: boolean
  hide: () => void
  top?: number;
  bottom?: number;
  margin?: number;
}

export const Tooltip = observer(
  ({isOpen, hide, top, bottom, margin, children}: TooltipProps & React.PropsWithChildren) => {
    return (
      <View
        // onPress={props.hide}
        flexDirection="row"
        display={isOpen ? 'flex' : 'none'}
        position="absolute"
        marginHorizontal={margin}
        w="90%"
        bottom={bottom}
        top={top}
        backgroundColor={CARD_PROPS.backgroundColor}
        zIndex={1}
        padding={8}
        borderRadius={CARD_PROPS.borderRadius}
        borderColor={ACTIVE_COLOR}
        borderWidth={2}>
        <View flex={1}>
          <InfoIcon width={25} height={25} fill="#000000"/>
        </View>
        <View flex={9}>
          {children}
        </View>
        <Pressable flex={1} onPress={hide}>
          <CloseIcon />
        </Pressable>
      </View>
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
    <Pressable onPress={onPress}>
      <InfoIcon width={size} height={size} fill={fill} />
    </Pressable>
  );
});
