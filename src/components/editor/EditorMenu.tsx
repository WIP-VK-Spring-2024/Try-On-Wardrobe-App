import { Image, Pressable, View } from "@gluestack-ui/themed";
import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import { RobotoText } from "../common";
import { getImageSource } from "../../utils";
import Animated, { SharedValue, useAnimatedStyle, useDerivedValue } from "react-native-reanimated";
import { Outfit } from "../../stores/OutfitStore";
import { Rectangle, RectangleWithIndex } from "./models";

interface EditorMenuProps {
  positions: SharedValue<RectangleWithIndex[]>,
  selectedId: SharedValue<number | undefined>
  outfit: Outfit
  // updateZIndex: (id: number, zIndex: number)=>void
  moveUp: (id: number)=>void
  moveDown: (id: number)=>void
}

export const EditorMenu = observer((props: EditorMenuProps) => {
  const garments = props.outfit.items;

  useEffect(() => {
    console.log('rerender')
  })

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
            props.moveDown(props.selectedId.value);

            // props.updateZIndex(props.selectedId.value, closest || zIndex - 1);
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
          console.log('up')
          if (props.selectedId.value !== undefined) {
            props.moveUp(props.selectedId.value);
          }
        }}
      >
        <RobotoText>up</RobotoText>
      </Pressable>
    </View>
  )
});
