import { observer } from 'mobx-react-lite';
import React from 'react';
import { active_color } from '../consts';
import { Pressable, ScrollView, View } from '@gluestack-ui/themed';
import { RobotoText } from './common';
import { 
        garmentScreenTypeSelectionStore, 
        garmentScreenSubtypeSelectionStore, 
        SingleSelectionStore
       } from '../store';

interface FilterTabProps {
    text: string
    isSelected: boolean
    onPress: () => void
  }
  
export const GarmentFilterBase = observer((props: FilterTabProps) => {
  const style = () => {
    let style = {
      margin: 10
    }
    if (props.isSelected) {
      Object.assign(style, {
        borderBottomColor: active_color,
        borderBottomWidth: 2
      })
    }

    return style;
  }

  return (
    <Pressable
      style={style()}
      onPress={props.onPress}
    >
      <RobotoText
        fontSize={24}
        color={props.isSelected ? active_color : "#000000"}
      >
        {props.text}
      </RobotoText>
    </Pressable>
  )
})

const GarmentFilterSpecific = observer((props: FilterTabProps) => {
  return (
    <Pressable
      borderRadius={20}
      bgColor={props.isSelected ? active_color : '#ffffff'}
      onPress={props.onPress}
      paddingLeft={10}
      paddingRight={10}
    >
      <RobotoText
        fontSize={18}
        color={props.isSelected ? '#ffffff' : '#000000'}
      >
        {props.text}
      </RobotoText>
    </Pressable>
  )
})

interface TypeFilterProps {
  typeStore: SingleSelectionStore
  subtypeStore: SingleSelectionStore
}

export const TypeFilter = observer(({typeStore, subtypeStore}: TypeFilterProps) => {
  return (
    <View>
      <ScrollView
        display='flex'
        flexDirection='row'
        gap={20}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
      >
        <GarmentFilterBase 
          text='Все'
          isSelected={!typeStore.somethingIsSelected}
          onPress={() => typeStore.unselect()}
        />
        {
          typeStore.items.map((type, i) => (
            <GarmentFilterBase 
              key={i} 
              text={type.name} 
              isSelected={i === typeStore.selectedItemId}
              onPress={() => typeStore.select(i)}
            />
          ))
        }
      </ScrollView>
      {
        typeStore.somethingIsSelected &&
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
        >
          <View
            display='flex'
            flexDirection='row'
            gap={10}
            marginLeft={10}
            marginRight={10}
          >
            {
              typeStore.selectedItem.subtypes.map((subtype: any, i: number) => (
                <GarmentFilterSpecific
                  key={i}
                  text={subtype.name}
                  isSelected={i === subtypeStore.selectedItemId}
                  onPress={() => subtypeStore.toggle(i)}
                />
              ))
            }
          </View>
        </ScrollView>
      }
    </View>
  )
})
