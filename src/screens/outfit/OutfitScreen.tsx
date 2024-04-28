import React, { PropsWithChildren, useState } from "react";
import { observer } from "mobx-react-lite";
import { BaseScreen } from '../BaseScreen';
import { appState } from '../../stores/AppState';
import { GarmentCard } from "../../stores/GarmentStore";
import { Badge, BadgeIcon, BadgeText, CheckCircleIcon, Image, Menu, MenuItem, Pressable, SlashIcon, View } from "@gluestack-ui/themed";
import { RobotoText, DeleteMenu, UpdateableText } from "../../components/common";
import { getImageSource } from "../../utils";
import { Outfit, OutfitItem } from "../../stores/OutfitStore";

import { BackHeader } from "../../components/Header";
import { WINDOW_HEIGHT, FOOTER_COLOR, ACTIVE_COLOR, DELETE_BTN_COLOR, WINDOW_WIDTH } from "../../consts";
import { StackActions } from "@react-navigation/native";
import { deleteOutfit, updateOutfit } from "../../requests/outfit";
import DotsIcon from '../../../assets/icons/dots-vertical.svg';
import HangerIcon from '../../../assets/icons/hanger.svg';
import TrashIcon from '../../../assets/icons/trash.svg';
import AddBtnIcon from '../../../assets/icons/add-btn.svg';
import { ButtonFooter } from "../../components/Footer";
import { UpdateableTextInput } from "../../components/UpdateableTextInput";
import { PrivacyCheckbox } from "../../components/PrivacyCheckbox";

const tryOnAbleText = 'Можно примерить'
const notTryOnAbleText = 'Нельзя примерить'

const TryOnAbleBadge = () => {
  return (
    <Badge size="md" variant="solid" borderRadius="$none" action="success">
      <BadgeText>{tryOnAbleText}</BadgeText>
      <BadgeIcon as={CheckCircleIcon} ml="$2" />
    </Badge>
  )
}

const NonTryOnAbleBadge = () => {
  return (
    <Badge size="md" variant="solid" borderRadius="$none" action="warning">
      <BadgeText>{notTryOnAbleText}</BadgeText>
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
      justifyContent="space-around"
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
        gap={20}
      >
        <RobotoText fontWeight="bold">{props.garment.name}</RobotoText>
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
        <DeleteMenu onPress={()=>props.outfit.removeGarment(props.garment)}/>
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
      borderRadius={15}
      overflow="hidden"
      height={100}
      {...props}
    >
      <AddBtnIcon stroke={FOOTER_COLOR} fill={ACTIVE_COLOR} width={50} height={50}/>
      <RobotoText fontSize={24}>{props.text}</RobotoText>
    </Pressable>
  )
})

interface HeaderMenuProps {
  onDelete: () => void
  onTryOn: () => void
}

const HeaderMenu = (props: HeaderMenuProps) => {
  return (
    <Menu
      placement="bottom right"
      trigger={({ ...triggerProps }) => {
        return (
          <Pressable {...triggerProps}>
              <DotsIcon width={25} height={25}/>
          </Pressable>
        )
      }}
    >
      <MenuItem key="TryOn" textValue="TryOn" gap={10} onPress={props.onTryOn}>
        <HangerIcon width={25} height={25} fill="#000000"/>
        <RobotoText>примерить</RobotoText>
      </MenuItem>
      <MenuItem key="Delete" textValue="Delete" gap={10} onPress={props.onDelete}>
        <TrashIcon width={25} height={25}/>
        <RobotoText>удалить</RobotoText>
      </MenuItem>
    </Menu>
  )
}

export const OutfitScreen = observer((props: {navigation: any, route: any}) => {
  const outfit: Outfit = props.route.params.outfit;
  const garments: GarmentCard[] = outfit.items
    .map((item: OutfitItem) => item.garment)
    .filter(item => item !== undefined) as any as GarmentCard[];

  const header = (
    <BackHeader
      navigation={props.navigation}
      text={outfit.name === "Без названия" ? "Комплект" : outfit.name}
      rightMenu={
        <HeaderMenu
          onDelete={async () => {
            if (outfit.uuid === undefined) {
              return false;
            }

            const deleteSuccess = await deleteOutfit(outfit.uuid);
            if (deleteSuccess) {
              props.navigation.dispatch(StackActions.pop(1));
              props.navigation.navigate('OutfitSelection');
            }
          }}
          onTryOn={()=>{
            // props.navigation.navigate('Result');
            console.error('Not implemented error');
          }}
        />
      }
    />
  )

  const footer = (
    <ButtonFooter
      text="Сохранить"
      onPress={() =>
        updateOutfit(outfit).then(_ => {
          appState.setSuccessMessage('Изменения успешно сохранены');
          setTimeout(() => appState.closeSuccessMessage(), 2000);
        })
      }
    />
  );
  const [inEditing, setInEditing] = useState(false);

  return (
    <BaseScreen navigation={props.navigation} header={header} footer={footer}>
      <Pressable
        onPress={() => props.navigation.navigate('Editor', { outfit: outfit })}>
        {outfit.image === undefined ? (
          <View width="100%" height={300} backgroundColor="#fefefe"></View>
        ) : (
          <Image
            source={getImageSource(outfit.image)}
            w="100%"
            height={WINDOW_HEIGHT / 2}
            resizeMode="contain"
            alt="outfit"
          />
        )}
      </Pressable>
      <View margin={20} flexDirection="column" gap={20}>
        <UpdateableTextInput
          text={outfit.name}
          onUpdate={text => outfit.setName(text)}
          inEditing={inEditing}
          setInEditing={setInEditing}
        />
        <View flexDirection="row">
          <View flex={3}></View>
          <View flex={5}>
            <PrivacyCheckbox
              text="Опубликовать"
              value={outfit.privacy}
              setValue={privacy => outfit.setPrivacy(privacy)}
            />
          </View>
          <View flex={3}></View>
        </View>

        {garments.map((garment, i) => (
          <HGarmentCard
            key={i}
            outfit={outfit}
            garment={garment}
            navigation={props.navigation}
          />
        ))}
        <HAddItemCard
          text="Добавить одежду"
          onPress={() =>
            props.navigation.navigate('Outfit/Garment', { outfit: outfit })
          }
        />
      </View>
    </BaseScreen>
  );
});
