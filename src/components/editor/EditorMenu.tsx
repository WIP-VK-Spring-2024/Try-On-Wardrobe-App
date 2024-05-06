import { Image, Pressable, View } from "@gluestack-ui/themed";
import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import { RobotoText } from "../common";
import { getImageSource } from "../../utils";
import Animated, { SharedValue, useAnimatedStyle } from "react-native-reanimated";
import { Outfit, OutfitItem } from "../../stores/OutfitStore";
import { RectangleWithIndex } from "./models";

import TrashIcon from '../../../assets/icons/trash.svg';
import LayerUpIcon from '../../../assets/icons/layer-up.svg';
import LayerDownIcon from '../../../assets/icons/layer-down.svg';
import AddGarmentIcon from '../../../assets/icons/add-btn.svg';
import { GarmentCard } from "../../stores/GarmentStore";

const ELEMENT_SIZE = 40;

interface EditorMenuGarmentProps {
  id: number
  selectedId: SharedValue<number | undefined>
  garment: OutfitItem
}

const EditorMenuGarment = observer((props: EditorMenuGarmentProps) => {
  const style =  useAnimatedStyle(() => {
    return {
      borderWidth: 2,
      borderColor: props.selectedId.value === props.id ? "lightblue" : "transparent"
    }
  })

  return (
    <Pressable
      onPress={() => {
        props.selectedId.value = props.id;
      }}
    >
      <Animated.View
        style={style}
      >
        { 
          props.garment.image && <Image
            alt="img"
            width={ELEMENT_SIZE}
            height={ELEMENT_SIZE}
            source={getImageSource(props.garment.image)}
          /> 
        }
      </Animated.View>
    </Pressable>
  )
})

interface EditorMenuProps {
  navigation: any
  positions: SharedValue<RectangleWithIndex[]>,
  selectedId: SharedValue<number | undefined>
  outfit: Outfit
  moveUp: (id: number)=>void
  moveDown: (id: number)=>void
}

export const EditorMenu = observer((props: EditorMenuProps) => {
  const garments = props.outfit.items;

  return (
    <View
      display='flex'
      justifyContent="center"
      padding={20}
      gap={20}
    >
      <View
        flexDirection="row"
        justifyContent="center"
        gap={20}
      >
        {
          garments.map((garment, i) => {
            return (
              <EditorMenuGarment
                key={i}
                garment={garment}
                id={i}
                selectedId={props.selectedId}
              />
            )
          })
        }

        <Pressable
          justifyContent="center"
          alignItems="center"

          onPress={() => {
            props.navigation.navigate("Outfit/Garment", {outfit: props.outfit, oldItems: []})
          }}
        >
          <AddGarmentIcon width={ELEMENT_SIZE} height={ELEMENT_SIZE} stroke="white"/>
        </Pressable>

      </View>

      <View
        flexDirection="row"
        justifyContent="center"
        gap={20}
      >
        <Pressable
          onPress={() => {
            if (props.selectedId.value !== undefined) {
              const newPositions = [...props.positions.value];

              const id = props.selectedId.value;
              props.selectedId.value = undefined;

              // delete newPositions[id];

              // props.positions.value = newPositions;

              props.outfit.removeGarment(props.outfit.items[id].garmentUUID);
            }
          }}
        >
          <TrashIcon width={ELEMENT_SIZE} height={ELEMENT_SIZE}/>
        </Pressable>

        <Pressable
          onPress={() => {
            console.log('down')
            if (props.selectedId.value !== undefined) {
              props.moveDown(props.selectedId.value);
            }

          }}
        >
          <LayerDownIcon width={ELEMENT_SIZE} height={ELEMENT_SIZE}/>
        </Pressable>
        <Pressable
          onPress={() => {
            console.log('up')
            if (props.selectedId.value !== undefined) {
              props.moveUp(props.selectedId.value);
            }
          }}
        >
          <LayerUpIcon width={ELEMENT_SIZE} height={ELEMENT_SIZE}/>          
        </Pressable>
      </View>

    </View>
  )
});
