import React from 'react';
import {Box, Button, Center} from '@gluestack-ui/themed';
import {ACTIVE_COLOR, ADD_BTN_COLOR, BASE_COLOR, FOOTER_COLOR, FOOTER_ICON_COLOR, WINDOW_WIDTH} from '../consts';
import { useRoute } from '@react-navigation/native';

import NewsPaperIcon from '../../assets/icons/paper.svg';
import GarmentIcon from '../../assets/icons/garment.svg';
import AddBtnIcon from '../../assets/icons/add-btn.svg';
import OutfitIcon from '../../assets/icons/outfit.svg';
import HangerIcon from '../../assets/icons/hanger.svg';
import {observer} from 'mobx-react-lite';

import RNFS from 'react-native-fs';
import { RobotoText } from './common';
import { appState } from '../stores/AppState';

export const Footer = observer(({navigation}: {navigation: any}) => {
  const normalSize = WINDOW_WIDTH / 8;
  const addBtnSize = normalSize + 20;

  const route = useRoute();

  return (
    <Box
      bg={FOOTER_COLOR}
      display="flex"
      flexDirection="row"
      justifyContent="space-around"
      alignItems="center">
      <NewsPaperIcon width={normalSize} height={normalSize} stroke={FOOTER_ICON_COLOR}/>

      <GarmentIcon
        stroke={FOOTER_ICON_COLOR}
        width={normalSize}
        height={normalSize}
        fill={route.name === 'Home' ? ACTIVE_COLOR : FOOTER_COLOR}
        onPress={() => navigation.navigate('Home')}
      />

      <AddBtnIcon
        stroke={ADD_BTN_COLOR}
        width={addBtnSize}
        height={addBtnSize}
        onPress={() => appState.toggleCreateMenuVisible()}
      />

      <OutfitIcon
        width={normalSize}
        height={normalSize}
        stroke={FOOTER_ICON_COLOR}
        onPress={() => navigation.navigate('OutfitSelection')}
       />
    
      <HangerIcon
        stroke={FOOTER_ICON_COLOR}
        width={normalSize}
        height={normalSize}
        onPress={() => navigation.navigate('TryOn')}
        fill={route.name=== 'TryOn' ? ACTIVE_COLOR : FOOTER_COLOR}
      />
    </Box>
  );
});

export const ButtonFooter = observer(({text, onPress}: {text?: string, onPress: () => void}) => {
  return (
    <Button onPress={() => onPress()} bgColor={ACTIVE_COLOR} h={65}>
      <Center>
        <RobotoText color="white" fontSize="$3xl">
          {text || 'Выбрать'}
        </RobotoText>
      </Center>
    </Button>
  );
});
