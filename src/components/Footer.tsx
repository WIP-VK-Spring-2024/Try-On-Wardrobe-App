import React from 'react'
import { Box } from "@gluestack-ui/themed";
import { windowWidth } from "../consts";

import NewsPaperIcon from '../../assets/icons/paper.svg';
import GarmentIcon from '../../assets/icons/garment.svg';
import AddBtnIcon from '../../assets/icons/add-btn.svg';
import OutfitIcon from '../../assets/icons/outfit.svg';
import HangerIcon from '../../assets/icons/hanger.svg';
import { observer } from 'mobx-react-lite';

export const Footer = observer(({navigation}: {navigation: any}) => {
    const normalSize = windowWidth / 8;
    const addBtnSize = normalSize + 20;
    return (
      <Box
        bg="$white" 
        display="flex" 
        flexDirection='row' 
        justifyContent='space-around'
        alignItems='center'
        
      >
        <NewsPaperIcon width={normalSize} height={normalSize} onPress={() => navigation.navigate('Another')}/>
        <GarmentIcon  width={normalSize} height={normalSize} onPress={() => navigation.navigate('Home')}/>
        <AddBtnIcon  width={addBtnSize} height={addBtnSize}/>
        <OutfitIcon  width={normalSize} height={normalSize}/>
        <HangerIcon  width={normalSize} height={normalSize}/>
      </Box>
    )
})
