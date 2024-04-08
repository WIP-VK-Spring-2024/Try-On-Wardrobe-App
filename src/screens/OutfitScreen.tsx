import React, { PropsWithChildren } from "react";
import { observer } from "mobx-react-lite";
import { BaseScreen } from './base';
import { GarmentCard } from "../stores/GarmentStore";
import { Badge, BadgeIcon, BadgeText, CheckCircleIcon, Image, Pressable, SlashIcon, View } from "@gluestack-ui/themed";
import { RobotoText } from "../components/common";
import { getImageSource } from "../utils";
import { Outfit, OutfitItem, outfitStore } from "../stores/OutfitStore";

import TrashIcon from '../../assets/icons/trash.svg';
import AddBtnIcon from '../../assets/icons/add-btn.svg';
import { MultipleSelectionGarmentList } from "../components/GarmentList";
import { BackHeader } from "../components/Header";
import { ButtonFooter } from "../components/Footer";
import { WINDOW_HEIGHT } from "../consts";
import { outfitScreenGarmentSelectionStore } from "../store";
import { StackActions } from "@react-navigation/native";
import { deleteOutfit } from "../requests/outfit";

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
  outfit: Outfit
}

const HGarmentCard = observer((props: PropsWithChildren & HGarmentCardProps): React.ReactNode => {
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
        onPress={()=>props.outfit.removeGarment(props.garment)}
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

interface OutfitGarmentSelectionScreenProps {
  navigation: any
  route: any
}

export const OutfitGarmentSelectionScreen = observer(
  (props: OutfitGarmentSelectionScreenProps) => {

    const outfit = props.route.params.outfit;
    const garment = props.route.params.garment;

    const header = (
      <BackHeader
        navigation={props.navigation}
        text="Одежда"
      />
    )

    const footer = outfitScreenGarmentSelectionStore.somethingIsSelected
      ? <ButtonFooter
        onPress={()=>{
          outfit.addGarments(outfitScreenGarmentSelectionStore.selectedItems);
          props.navigation.dispatch(StackActions.pop(1));
          props.navigation.navigate("Editor", {outfit: outfit});
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
          store={outfitScreenGarmentSelectionStore}
        />
      </BaseScreen>
    )
});

export const OutfitScreen = observer((props: {navigation: any, route: any}) => {
  const outfit: Outfit = props.route.params.outfit;
  const garments: GarmentCard[] = outfit.items
    .map((item: OutfitItem) => item.garment)
    .filter(item => item !== undefined) as any as GarmentCard[]
  
  const header = (
    <BackHeader
      navigation={props.navigation}
      text="Комплект"
      rightMenu={
        <Pressable
          onPress={async () => {
            if (outfit.uuid === undefined) {
              return false;
            }

            const deleteSuccess = await deleteOutfit(outfit.uuid);
            if (deleteSuccess) {
              props.navigation.dispatch(StackActions.pop(1));
              props.navigation.navigate('OutfitSelection');
            }
          }}
        >
          <TrashIcon width={25} height={25} fill="#ff0000"/>
        </Pressable>
      }
    />
  )

  return (
    <BaseScreen 
      navigation={props.navigation} 
      header={header}
    >
      <Pressable
        onPress={() => props.navigation.navigate('Editor', {outfit: outfit})}
      >
        { outfit.image === undefined
          ? <View
            width="100%"
            height={300}
            backgroundColor="#fefefe"
          >
          </View>
          : <Image
            source={getImageSource(outfit.image)}
            w="100%"
            height={WINDOW_HEIGHT / 2}
            resizeMode="contain"
            alt="outfit"
          />
        }
      </Pressable>
      <View
        margin={20}
        flexDirection="column"
        gap={20}
      >
        {
          garments.map((garment, i) => (
            <HGarmentCard 
              key={i}
              outfit={outfit}
              garment={garment}
              navigation={props.navigation}
            />
          ))
        }
        <HAddItemCard
          text="добавить одежду"
          onPress={()=>props.navigation.navigate("Outfit/Garment", {outfit: outfit})} 
        />
      </View>
    </BaseScreen>
  )
});
