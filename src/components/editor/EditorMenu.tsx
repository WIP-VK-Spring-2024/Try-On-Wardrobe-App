import { Image, Pressable, View } from "@gluestack-ui/themed";
import { observer } from "mobx-react-lite";
import React from "react";
import { getImageSource } from "../../utils";
import Animated, { SharedValue, useAnimatedStyle } from "react-native-reanimated";
import { Outfit } from "../../stores/OutfitStore";

interface EditorMenuProps {
  selectedId: SharedValue<number | undefined>
  outfit: Outfit
}

export const EditorMenu = observer((props: EditorMenuProps) => {
  const garments = props.outfit.items;

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
                { 
                  garment.image && <Image
                    alt="img"
                    size="xs"
                    source={getImageSource(garment.image)}
                  /> 
                }
              </Animated.View>
            </Pressable>
          )
        })
      }
    </View>
  )
});
