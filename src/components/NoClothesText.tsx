import React from "react";
import { View } from "@gluestack-ui/themed";
import { RobotoText } from "./common";
import { ACTIVE_COLOR } from "../consts";
import AddIcon from "../../assets/icons/add-btn.svg"

export const NoClothesText = (props: {afterIconText?: string}) => {
  return (
    <View w="100%" marginTop={10}>
      <View flexDirection="row">
        <View flex={1}></View>
        <View flex={8}>
          <RobotoText>У вас пока нет вещей.</RobotoText>
          <View flexDirection="row" alignItems="center" gap={5} margin={0} padding={0} justifyContent="flex-start">
            <RobotoText> Добавьте их, используя кнопку</RobotoText>
            <AddIcon
              fill={ACTIVE_COLOR}
              stroke="#ffffff"
              width={25}
              height={25}
            />
            {!props.afterIconText ? <RobotoText>!</RobotoText> : undefined}
          </View>
          {props.afterIconText ? <RobotoText>{props.afterIconText}</RobotoText> : undefined}
        </View>
        <View flex={1}></View>
      </View>
    </View>
  );
};
