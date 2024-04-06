import React from 'react';
import {Box, Button, Center} from '@gluestack-ui/themed';
import {active_color, add_btn_color, base_color, footer_color, footer_icon_color, windowWidth} from '../consts';

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
  const normalSize = windowWidth / 8;
  const addBtnSize = normalSize + 20;
  return (
    <Box
      bg={footer_color}
      display="flex"
      flexDirection="row"
      justifyContent="space-around"
      alignItems="center">
      <NewsPaperIcon width={normalSize} height={normalSize} stroke={footer_icon_color}/>
      <GarmentIcon
        stroke={footer_icon_color}
        width={normalSize}
        height={normalSize}
        onPress={() => navigation.navigate('Home')}
      />

      <AddBtnIcon
        stroke={add_btn_color}
        width={addBtnSize}
        height={addBtnSize}
        onPress={() => appState.toggleCreateMenuVisible()}
      />

      <OutfitIcon width={normalSize} height={normalSize} stroke={footer_icon_color}/>
      <HangerIcon
        stroke={footer_icon_color}
        width={normalSize}
        height={normalSize}
        onPress={() => navigation.navigate('TryOn')}
      />
    </Box>
  );
});

export const ButtonFooter = observer(({text, onPress}: {text?: string, onPress: () => void}) => {
  return (
    <Button onPress={() => onPress()} bgColor={active_color} h={65}>
      <Center>
        <RobotoText color="white" fontSize="$3xl">
          {text || 'Выбрать'}
        </RobotoText>
      </Center>
    </Button>
  );
});
