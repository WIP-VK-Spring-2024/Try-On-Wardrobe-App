import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import { Box,  View, Input, InputField } from '@gluestack-ui/themed';
import { GarmentCard, GarmentCardEdit, garmentStore, Season } from '../stores/GarmentStore';
import { ACTIVE_COLOR, SECONDARY_COLOR, DELETE_BTN_COLOR, WINDOW_HEIGHT, WINDOW_WIDTH, BASE_COLOR, EXTRA_COLOR } from '../consts';
import { Pressable } from '@gluestack-ui/themed';
import { CustomSelect, IconWithCaption, RobotoText, AlertModal } from '../components/common';
import { BaseScreen } from './BaseScreen';
import { Heading } from '@gluestack-ui/themed';
import { Button } from '@gluestack-ui/themed';
import { ButtonFooter } from '../components/Footer';
import { StackActions } from '@react-navigation/native';
import { BackHeader } from '../components/Header';
import { TryOnButton } from "../components/TryOnButton"
import { UpdateableTextInput } from '../components/UpdateableTextInput'
import { getImageSource, nameErrorMsg } from '../utils'

import HashTagIcon from '../../assets/icons/hashtag.svg';
import CrossIcon from '../../assets/icons/cross.svg';

import WinterIcon from '../../assets/icons/seasons/winter.svg';
import SpringIcon from '../../assets/icons/seasons/spring.svg';
import SummerIcon from '../../assets/icons/seasons/summer.svg';
import AutumnIcon from '../../assets/icons/seasons/autumn.svg';

import TrashIcon from '../../assets/icons/trash.svg';
import { deleteGarment, updateGarment } from '../requests/garment';
import { appState } from '../stores/AppState';

import ImageModal from 'react-native-image-modal';
import { ErrorMessage } from '../components/ErrorMessage';
import { errorMsgTimeout } from '../consts';
import { TagBlock } from '../components/Tags';

export const GarmentHeader = (props: {name?: string, route: any, navigation: any}) => {
  return (
    <BackHeader
      navigation={props.navigation}
      text={props.name || "Карточка"}
      fontSize={24}
      textOverflowEllipsis={true}
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

const GarmentImage = observer(({garment} : {garment: GarmentCard}) => {
  return (
    <ImageModal
      source={getImageSource(garment.image)}
      style={{
        width: WINDOW_WIDTH - 30,
        height: WINDOW_HEIGHT / 2,
      }}
      overlayBackgroundColor={BASE_COLOR + 'a0'}
      resizeMode="contain"
    />
  )
});

export const GarmentScreen = observer((props: {route: any, navigation: any}) => {
  const [inEditing, setInEditing] = useState(false);
  const [showAlertDialog, setShowAlertDialog] = useState(false);

  const [garment, setGarmentEditStore] = useState(new GarmentCardEdit(props.route.params.garment as GarmentCard));
  const [tagInputValue, setTagInputValue] = useState('');

  const [errorMsg, setErrorMsg] = useState("");
  const [isErrorShown, setIsErrorShown] = useState(false);

  const [cancel, setCancel] = useState<NodeJS.Timeout>();
  const setError = (msg: string) => {
    clearTimeout(cancel);
    setErrorMsg(msg);
    setIsErrorShown(true);
    setCancel(setTimeout(() => setIsErrorShown(false), errorMsgTimeout));
  };

  useEffect(() => {
    garment.clearChanges();
  }, [
      props.route.params.garment.type,
      props.route.params.garment.subtype,
      props.route.params.garment.style,
      props.route.params.garment.tags,
      props.route.params.garment.seasons,
    ])

  useEffect(() => {
    return props.navigation.addListener('beforeRemove', (e: any) => {
      if (garment.hasChanges) {
        setShowAlertDialog(true);
        e.preventDefault();
      }
    })
  })

  const saveChanges = () => {
    setTagInputValue('');

    updateGarment(garment)
    .then(json => {
      console.log(json);

      if (!('msg' in json)) {
        garment.saveChanges();
        appState.setSuccessMessage('Изменения успешно сохранены');
        setTimeout(() => appState.closeSuccessMessage(), 2000);
        return;
      }

      garment.clearChanges();
      
      if (!('errors' in json)) {
        setError(json.msg);
        return;
      }

      const errors: string[] = [];
    
      if ('Name' in json.errors) {
        errors.push(nameErrorMsg('Название вещи', {spaces: true}));
      }

      if ('Tags' in json.errors) {
        errors.push(nameErrorMsg('Теги', {spaces: true, plural: true}));
      }

      setError(errors.join('\n\n'));
    })
    .catch(res => console.error(res));
  }

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
          saveChanges();
          props.navigation.dispatch(StackActions.pop(1));
        }}
        onReject={() => {
          garment.clearChanges();
          props.navigation.dispatch(StackActions.pop(1));
        }}
      />
    );
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
        return ACTIVE_COLOR;
      }
  
      return ACTIVE_COLOR+'44';
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
          w="49%"
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
          placeholder='Категория'
        />

        <CustomSelect
          w="49%"
          items={garmentStore.getAllSubtypes(garment.type)}
          selectedItem={garment.subtype?.name}
          onChange={(value) => {
            const subtype = garmentStore.getSubTypeByUUID(value);

            if (subtype !== undefined) {
              garment.setSubtype(subtype);
            }
          }}
          placeholder='Подкатегория'
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
          placeholder="Стиль"
        />
    );
  });

  const footer = garment.hasChanges ? (
    <ButtonFooter text="Сохранить изменения" onPress={saveChanges} />
  ) : null;

  return (
    <>
      <BaseScreen
        navigation={props.navigation}
        header={
          <GarmentHeader
            route={props.route}
            navigation={props.navigation}
            name={garment.name}
          />
        }
        footer={footer}>
        <View
          display="flex"
          flexDirection="column"
          gap={20}
          alignContent="center"
          marginLeft={20}
          marginRight={20}
          marginBottom={100}>
          <GarmentImage garment={garment} />
          
          <UpdateableTextInput
            text={garment.name}
            onUpdate={text => garment.setName(text)}
            inEditing={inEditing}
            setInEditing={setInEditing}
          />

          <ErrorMessage shown={isErrorShown} msg={errorMsg} />


          <GarmentSeasonIcons />
          <GarmentTypeSelector />
          <GarmentStyleSelector />

          <TagBlock
            tags={garment.tags}
            removeTag={(tag: string) => garment.removeTag(tag)}
            addTag={(tag: string) => garment.addTag(tag)}
            tagInputValue={tagInputValue}
            setTagInputValue={setTagInputValue}
          />

          <CloseAlertDialog />
        </View>
      </BaseScreen>

      {props.route.params.garment.tryOnAble && (
        <TryOnButton
          tryOnType='garment'
          garments={[props.route.params.garment]}
          navigation={props.navigation}
          marginBottom={garment.hasChanges ? 56 : 0}
        />
      )}
    </>
  );
});
