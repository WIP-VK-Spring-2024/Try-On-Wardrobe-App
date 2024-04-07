import React, { PropsWithChildren } from "react";
import { observer } from "mobx-react-lite";
import { BaseScreen } from './base';
import { GarmentCard } from "../stores/GarmentStore";
import { Badge, BadgeIcon, BadgeText, CheckCircleIcon, Image, Pressable, SlashIcon, View } from "@gluestack-ui/themed";
import { RobotoText } from "../components/common";
import { getImageSource } from "../utils";
import { garmentKit } from "../stores/GarmentKitStore";

import TrashIcon from '../../assets/icons/trash.svg';
import AddBtnIcon from '../../assets/icons/add-btn.svg';
import { MultipleSelectionGarmentList } from "../components/GarmentList";
import { kitScreenFilteredGarmentStore, kitScreenGarmentSelectionStore } from "../store";
import { BackHeader } from "../components/Header";
import { ButtonFooter } from "../components/Footer";

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

interface HAddItemCardProps {
  text: string
  onPress?: () => void
}

const HAddItemCard = observer((props: PropsWithChildren & HAddItemCardProps) => {
  return (
    <Pressable
      backgroundColor="white"
      flexDirection="row"
      justifyContent="center"
      alignItems="center"
      gap={20}
      borderRadius={20}
      overflow="hidden"
      height={100}
      {...props}
    >
      <AddBtnIcon width={50} height={50}/>
      <RobotoText fontSize={24}>{props.text}</RobotoText>
    </Pressable>
  )
})

interface KitGarmentSelectionScreenProps {
  navigation: any

}

export const KitGarmentSelectionScreen = observer(
  (props: KitGarmentSelectionScreenProps) => {

    const header = (
      <BackHeader
        navigation={props.navigation}
        text="Одежда"
      />
    )

    const footer = kitScreenGarmentSelectionStore.somethingIsSelected
      ? <ButtonFooter
        onPress={()=>{
          garmentKit.addGarments(kitScreenGarmentSelectionStore.selectedItems);
          console.log(garmentKit.items)
          props.navigation.navigate("GarmentKit");
        }}
      />
      : undefined

    return (
      <BaseScreen 
        navigation={props.navigation}
        header={header}
        footer={footer}
      >
        <MultipleSelectionGarmentList 
          store={kitScreenGarmentSelectionStore}
        />
      </BaseScreen>
    )
});

export const KitScreen = observer((props: {navigation: any, route: any}) => {
  const garments: GarmentCard[] = garmentKit.items.map(item => item.garment).filter(item => item !== undefined) as GarmentCard[]
  
  const header = (
    <BackHeader
      navigation={props.navigation}
      text="Комплект"
    />
  )

  return (
    <BaseScreen 
      navigation={props.navigation} 
      header={header}
    >
      <Pressable
        onPress={() => props.navigation.navigate('Editor')}
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
            <HGarmentCard key={i} garment={garment} navigation={props.navigation}/>
          ))
        }
        <HAddItemCard
          text="добавить одежду"
          onPress={()=>props.navigation.navigate("GarmentKit/Garment")} 
        />
      </View>
    </BaseScreen>
  )
});
