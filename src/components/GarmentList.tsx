import React from 'react'

import { Box, ScrollView, Image } from "@gluestack-ui/themed";
import { ImageSourcePropType } from "react-native";
import { base_color, windowHeight } from "../consts";

export const GarmentList = (props: any) => {
    const clothes = [
      require('../../assets/clothes/1.png'),
      require('../../assets/clothes/2.png'),
      require('../../assets/clothes/3.png'),
      require('../../assets/clothes/4.png'),
      require('../../assets/clothes/5.png'),
      require('../../assets/clothes/6.png'),
    ]
  
    let clothes_pairs: ImageSourcePropType[][] = [];
  
    for (let i = 0; i < clothes.length; i++) {
      if (i % 2 == 0) {
        clothes_pairs.push([clothes[i]]);
      } else {
        clothes_pairs[clothes_pairs.length - 1].push(clothes[i]);
      }
    }
  
    return (
      <ScrollView>
        <Box bg={base_color} display='flex' flexDirection='column' gap={10}>
          {
            clothes_pairs.map((clothes_pair, i) => {
              return (
                <Box key={i} display='flex' flexDirection='row' gap={10}>
                  <Image source={clothes_pair[0]} w="49%" h={windowHeight / 3} alt="" />
                  <Image source={clothes_pair[1]} w="49%" h={windowHeight / 3} alt="" />
                </Box>
              )
            })
          }
        </Box>
      </ScrollView>
    )
}
