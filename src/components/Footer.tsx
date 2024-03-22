import React from 'react';
import {Box} from '@gluestack-ui/themed';
import {add_btn_color, base_color, footer_color, footer_icon_color, windowWidth} from '../consts';

import NewsPaperIcon from '../../assets/icons/paper.svg';
import GarmentIcon from '../../assets/icons/garment.svg';
import AddBtnIcon from '../../assets/icons/add-btn.svg';
import OutfitIcon from '../../assets/icons/outfit.svg';
import HangerIcon from '../../assets/icons/hanger.svg';
import {observer} from 'mobx-react-lite';

import ImagePicker from 'react-native-image-crop-picker';
import RNFS from 'react-native-fs';
import { garmentStore } from '../stores/GarmentStore';

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
        onPress={() => {
          ImagePicker.openPicker({
            width: 300,
            height: 400,
            cropping: true,
          })
          .then(image => {
            const image_p = image.path.split('/');
            const image_name = image_p[image_p.length - 1];

            const new_path =
              RNFS.DocumentDirectoryPath + '/images/clothes/' + image_name;
            RNFS.moveFile(image.path, new_path).then(() => {
              // garmentStore.addItem(new_path);
            });
          })
          .catch(reason => console.log(reason))
        }}
      />

      <OutfitIcon width={normalSize} height={normalSize} stroke={footer_icon_color}/>
      <HangerIcon
        stroke={footer_icon_color}
        width={normalSize}
        height={normalSize}
        onPress={() => navigation.navigate('Person')}
      />
    </Box>
  );
});
