import { Image, Pressable, View } from "@gluestack-ui/themed";
import { observer } from "mobx-react-lite";
import React from "react";
import { RobotoText } from "../common";
import { getImageSource } from "../../utils";
import Animated, { SharedValue, useAnimatedStyle } from "react-native-reanimated";
import { Outfit } from "../../stores/OutfitStore";
import { Rectangle } from "./models";

interface EditorMenuProps {
  positions: SharedValue<Rectangle[]>,
  selectedId: SharedValue<number | undefined>
  outfit: Outfit
  updateZIndex: (id: number, zIndex: number)=>void
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
      gap={20}
    >
      <Pressable
        onPress={() => {
          console.log('down')
          if (props.selectedId.value !== undefined) {
            const zIndex = props.positions.value[props.selectedId.value].zIndex;

            props.updateZIndex(props.selectedId.value, zIndex - 1);
          }

        }}
      >
        <RobotoText>down</RobotoText>
      </Pressable>

      <View
        flexDirection="row"
        justifyContent="center"
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

      <Pressable
        onPress={() => {
          console.log('down')
          if (props.selectedId.value !== undefined) {
            const zIndex = props.positions.value[props.selectedId.value].zIndex;

            props.updateZIndex(props.selectedId.value, zIndex + 1);
          }

        }}
      >
        <RobotoText>up</RobotoText>
      </Pressable>
    </View>
  )
});
