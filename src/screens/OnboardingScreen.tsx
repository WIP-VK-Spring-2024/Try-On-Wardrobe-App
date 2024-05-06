import React, { useState, useRef } from "react";
import { View, Image } from "@gluestack-ui/themed";
import { observer } from "mobx-react-lite";
import { RobotoText } from "../components/common";
import { ListRenderItemInfo, StyleSheet } from "react-native";
import AppIntroSlider from "react-native-app-intro-slider";

import GarmentIcon from "../../assets/icons/garment.svg";
import OutfitIcon from "../../assets/icons/outfit.svg";
import HangerIcon from "../../assets/icons/hanger.svg";
import FeedIcon from "../../assets/icons/paper.svg";

import { SvgProps } from "react-native-svg";
import { ACTIVE_COLOR, BASE_COLOR, PRIMARY_COLOR } from "../consts";

interface PageProps {
  key: string
  Icon: React.FC<SvgProps>
  contents?: React.JSX.Element
  title: string
  subtitle: string
}

const screens: PageProps[] = [
  {
    key: 'garments',
    Icon: GarmentIcon,
    title: 'Добавляйте фотографии одежды в ваш гардероб',
    subtitle: 'Искуственный интеллект удалит фон и определит характеристики одежды'
  },
  {
    key: 'outfits',
    Icon: OutfitIcon,
    title: 'Составляйте образы из ваших вещей',
    subtitle: 'Вы можете это сделать самостоятельно или с помощью искуственного интеллекта'
  },
  {
    key: 'try-on',
    Icon: HangerIcon,
    title: 'Примеряйте образы или отдельные вещи на ваши фото',
    subtitle: 'Искуственный интеллект поможет вам увидеть, как на вас смотрятся составленные образы'
  },
  {
    key: 'feed',
    Icon: FeedIcon,
    title: 'Делитесь образами и смотрите, что носят другие',
    subtitle: 'Рекомендательная система подстроит ленту под ваши вкусы'
  },
];

const renderPage = ({ item }: ListRenderItemInfo<PageProps>) => {
  return (
    <View
      w="100%"
      h="100%"
      justifyContent="center"
      alignItems="center"
      gap={20}
      paddingHorizontal={35}
      // bgColor={PRIMARY_COLOR}
      >
      <item.Icon width={45} height={45} fill={ACTIVE_COLOR} />
      { item.contents }
      <View gap={20}>
        <RobotoText fontSize={20} fontWeight="bold" textAlign="center">{item.title}</RobotoText>
        <RobotoText fontSize={16} textAlign="center">{item.subtitle}</RobotoText>
      </View>
    </View>
  );
};

export const OnboardingScreen = observer((props: { navigation: any }) => {
  return (
    <AppIntroSlider<PageProps>
      data={screens}
      renderItem={renderPage}
      showPrevButton={true}
      renderNextButton={() => <RobotoText padding={12}>Далее</RobotoText>}
      renderPrevButton={() => <RobotoText padding={12}>Назад</RobotoText>}
      renderDoneButton={() => (
        <View>
          <RobotoText padding={0} textAlign="center">Начать</RobotoText>
          <RobotoText padding={0} textAlign="center">пользоваться</RobotoText>
        </View>
      )}
      // onDone={() => props.navigation.reset({
      //   index: 0,
      //   routes: [{ name: 'Login' }],
      // })}
      onDone={() => props.navigation.navigate('Home')}
    />
  );
});
