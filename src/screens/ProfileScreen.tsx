import React, { useState } from "react";
import { profileStore, Subscription } from "../stores/ProfileStore";
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
import { updateUserSettings } from "../requests/user"
import SearchIcon from "../../assets/icons/search.svg"

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
        <Avatar bg={PRIMARY_COLOR} borderRadius="$full" size="lg">
          <AvatarFallbackText>{profileStore.name}</AvatarFallbackText>
        </Avatar>

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
          <SettingsIcon width={iconSize} height={iconSize} fill="#000000" />
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
        updateUserSettings(gender, privacy);
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

interface SubProps {
  uuid: string
  name: string
  navigation: any
}

const Sub = observer(({uuid, name, navigation}: SubProps) => {
  return (
    <Pressable
      alignItems="center"
      w={`${100 * subRowsNum / displayedSubsNum}%`}
      onPress={() => {} /* navigation.navigate('') */}>
      <Avatar bg={PRIMARY_COLOR} borderRadius="$full" size="md">
        <AvatarFallbackText>{name}</AvatarFallbackText>
      </Avatar>
      <RobotoText numberOfLines={1}>{name}</RobotoText>
    </Pressable>
  );
});

interface SubBlockProps {
  subs: Subscription[]
  navigation: any
}

const displayedSubsNum = 5
const subRowsNum = 1

const SubsBlock = observer(({subs, navigation}: SubBlockProps) => {
  return (
    <View padding="$3" gap={10} marginTop={10}>
      <View flexDirection="row" alignItems="center">
        <RobotoText fontSize={18} marginRight={10}>Подписки</RobotoText>
        <SearchIcon fill={"#000000"} width={20} height={20}/>
      </View>
        {[...Array(subRowsNum)].map((_, i) =>
          <View flexDirection="row" justifyContent="space-evenly" key={i}>
            {subs.slice(0, displayedSubsNum/subRowsNum).map((item, j) => (
              <Sub
                uuid={item.uuid}
                name={item.name}
                navigation={navigation}
                key={j}
              />))}
          </View>
        )}
    </View>
  );
}); 

const makeStubSubs = () => [
  {
    uuid: '123',
    name: 'Anastasiaaaaaaaaaaaaaaaaa',
  },
  {
    uuid: '345',
    name: 'Leoniddddddddddddddddd',
  },
  {
    uuid: '123',
    name: 'Victor',
  },
  {
    uuid: '123',
    name: 'Timofey',
  },
]

export const ProfileScreen = observer(({navigation}: {navigation: any}) => {
  const [logoutModalShown, setLogoutModalShown] = useState(false);
  const [settingsModalShown, setSettingsModalShown] = useState(false);
  
  let stubSubs: Subscription[] = []
  for (let i = 0; i < 3; ++i) {
    stubSubs = stubSubs.concat(makeStubSubs())
  }

  return (
    <BaseScreen navigation={navigation} header={null} footer={null}>
      <UserInfo
        navigation={navigation}
        onLogout={() => setLogoutModalShown(true)}
        onSettings={() => setSettingsModalShown(true)}
      />

      <SubsBlock navigation={navigation} subs={stubSubs}/>

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
