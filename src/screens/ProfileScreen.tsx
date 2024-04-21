import React, { useState } from "react";
import { profileStore } from "../stores/ProfileStore";
import { observer } from "mobx-react-lite";
import { Avatar, AvatarFallbackText, View, Pressable, ChevronLeftIcon, Button, ButtonText, Heading } from "@gluestack-ui/themed";
import { RobotoText, AlertModal, Modal } from "../components/common";
import SettingsIcon from "../../assets/icons/settings.svg"
import LogoutIcon from "../../assets/icons/logout.svg"
import { BaseScreen } from "./BaseScreen";
import { PRIMARY_COLOR, ACTIVE_COLOR } from "../consts";
import { StackActions } from '@react-navigation/native'
import { cacheManager } from "../cacheManager/cacheManager"
import { appState } from "../stores/AppState"
import { SexSelector } from "../components/LoginForms"
import { PrivacySelector } from "../components/PrivacySelector"

const iconSize = 25

const BackButton = (props: {navigation: any, flex?: number}) => {
  const onBackPress = () => props.navigation.dispatch(StackActions.pop(1))

  return (
    <Pressable
      flexDirection="row"
      justifyContent="space-between"
      alignItems="flex-end"
      flex={props.flex}
      onPress={onBackPress}>
      <ChevronLeftIcon size="xl" color={ACTIVE_COLOR} />
    </Pressable>
  );
};

interface UserInfoProps {
  onSettings: () => void
  navigation: any
  onLogout: () => void
}

const UserInfo = observer(({navigation, onLogout, onSettings}: UserInfoProps) => {
  return (
    <View flexDirection="row" alignItems="center" $base-padding="$2">
      <BackButton navigation={navigation} flex={2} />

      <View flexDirection="row" alignItems="center" flex={10} gap={20}>
        <View>
          <Avatar bg={PRIMARY_COLOR} borderRadius="$full" size="lg">
            <AvatarFallbackText>{profileStore.name}</AvatarFallbackText>
          </Avatar>
        </View>

        <View>
          <RobotoText fontSize={18}>{profileStore.name}</RobotoText>
          <RobotoText fontSize={14}>{profileStore.email}</RobotoText>
        </View>
      </View>

      <View
        flexDirection="row"
        gap={10}
        flex={3}
        justifyContent="flex-end"
        alignItems="center"
        marginRight={5}>
        <Pressable onPress={() => onSettings()}>
          <SettingsIcon width={iconSize} height={iconSize} stroke="#000000" />
        </Pressable>
        <Pressable onPress={() => onLogout()}>
          <LogoutIcon
            width={iconSize}
            height={iconSize}
            fill="#000000"
            style={{
              transform: [{ rotate: '180deg' }],
            }}
          />
        </Pressable>
      </View>
    </View>
  );
});

const SettingsModal = observer((props: {isOpen: boolean, hide: () => void}) => {
  const [gender, setGender] = useState(profileStore.gender);
  const [privacy, setPrivacy] = useState(profileStore.privacy);

  const footer = (
    <Button
      bgColor={ACTIVE_COLOR}
      size="lg"
      action="primary"
      onPress={() => {
        props.hide();
      }}>
      <ButtonText>Сохранить</ButtonText>
    </Button>
  );

  return (
    <Modal isOpen={props.isOpen} hide={props.hide} footer={footer}>
      <View marginTop={10}>
        <Heading textAlign="center" fontSize={22} marginBottom={5}>Настройки</Heading>
        <View alignItems="flex-start" gap={10}>
          <PrivacySelector value={privacy} setValue={setPrivacy}/>
          <SexSelector value={gender} setValue={setGender}/>
        </View>
      </View>
    </Modal>
  );
});

export const ProfileScreen = observer(({navigation}: {navigation: any}) => {
  const [logoutModalShown, setLogoutModalShown] = useState(false);
  const [settingsModalShown, setSettingsModalShown] = useState(false);

  return (
    <BaseScreen navigation={navigation} header={null} footer={null}>
      <UserInfo
        navigation={navigation}
        onLogout={() => setLogoutModalShown(true)}
        onSettings={() => setSettingsModalShown(true)}
      />
      <AlertModal
        isOpen={logoutModalShown}
        hide={() => setLogoutModalShown(false)}
        text="Вы точно хотите выйти из аккаунта?"
        onAccept={() => {
          navigation.navigate('Login');
          cacheManager.deleteToken();
          appState.logout();
        }}
      />
      <SettingsModal
        isOpen={settingsModalShown}
        hide={() => setSettingsModalShown(false)}
      />
    </BaseScreen>
  );
});
