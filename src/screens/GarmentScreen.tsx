import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import { Box, Image, AlertDialog, AlertDialogBackdrop, AlertDialogContent, AlertDialogHeader, AlertDialogCloseButton, AlertDialogBody, ButtonGroup, View, Input, InputField, KeyboardAvoidingView, FormControl } from '@gluestack-ui/themed';
import { GarmentCard, GarmentCardEdit, garmentStore, Season } from '../stores/GarmentStore';
import { ACTIVE_COLOR, PRIMARY_COLOR, SECONDARY_COLOR, DELETE_BTN_COLOR, WINDOW_HEIGHT } from '../consts';
import { Pressable } from '@gluestack-ui/themed';
import { CustomSelect, IconWithCaption, RobotoText, UpdateableText } from '../components/common';
import { BaseScreen } from './BaseScreen';
import { Heading } from '@gluestack-ui/themed';
import { Icon } from '@gluestack-ui/themed';
import { AlertDialogFooter } from '@gluestack-ui/themed';
import { Button } from '@gluestack-ui/themed';
import { ButtonText } from '@gluestack-ui/themed';
import { CloseIcon } from '@gluestack-ui/themed';
import { getImageSource } from '../utils';
import { ButtonFooter } from '../components/Footer';
import { apiEndpoint } from '../../config';
import { StackActions } from '@react-navigation/native';
import { BackHeader } from '../components/Header';

import EditIcon from '../../assets/icons/edit.svg';
import HashTagIcon from '../../assets/icons/hashtag.svg';
import CrossIcon from '../../assets/icons/cross.svg';

import WinterIcon from '../../assets/icons/seasons/winter.svg';
import SpringIcon from '../../assets/icons/seasons/spring.svg';
import SummerIcon from '../../assets/icons/seasons/summer.svg';
import AutumnIcon from '../../assets/icons/seasons/autumn.svg';

import TrashIcon from '../../assets/icons/trash.svg';
import { deleteGarment } from '../requests/garment';
import { appState } from '../stores/AppState';

export const GarmentHeader = (props: {route: any, navigation: any}) => {
  return (
    <BackHeader
      navigation={props.navigation}
      text="Карточка"
      rightMenu={
      <Pressable
        onPress={async ()=>{
          const { garment } = props.route.params;
          const deleteSuccess = await deleteGarment(garment);

          if (deleteSuccess) {
            props.navigation.navigate('Home');
          }
        }}
      >
        <TrashIcon width={25} height={25} fill={DELETE_BTN_COLOR}/>
      </Pressable>}
    />
  )
};

export const GarmentScreen = observer((props: {route: any, navigation: any}) => {
  const [inEditing, setInEditing] = useState(false);
  const [showAlertDialog, setShowAlertDialog] = useState(false);

  const [garment, setGarmentEditStore] = useState(new GarmentCardEdit(props.route.params.garment as GarmentCard));
  const [tagInputValue, setTagInputValue] = useState('');

  useEffect(() => {
    return props.navigation.addListener('beforeRemove', (e: any) => {
      if (garment.hasChanges) {
        setShowAlertDialog(true);

        e.preventDefault();
      }
    })
  })

  const saveChanges = () => {
    garment.saveChanges();

    setTagInputValue('');

    const clearObj = (obj: any) => Object.keys(obj).forEach(key => obj[key] === undefined && delete obj[key])

    const garmentUpdate = (garment: GarmentCard) => ({
      uuid: garment.uuid,
      name: garment.name,
      type_id: garment.type?.uuid,
      subtype_id: garment.subtype?.uuid,
      style_id: garment.style?.uuid,
      tags: garment.tags,
      seasons: garment.seasons
    })

    const new_garment = garmentUpdate(garment)

    clearObj(new_garment)

    fetch(apiEndpoint + '/clothes/' + garment.uuid, {
      method: 'PUT',
      body: JSON.stringify(new_garment),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(()=>{
        appState.setSuccessMessage('Изменения успешно сохранены');
        setTimeout(()=>appState.closeSuccessMessage(), 2000);
      })
      .catch(res => console.error(res))
  }

  const CloseAlertDialog = observer(() => {
    const closeDialog = () => {
      setShowAlertDialog(false);
      props.navigation.dispatch(StackActions.pop(1));
    }
    return (
      <AlertDialog
        isOpen={showAlertDialog}
        onClose={() => {
          setShowAlertDialog(false);
        }}
      >
        <AlertDialogBackdrop />
        <AlertDialogContent>
          <AlertDialogHeader>
            <Heading size="lg">Сохранение</Heading>
            <AlertDialogCloseButton>
              <Icon as={CloseIcon} />
            </AlertDialogCloseButton>
          </AlertDialogHeader>
          <AlertDialogBody>
            <RobotoText size="sm">
              Вы действительно хотите выйти, не сохранив изменения?
            </RobotoText>
          </AlertDialogBody>
          <AlertDialogFooter>
            <ButtonGroup space="lg">
              <Button
                variant="outline"
                action="secondary"
                onPress={() => {
                  garment.clearChanges();
                  closeDialog();
                }}
              >
                <ButtonText>Сбросить</ButtonText>
              </Button>
              <Button
                bg={ACTIVE_COLOR}
                onPress={() => {
                  garment.saveChanges();
                  closeDialog();
                }}
              >
                <ButtonText>Сохранить</ButtonText>
              </Button>
            </ButtonGroup>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  });

  const GarmentImage = observer(() => {
    return (
      <Image 
        source={getImageSource(garment.image)}
        w="100%"
        height={WINDOW_HEIGHT / 2}
        resizeMode="contain"
        alt=""
      />
    )
  });

  const GarmentNameInput = observer(() => {
    return (
      <Box
        display="flex" 
        flexDirection="row"
        justifyContent='center'
        alignItems='center'
        gap={20}
      >
        <View flex={1}></View>
        <UpdateableText
          text={garment.name}
          inEditing={inEditing}
          onUpdate={(text: string)=>{garment.setName(text)}}
        />
        <Pressable
          flex={1}
          onPress={() => {
            setInEditing((oldInEditing: boolean) => !oldInEditing);
          }}
        >
          <EditIcon stroke="#000000"/>
        </Pressable>
      </Box>
    )
  });

  const SeasonIconPressable = (props: React.PropsWithChildren & {season: Season}) => {
    return (
      <Pressable
        onPress={() => {
          garment.toggleSeason(props.season);
        }}
      >
        {props.children}
      </Pressable>
    )
  }

  const GarmentSeasonIcons = observer(() => {
    const seasonIconSize = 40

    const getFill = (season: Season) => {
      if (garment.seasons.includes(season)) {
        return PRIMARY_COLOR;
      }
  
      return '#000';
    }
  
    const seasonIconProps = (season: Season) => ({
      width: seasonIconSize,
      height: seasonIconSize,
      fill: getFill(season)
    })
  
    return (
      <Box
        display='flex'
        flexDirection='row'
        justifyContent='center'
        gap={20}
      >
        <SeasonIconPressable season='winter'>
          <IconWithCaption icon={<WinterIcon {...seasonIconProps('winter')}/>} caption="зима" />
        </SeasonIconPressable>

        <SeasonIconPressable season='spring'>
          <IconWithCaption icon={<SpringIcon {...seasonIconProps('spring')}/>} caption="весна" />
        </SeasonIconPressable>

        <SeasonIconPressable season='summer'>
          <IconWithCaption icon={<SummerIcon {...seasonIconProps('summer')}/>} caption="лето" />
        </SeasonIconPressable>

        <SeasonIconPressable season='autumn'>
          <IconWithCaption icon={<AutumnIcon {...seasonIconProps('autumn')}/>} caption="осень" />
        </SeasonIconPressable>
      </Box>
    )
  });

  const GarmentTypeSelector = observer(() => {
    return (
      <Box
        display="flex"
        flexDirection='row'
        justifyContent='space-between'
      >
        <CustomSelect
          width="49%"
          items={garmentStore.types}
          selectedItem={garment.type?.name}
          onChange={(value) => {
            const type = garmentStore.getTypeByUUID(value);

            const oldType = garment.type;

            if (type !== undefined) {
              garment.setType(type);

              if (type !== oldType) {
                garment.setSubtype(undefined);
              }
            }
          }}
          placeholder='Тип'
        />
        <CustomSelect
          width="49%"
          items={garmentStore.getAllSubtypes(garment.type)}
          selectedItem={garment.subtype?.name}
          onChange={(value) => {
            const subtype = garmentStore.getSubTypeByUUID(value);

            if (subtype !== undefined) {
              garment.setSubtype(subtype);
            }
          }}
          placeholder='Подтип'
          disabled={garment.type === undefined}
        />
      </Box>
    )
  });

  const GarmentStyleSelector = observer(() => {
    return (
      <CustomSelect
        items={garmentStore.styles}
        selectedItem={garment.style?.name}
        onChange={value => {
          const style = garmentStore.getStyleByUUID(value);

          if (style !== undefined) {
            garment.setStyle(style);
          }
        }}
        placeholder='Стиль'
      />
    )
  })

  const Tag = observer((props: {name: string, isEditable: boolean}) => {
    return (
      <Box
        display='flex'
        flexDirection='row'
        gap={4}
        alignItems='center'
      >
        <HashTagIcon />
        <RobotoText>{props.name}</RobotoText>
        {
          props.isEditable 
          && <Pressable
              onPress={() => {
                garment.removeTag(props.name);
              }}
            >
              <CrossIcon />
            </Pressable>
        }
      </Box>
    )
  });

  const GarmentTagBlock = observer((props: {tagInputValue: string, setTagInputValue: (t: string)=>void}) => {
    const [tagInputValue, setTagInputValue] = useState(props.tagInputValue);
    
    return (
      <Box>
        <Heading>
          Теги
        </Heading>
        <Box
          display='flex'
          flexDirection='row'
          flexWrap='wrap'
          gap={20}
          rowGap={10}
          marginBottom={10}
        >
          {
            garment.tags.map((tag, i) => {
              return (
                <Tag key={i} name={tag} isEditable={inEditing}/>
              )
            })
          }
        </Box>
        <Box display='flex' flexDirection='row' justifyContent='space-between'>
          <Input
            w="67%"
            variant="outline"
            size="md"
            isDisabled={false}
            isInvalid={false}
            isReadOnly={false}
            justifyContent='space-between'
          >
            <InputField
              type="text"
              value={tagInputValue}
              onChangeText={(text: string) => setTagInputValue(text)}
              onEndEditing={()=>props.setTagInputValue(tagInputValue)}
            />
          </Input>
          <Button
              bg={SECONDARY_COLOR}
              onPress={() => {
                const value = tagInputValue.trim()
                if (tagInputValue == '' || garment.tags.includes(value)) {
                  return;
                }
                setTagInputValue('');
                garment.addTag(value);
              }}
            >
              <RobotoText color='#ffffff'>
                Добавить
              </RobotoText>
          </Button>
        </Box>
      </Box>
    )
  });

  return (
    <BaseScreen 
      navigation={props.navigation}
      header={<GarmentHeader route={props.route} navigation={props.navigation}/>}
      footer={
        <ButtonFooter text='Сохранить' onPress={saveChanges}/>
      }
    >
      <View
        display="flex" 
        flexDirection='column' 
        gap={20}
        alignContent='center'
        marginLeft={20}
        marginRight={20}
        marginBottom={100}
      >
        <GarmentImage/>
        <GarmentNameInput/>
        <GarmentSeasonIcons/>
        <GarmentTypeSelector />
        <GarmentStyleSelector />

        <GarmentTagBlock 
          tagInputValue={tagInputValue}
          setTagInputValue={setTagInputValue}
        />

        <CloseAlertDialog />
      </View>
    </BaseScreen>
  );
});
