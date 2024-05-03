import React, { PropsWithChildren, useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { BaseScreen } from '../BaseScreen';
import { appState, processNetworkError } from '../../stores/AppState';
import { GarmentCard } from "../../stores/GarmentStore";
import { Badge, BadgeIcon, BadgeText, Spinner, CheckCircleIcon, Image, Menu, MenuItem, Pressable, SlashIcon, View, HStack } from "@gluestack-ui/themed";
import { RobotoText, DeleteMenu, AlertModal } from "../../components/common";
import { getImageSource } from "../../utils";
import { Outfit, OutfitEdit, OutfitItem } from "../../stores/OutfitStore";
import { tryOnStore } from '../../stores/TryOnStore'

import { BackHeader } from "../../components/Header";
import { WINDOW_HEIGHT, FOOTER_COLOR, ACTIVE_COLOR, DISABLED_COLOR, PRIMARY_COLOR } from "../../consts";
import { StackActions, useFocusEffect } from "@react-navigation/native";
import { deleteOutfit, updateOutfit, updateOutfitFields } from "../../requests/outfit";
import DotsIcon from '../../../assets/icons/dots-vertical.svg';
import OutfitIcon from '../../../assets/icons/outfit.svg';
import HangerIcon from '../../../assets/icons/hanger.svg';
import TrashIcon from '../../../assets/icons/trash.svg';
import AddBtnIcon from '../../../assets/icons/add-btn.svg';
import { ButtonFooter } from "../../components/Footer";
import { UpdateableTextInput } from "../../components/UpdateableTextInput";
import { PrivacyCheckbox } from "../../components/PrivacyCheckbox";
import { TryOnButton } from "../../components/TryOnButton";

const tryOnAbleText = 'Можно примерить'
const notTryOnAbleText = 'Нельзя примерить'

const iconSize = 25

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
}

type Status = 'outfit' | 'try-on'

const HeaderMenu = (props: HeaderMenuProps) => {
  return (
    <Menu
      placement="bottom right"
      trigger={({ ...triggerProps }) => {
        return (
          <Pressable {...triggerProps}>
              <DotsIcon width={iconSize} height={iconSize}/>
          </Pressable>
        )
      }}
    >
      <MenuItem key="Delete" textValue="Delete" gap={10} onPress={props.onDelete}>
        <TrashIcon width={iconSize} height={iconSize}/>
        <RobotoText>Удалить</RobotoText>
      </MenuItem>
    </Menu>
  )
}

export const OutfitScreen = observer((props: {navigation: any, route: any}) => {
  const outfit: Outfit = props.route.params.outfit;
  const [oldItems, setOldItems] = useState(outfit.items.map(item => item.garmentUUID));

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
        />
      }
    />
  )

  const [edit, _] = useState(new OutfitEdit(outfit));

  const [showAlertDialog, setShowAlertDialog] = useState(false);

  useEffect(() => {
    return props.navigation.addListener('beforeRemove', (e: any) => {
      if (edit.hasChanges) {
        setShowAlertDialog(true);
        e.preventDefault();
      }
    })
  })

  const footer = edit.hasChanges ? (
    <ButtonFooter
      text="Сохранить изменения"
      onPress={() => {
        console.log(edit);

        updateOutfitFields(edit).then(_ => {
          edit.saveChanges();
          appState.setSuccessMessage('Изменения успешно сохранены');
          setTimeout(() => appState.closeSuccessMessage(), 2000);
        }).catch(err => processNetworkError(err));;
      }}
    />
  ) : null;

  const CarouselFooter = () => (
    <View alignItems="center" marginTop={5}>
      <View flexDirection="row" alignItems="center" gap={10}>
        <Pressable onPress={() => setStatus('outfit')}>
          <OutfitIcon width={45} height={45} fill={status === 'outfit' ? ACTIVE_COLOR : DISABLED_COLOR} />
        </Pressable>
        <Pressable onPress={() => setStatus('try-on')}>
          <HangerIcon width={35} height={35} stroke={status === 'try-on' ? ACTIVE_COLOR : DISABLED_COLOR} />
        </Pressable>
      </View>
    </View>
  );

  const CloseAlertDialog = observer(() => {
    return (
      <AlertModal
        header="Сохранение"
        text="Вы действительно хотите выйти, не сохранив изменения?"
        noText='Сбросить'
        yesText='Сохранить'
        isOpen={showAlertDialog}
        hide={() => setShowAlertDialog(false)}
        onAccept={() => {
          updateOutfitFields(edit).then(_ => {
            edit.saveChanges();
          }).catch(err => processNetworkError(err));
          
          props.navigation.dispatch(StackActions.pop(1));
        }}
        onReject={() => {
          edit.clearChanges();
          props.navigation.dispatch(StackActions.pop(1));
        }}
      />
    );
  });

  const [inEditing, setInEditing] = useState(false);

  const [status, setStatus] = useState<Status>(props.route.params.status || 'outfit');

  useEffect(() => {
    setStatus(props.route.params.status || 'outfit');
  }, [props.route.params]);

  useFocusEffect(React.useCallback(() => {
    setOldItems(outfit.items.map(item => item.garmentUUID));
  }, []));

  return (
    <>
      <BaseScreen navigation={props.navigation} header={header} footer={footer}>
        {status === 'outfit' ? (
          <Pressable
            onPress={() =>
              props.navigation.navigate('Editor', { outfit: outfit, oldItems: oldItems })
            }>
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
        ) : (
          <View
            height={WINDOW_HEIGHT / 2}
            alignItems="center"
            justifyContent="center">
            {outfit.try_on_result_id === undefined ? (
              <HStack>
                <Spinner size="large" color={PRIMARY_COLOR} />
                <RobotoText>Загрузка...</RobotoText>
              </HStack>
            ) : (
              <Image
                source={getImageSource(
                  tryOnStore.results.find(
                    item => item.uuid === outfit.try_on_result_id,
                  )?.image || { type: 'local', uri: '' },
                )}
                w="100%"
                height={WINDOW_HEIGHT / 2}
                resizeMode="contain"
                alt="try-on"
              />
            )}
          </View>
        )}

        <CarouselFooter />

        <View margin={20} flexDirection="column" gap={20}>
          <UpdateableTextInput
            text={edit.name}
            onUpdate={text => {
              edit.setName(text);
            }}
            inEditing={inEditing}
            setInEditing={setInEditing}
          />
          <View flexDirection="row">
            <View flex={3}></View>
            <View flex={5}>
              <PrivacyCheckbox
                text="Публичный образ"
                value={edit.privacy}
                setValue={privacy => {
                  edit.setPrivacy(privacy);
                }}
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
              props.navigation.navigate('Outfit/Garment', { outfit: outfit, oldItems: oldItems })
            }
          />
        </View>
      </BaseScreen>

      <CloseAlertDialog />
      <TryOnButton
        garments={garments}
        navigation={props.navigation}
        marginBottom={edit.hasChanges ? 56 : 0}
        nextScreen='Outfit'
        nextScreenParams={{outfit: outfit, status: 'try-on'}}
      />
    </>
  );
});
