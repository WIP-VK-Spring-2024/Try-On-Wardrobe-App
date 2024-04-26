import { observer } from 'mobx-react-lite';
import React, { PropsWithChildren } from 'react';
import { ACTIVE_COLOR } from '../consts';
import { Pressable, ScrollView, View } from '@gluestack-ui/themed';
import { RobotoText } from './common';
import { SingleSelectionStore } from '../stores/SelectionStore';
import { GarmentType, Updateable } from '../stores/GarmentStore';

interface FilterTabProps {
    text: string
    isSelected: boolean
    onPress: () => void
  }
  
export const GarmentFilterBase = observer((props: FilterTabProps & PropsWithChildren) => {
  const style = () => {
    let style = {
      margin: 10
    }
    if (props.isSelected) {
      Object.assign(style, {
        borderBottomColor: ACTIVE_COLOR,
        borderBottomWidth: 2
      })
    }

    return style;
  }

  return (
    <Pressable
      style={style()}
      {...props}
    >
      <RobotoText
        fontSize={20}
        color={props.isSelected ? ACTIVE_COLOR : "#000000"}
      >
        {props.text}
      </RobotoText>
    </Pressable>
  )
})

const GarmentFilterSpecific = observer((props: FilterTabProps) => {
  return (
    <Pressable
      borderRadius={15}
      bgColor={props.isSelected ? ACTIVE_COLOR : '#ffffff'}
      onPress={props.onPress}
      padding={2}
      paddingLeft={15}
      paddingRight={15}
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
  typeStore: SingleSelectionStore<GarmentType>
  subtypeStore: SingleSelectionStore<Updateable>
}

export const TypeFilter = observer(({typeStore, subtypeStore}: TypeFilterProps) => {
  return (
    <View
      marginBottom={10}
    >
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
      >
        <View
          display='flex'
          flexDirection='row'
        >
          <GarmentFilterBase 
            text='Все'
            isSelected={!typeStore.somethingIsSelected}
            onPress={() => typeStore.unselect()}
          />
          {
            typeStore.items.map((type: GarmentType, i: number) => (
              <GarmentFilterBase 
                key={i} 
                text={type.name} 
                isSelected={i === typeStore.selectedItemId}
                onPress={() => {
                    typeStore.select(i);
                    subtypeStore.unselect();
                }}
              />
            ))
          }
        </View>
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
              typeStore.selectedItem?.subtypes.map((subtype: any, i: number) => (
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
