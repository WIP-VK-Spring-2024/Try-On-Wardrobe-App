import React, { PropsWithChildren } from "react";
import { observer } from "mobx-react-lite";
import { BaseScreen } from './base';
import { GarmentCard } from "../stores/GarmentStore";
import { Badge, BadgeIcon, BadgeText, CheckCircleIcon, Image, Pressable, SlashIcon, View } from "@gluestack-ui/themed";
import { RobotoText } from "../components/common";

import TrashIcon from '../../assets/icons/trash.svg';
import { garmentKit } from "../stores/GarmentKitStore";
import { getImageSource } from "../utils";

interface HGarmentCardProps {
  garment: GarmentCard
}

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

const HGarmentCard = observer((props: PropsWithChildren & HGarmentCardProps) => {
  return (
    <View
      backgroundColor="white"
      flexDirection="row"
      justifyContent="space-between"
      borderRadius={20}
      {...props}
    >
      <Image
        alt="img"
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
    </View>
  )
})

export const GarmentKitScreen = observer(({navigation}: {navigation: any}) => {
  const garments = garmentKit.items.map(item => item.garment).filter(item => item !== undefined)
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
            <HGarmentCard key={i} garment={garment}/>
          ))
        }
      </View>
    </BaseScreen>
  )
});
