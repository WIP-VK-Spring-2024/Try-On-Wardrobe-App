import { observer } from 'mobx-react-lite';
import React, { useState } from 'react';
import RNFS from 'react-native-fs';
import { garmentScreenSelectionStore } from '../store';
import { Box, Image } from '@gluestack-ui/themed';
import { GarmentCardEdit, garmentStore, Season } from '../stores/GarmentStore';
import { active_color, windowHeight } from '../consts';

import EditIcon from '../assets/icons/edit.svg';

import WinterIcon from '../assets/icons/seasons/winter.svg';
import SpringIcon from '../assets/icons/seasons/spring.svg';
import SummerIcon from '../assets/icons/seasons/summer.svg';
import AutumnIcon from '../assets/icons/seasons/autumn.svg';
import { Pressable } from '@gluestack-ui/themed';
import { CustomSelect, IconWithCaption, UpdateableText } from '../components/common';

export const GarmentScreen = observer((props: {navigation: any}) => {
  const [inEditing, setInEditing] = useState(false);
  const [garment, setGarmentEditStore] = useState(new GarmentCardEdit(garmentScreenSelectionStore.selectedItem as GarmentCard));

  const GarmentImage = observer(() => {
    return (
      <Image 
        source={'file://' + RNFS.DocumentDirectoryPath + '/images/clothes' + garment.image.uri}
        w="auto"
        h={windowHeight / 2}
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
        <IconWithCaption icon={<WinterIcon {...seasonIconProps('winter')}/>} caption="зима" />
        <IconWithCaption icon={<SpringIcon {...seasonIconProps('spring')}/>} caption="весна" />
        <IconWithCaption icon={<SummerIcon {...seasonIconProps('summer')}/>} caption="лето" />
        <IconWithCaption icon={<AutumnIcon {...seasonIconProps('autumn')}/>} caption="осень" />
      </Box>
    )
  });

  return (
    <Box 
      display="flex" 
      flexDirection='column' 
      gap={20}
      alignContent='center'
      marginLeft={40}
      marginRight={40}
    >
      <GarmentImage/>
      <GarmentNameInput/>
      <GarmentSeasonIcons/>

      <CustomSelect 
        items={garmentStore.types}
        selectedItem={garment.type?.name}
        onChange={(value) => {
          const type = garmentStore.getTypeByUUID(value);

          if (type !== undefined) {
            garment.setType(type);
          }
        }}
        placeholder='Тип'
      />
      <CustomSelect 
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
})
