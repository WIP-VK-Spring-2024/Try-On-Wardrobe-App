import React from 'react';
import {Box} from '@gluestack-ui/themed';
import {base_color, windowWidth} from '../consts';

import NewsPaperIcon from '../../assets/icons/paper.svg';
import GarmentIcon from '../../assets/icons/garment.svg';
import AddBtnIcon from '../../assets/icons/add-btn.svg';
import OutfitIcon from '../../assets/icons/outfit.svg';
import HangerIcon from '../../assets/icons/hanger.svg';
import {observer} from 'mobx-react-lite';

import ImagePicker from 'react-native-image-crop-picker';
import RNFS from 'react-native-fs';
import {clothesSelectionStore} from '../store';

export const Footer = observer(({navigation}: {navigation: any}) => {
  const normalSize = windowWidth / 8;
  const addBtnSize = normalSize + 20;
  return (
    <Box
      // bg="$white"
      bg={base_color}
      display="flex"
      flexDirection="row"
      justifyContent="space-around"
      alignItems="center">
      <NewsPaperIcon width={normalSize} height={normalSize} />
      <GarmentIcon
        width={normalSize}
        height={normalSize}
        onPress={() => navigation.navigate('Home')}
      />

      <AddBtnIcon
        width={addBtnSize}
        height={addBtnSize}
        onPress={() => {
          ImagePicker.openPicker({
            width: 300,
            height: 400,
            cropping: true,
          }).then(image => {
            console.log(image);
            const image_p = image.path.split('/');
            const image_name = image_p[image_p.length - 1];

            const new_path =
              RNFS.DocumentDirectoryPath + '/images/clothes/' + image_name;
            RNFS.moveFile(image.path, new_path).then(() => {
              clothesSelectionStore.addItem(new_path);
            });
          });
        }}
      />

      <OutfitIcon width={normalSize} height={normalSize} />
      <HangerIcon
        width={normalSize}
        height={normalSize}
        onPress={() => navigation.navigate('Person')}
      />
    </Box>
  );
});
