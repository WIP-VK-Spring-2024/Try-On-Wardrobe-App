import { Image, Pressable, View } from "@gluestack-ui/themed";
import { observer } from "mobx-react-lite";
import React from "react";
import { RobotoText } from "../common";
import { garmentKit } from "../../stores/GarmentKitStore";
import { getImageSource } from "../../utils";
import Animated, { SharedValue, useAnimatedStyle } from "react-native-reanimated";

interface EditorMenuProps {
  selectedId: SharedValue<number | undefined>
}

export const EditorMenu = observer((props: EditorMenuProps) => {
  const garments = garmentKit.items;

  const getStyle = (i: number) => useAnimatedStyle(() => {
    return {
      borderWidth: 2,
      borderColor: props.selectedId.value === i ? "lightblue" : "transparent"
    }
  })

  return (
    <View
      display='flex'
      flexDirection="row"
      justifyContent="center"
      padding={20}
      gap={5}
    >
      {
        garments.map((garment, i) => {
          return (
            <Pressable
              key={i}
              onPress={() => {
                props.selectedId.value = i;
              }}
            >
              <Animated.View
                style={getStyle(i)}
              >
                <Image
                  alt="img"
                  size="xs"
                  source={getImageSource(garment.image)}
                />
              </Animated.View>
            </Pressable>
          )
        })
      }
    </View>
  )
});
