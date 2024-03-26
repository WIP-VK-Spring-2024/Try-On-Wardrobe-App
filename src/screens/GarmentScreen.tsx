import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import RNFS from 'react-native-fs';
import { garmentScreenSelectionStore } from '../store';
import { Box, Image, AlertDialog, AlertDialogBackdrop, AlertDialogContent, AlertDialogHeader, AlertDialogCloseButton, AlertDialogBody, ButtonGroup } from '@gluestack-ui/themed';
import { GarmentCard, GarmentCardEdit, garmentStore, Season } from '../stores/GarmentStore';
import { active_color, windowHeight } from '../consts';

import EditIcon from '../../assets/icons/edit.svg';
import HashTagIcon from '../../assets/icons/hashtag.svg';
import CrossIcon from '../../assets/icons/cross.svg';

import WinterIcon from '../../assets/icons/seasons/winter.svg';
import SpringIcon from '../../assets/icons/seasons/spring.svg';
import SummerIcon from '../../assets/icons/seasons/summer.svg';
import AutumnIcon from '../../assets/icons/seasons/autumn.svg';
import { Pressable } from '@gluestack-ui/themed';
import { CustomSelect, IconWithCaption, RobotoText, UpdateableText } from '../components/common';
import { BaseScreen } from './base';
import { Heading } from '@gluestack-ui/themed';
import { Icon } from '@gluestack-ui/themed';
import { AlertDialogFooter } from '@gluestack-ui/themed';
import { Button } from '@gluestack-ui/themed';
import { ButtonText } from '@gluestack-ui/themed';
import { CloseIcon } from '@gluestack-ui/themed';
import { getImageSource } from '../utils';
import { ButtonFooter } from '../components/Footer';
import { apiEndpoint } from '../../config';


export const GarmentScreen = observer((props: {navigation: any}) => {
  const [inEditing, setInEditing] = useState(false);
  const [showAlertDialog, setShowAlertDialog] = useState(false);

  const [garment, setGarmentEditStore] = useState(new GarmentCardEdit(garmentScreenSelectionStore.selectedItem as GarmentCard));

  useEffect(() => {
    props.navigation.addListener('beforeRemove', (e: any) => {
      if (garment.hasChanges) {
        setShowAlertDialog(true);

        e.preventDefault();
      }
    })
  })

  const saveChanges = () => {
    garment.saveChanges();

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
      .then()
      .catch(res => console.error(res))
  }

  const CloseAlertDialog = observer(() => {
    return (
      <AlertDialog
        isOpen={showAlertDialog}
        onClose={() => {
          setShowAlertDialog(false)
        }}
      >
        <AlertDialogBackdrop />
        <AlertDialogContent>
          <AlertDialogHeader>
            <Heading size="lg">Сохранение </Heading>
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
                  setShowAlertDialog(false)
                }}
              >
                <ButtonText>Отменить</ButtonText>
              </Button>
              <Button
                bg="$error600"
                action="negative"
                onPress={() => {
                  garment.clearChanges();
                  setShowAlertDialog(false)
                }}
              >
                <ButtonText>Сбросить</ButtonText>
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
        height={windowHeight / 2}
        resizeMode="contain"
        alt=""
        // sharedTransitionTag={`garment-img-${garment.uuid}`}
        // exiting={undefined}
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
        <UpdateableText
          text={garment.name}
          inEditing={inEditing}
          onUpdate={(text: string)=>{garment.setName(text)}}
        />
        <Pressable
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
        return active_color;
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

  const GarmentTagBlock = observer(() => {
    return (
      <Box
        display='flex'
        flexDirection='row'
        flexWrap='wrap'
        gap={20}
      >
        {
          garment.tags.map((tag, i) => {
            return (
              <Tag key={i} name={tag} isEditable={inEditing}/>
            )
          })
        }
      </Box>
    )
  });

  return (
    <BaseScreen 
      navigation={props.navigation}
      footer={
        <ButtonFooter text='Сохранить' onPress={saveChanges}/>
      }
    >
      <Box
        display="flex" 
        flexDirection='column' 
        gap={20}
        alignContent='center'
        marginLeft={40}
        marginRight={40}
        marginBottom={100}
      >
        <GarmentImage/>
        <GarmentNameInput/>
        <GarmentSeasonIcons/>
        <GarmentTypeSelector />
        <GarmentStyleSelector />
        <GarmentTagBlock />

        <Button
          size="md"
          variant="solid"
          action="negative"
          isDisabled={false}
          isFocusVisible={false}

          onPress={() => {
            fetch(apiEndpoint + `/clothes/${garment.uuid}`, {
              method: 'DELETE'
            }).then((response) => {
              if (garment.uuid) {
                garmentStore.removeGarment(garment.uuid);
              }
              props.navigation.navigate('Home');
            }).catch((err) => console.error(err))
          }}
        >
          <ButtonText>Удалить</ButtonText>
        </Button>

        <CloseAlertDialog />

      </Box>
    </BaseScreen>
  );
});
