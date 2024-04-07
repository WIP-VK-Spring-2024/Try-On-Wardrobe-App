import React, { PropsWithChildren } from "react";
import { observer } from "mobx-react-lite";
import { BaseScreen } from './base';
import { GarmentCard } from "../stores/GarmentStore";
import { Badge, BadgeIcon, BadgeText, CheckCircleIcon, Image, Pressable, SlashIcon, View } from "@gluestack-ui/themed";
import { RobotoText } from "../components/common";

import TrashIcon from '../../assets/icons/trash.svg';
import { garmentKit } from "../stores/GarmentKitStore";
import { getImageSource } from "../utils";

const TryOnAbleBadge = () => {
  return (
    <Badge size="md" variant="solid" borderRadius="$none" action="success">
      <BadgeText>Примеряемая</BadgeText>
      <BadgeIcon as={CheckCircleIcon} ml="$2" />
    </Badge>
  )
}

const NonTryOnAbleBadge = () => {
  return (
    <Badge size="md" variant="solid" borderRadius="$none" action="warning">
      <BadgeText>Не примеряемая</BadgeText>
      <BadgeIcon as={SlashIcon} ml="$2" />
    </Badge>
  )
}

interface HGarmentCardProps {
  garment: GarmentCard
  navigation: any
}

const HGarmentCard = observer((props: PropsWithChildren & HGarmentCardProps) => {
  return (
    <Pressable
      backgroundColor="white"
      flexDirection="row"
      justifyContent="space-between"
      borderRadius={20}
      overflow="hidden"
      onPress={() => {
        props.navigation.navigate('Garment', {garment: props.garment})
      }}
      {...props}
    >
      <Image
        alt={props.garment.name}
        width={100}
        height={100}
        source={getImageSource(props.garment.image)}
      />
      <View
        flexDirection="column"
        justifyContent="center"
        gap={40}
      >
        <RobotoText>{props.garment.name}</RobotoText>
        {
          props.garment.tryOnAble
          ? <TryOnAbleBadge/>
          : <NonTryOnAbleBadge/>
        }
      </View>
      <Pressable
        justifyContent="center"
        alignItems="center"
      >
        <TrashIcon width={60} height={60} fill="#fe0000"/>
      </Pressable>
    </Pressable>
  )
})

const AddHGarmentScreen = observer((props: {navigation: any}) => {
  return (
    <Pressable
      backgroundColor="white"
      flexDirection="row"
      justifyContent="space-between"
      borderRadius={20}
      overflow="hidden"
      // onPress={() => {
      //   props.navigation.navigate('Garment', {garment: props.garment})
      // }}
      {...props}
    >
      <RobotoText>Добавить одежду</RobotoText>
    </Pressable>
  )
})

export const GarmentKitScreen = observer(({navigation}: {navigation: any}) => {
  const garments: GarmentCard[] = garmentKit.items.map(item => item.garment).filter(item => item !== undefined) as GarmentCard[]
  return (
    <BaseScreen navigation={navigation}>
      <Pressable
        onPress={() => navigation.navigate('Editor')}
      >
        <View
          width="100%"
          height={300}
          backgroundColor="#fefefe"
        >
        </View>
      </Pressable>
      <View
        margin={20}
        flexDirection="column"
        gap={20}
      >
        {
          garments.map((garment, i) => (
            <HGarmentCard key={i} garment={garment} navigation={navigation}/>
          ))
        }
      </View>
    </BaseScreen>
  )
});
