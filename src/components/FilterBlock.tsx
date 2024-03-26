import { observer } from 'mobx-react-lite';
import React, { useState, useEffect } from 'react';
import { active_color } from '../consts';
import { Pressable, ScrollView, View } from '@gluestack-ui/themed';
import { RobotoText } from './common';
import { GarmentCard, garmentStore } from '../stores/GarmentStore';
import { filteredGarmentStore } from '../stores/FilterStore';
import { garmentSubtypeSelectionStore, garmentTypeSelectionStore } from '../store';

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

type filterPredicateType = (item: GarmentCard) => boolean
interface BaseFilterType {
  name: string,
  filter: filterPredicateType,
  specifics: {
    name: string,
    filter: filterPredicateType
  }[]
}

export const TypeFilter = observer(() => {
  return (
    <View>
      <ScrollView
        display='flex'
        flexDirection='row'
        gap={20}
        horizontal={true}
      >
        <GarmentFilterBase 
          text='Все'
          isSelected={!garmentTypeSelectionStore.somethingIsSelected}
          onPress={() => garmentTypeSelectionStore.unselect()}
        />
        {
          garmentTypeSelectionStore.items.map((type, i) => (
            <GarmentFilterBase 
              key={i} 
              text={type.name} 
              isSelected={i === garmentTypeSelectionStore.selectedItemId}
              onPress={() => garmentTypeSelectionStore.select(i)}
            />
          ))
        }
      </ScrollView>
      {
        garmentTypeSelectionStore.somethingIsSelected &&
        <ScrollView
          horizontal={true}
        >
          <View
            display='flex'
            flexDirection='row'
            gap={10}
            marginLeft={10}
            marginRight={10}
          >
            {
              garmentTypeSelectionStore.selectedItem.subtypes.map((subtype, i) => (
                <GarmentFilterSpecific
                  key={i}
                  text={subtype.name}
                  isSelected={i === garmentSubtypeSelectionStore.selectedItemId}
                  onPress={() => garmentSubtypeSelectionStore.toggle(i)}
                />
              ))
            }
          </View>
        </ScrollView>
      }
    </View>
  )
})
