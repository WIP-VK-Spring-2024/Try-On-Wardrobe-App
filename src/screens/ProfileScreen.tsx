import React, { useEffect, useState } from "react";
import { profileStore, Subscription, User } from "../stores/ProfileStore";
import { observer } from "mobx-react-lite";
import {
  View,
  Pressable,
  Button,
  ButtonText,
  ScrollView,
} from '@gluestack-ui/themed';
import { RobotoText, AlertModal, Modal } from "../components/common";
import SettingsIcon from "../../assets/icons/settings.svg"
import LogoutIcon from "../../assets/icons/logout.svg"
import { PRIMARY_COLOR, ACTIVE_COLOR} from "../consts";
import { useFocusEffect } from '@react-navigation/native'
import { cacheManager } from "../cacheManager/cacheManager"
import { appState } from "../stores/AppState"
import { SexSelector } from "../components/LoginForms"
import { updateUserSettings, searchUsers, updateUserImage } from "../requests/user"
import { ajax } from "../requests/common"
import { Tabs } from "../components/Tabs"
import { SearchInput } from "../components/SearchInput"
import { BackButton, SubsList, NoSubsMessage, SubsBlock } from "../components/Profile"
import { PostList } from "../components/Posts";
import { convertPostResponse, getOptionalImageSource } from "../utils"
import { PrivacyCheckbox } from "../components/PrivacyCheckbox";
import { garmentStore } from "../stores/GarmentStore";
import { outfitStore } from "../stores/OutfitStore";
import { tryOnStore } from "../stores/TryOnStore";
import { userPhotoStore } from "../stores/UserPhotoStore";
import { Avatar } from "../components/Avatar";
import ImagePicker from 'react-native-image-crop-picker';

const iconSize = 25

const uploadAvatar = async () => {
  return ImagePicker.openPicker({
    cropping: true,
  })
    .then(updateUserImage)
    .catch(reason => console.log(reason))
}

interface UserHeaderProps {
  onSettings: () => void
  navigation: any
  onLogout: () => void
  user: User
}

const UserHeader = observer(({navigation, onLogout, onSettings, user}: UserHeaderProps) => {
  return (
    <View flexDirection="row" alignItems="center" $base-padding="$2">
      <BackButton navigation={navigation} flex={2} />

      <View flexDirection="row" alignItems="center" flex={9} gap={20}>
        <Pressable onPress={() => uploadAvatar()}>
          <Avatar size="lg" name={user.name} source={getOptionalImageSource(user.avatar)}/>
        </Pressable>

        <View>
          <RobotoText fontSize={18} numberOfLines={1}>{user.name}</RobotoText>
          <RobotoText fontSize={14} numberOfLines={1}>{user.email}</RobotoText>
        </View>
      </View>

      <View
        flexDirection="row"
        gap={10}
        flex={4}
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
  const [gender, setGender] = useState(profileStore.currentUser?.gender || 'female');
  const [privacy, setPrivacy] = useState(profileStore.currentUser?.privacy || 'public');

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
      <View marginTop={10} gap={10}>
        <RobotoText textAlign="center" fontSize={22}>
          Настройки
        </RobotoText>
        <View alignItems="flex-start" gap={15}>
          <PrivacyCheckbox value={privacy} setValue={setPrivacy} />
          <SexSelector value={gender} setValue={setGender} />
        </View>
      </View>
    </Modal>
  );
});

interface SearchUsersModalProps {
  subs: Subscription[]
  navigation: any
  isOpen: boolean
  hide: () => void
}

const SearchUsersModal = observer(({subs, isOpen, hide, navigation}: SearchUsersModalProps) => {
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState('subs');

  useEffect(() => {
    profileStore.clearUsers();
    searchUsers('', '');
    setTab('subs');
    setQuery('');
  }, [isOpen]);

  useEffect(() => {
    setQuery('');
  }, [tab]);

  const searchPredicate = React.useCallback(
    (sub: Subscription) =>
      query === '' || sub.name.toLowerCase().includes(query.toLowerCase()),
    [query],
  );

  const subsTabContents = subs.length > 0 ?(
    <ScrollView>
      <SubsList
        subs={subs.filter(searchPredicate)}
        navigation={navigation}
        rowSize={subsRowSize}
      />
    </ScrollView>
  ) : NoSubsMessage;

  const allUsersTabContents = (
    <ScrollView>
      <SubsList
        subs={profileStore.users}
        navigation={navigation}
        rowSize={subsRowSize}
      />
    </ScrollView>
  );

  return (
    <Modal isOpen={isOpen} hide={hide} h="60%">
      <View marginTop={10} gap={10}>
        <RobotoText textAlign="center" fontSize={22}>
          Поиск
        </RobotoText>
        <SearchInput
          value={query}
          setValue={setQuery}
          onSearch={() => {
            if (tab === 'all') {
              profileStore.clearUsers();
              searchUsers(query, '');
            }
          }}
        />
        <Tabs
          value={tab}
          setValue={setTab}
          tabs={[
            {
              value: 'subs',
              header: 'Подписки',
              content: subsTabContents,
            },
            {
              value: 'all',
              header: 'Все пользователи',
              content: allUsersTabContents,
            },
          ]}
        />
      </View>
    </Modal>
  );
});

const displayedSubsNum = 4;
const subsRowSize = 4;

const fetchPosts = (url: string) => {
  return (limit: number, since: string) => {
    const urlParams = new URLSearchParams({
      limit: limit.toString(),
      since: since,
    });
    return ajax
      .apiGet(url + "?" + urlParams.toString(), {
        credentials: true,
      })
      .then(resp => {
        return resp.json();
      })
      .then(json => {
        return json.map(convertPostResponse);
    });
}};

const fetchLikedPosts = fetchPosts("/posts/liked");

export const CurrentUserProfileScreen = observer(({navigation}: {navigation: any}) => {
  const [logoutModalShown, setLogoutModalShown] = useState(false);
  const [settingsModalShown, setSettingsModalShown] = useState(false);
  const [searchModalShown, setSearchModalShown] = useState(false);

  const fetchOwnPosts = fetchPosts(`/users/${profileStore.currentUser?.uuid}/posts`);

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        setLogoutModalShown(false);
        setSettingsModalShown(false);
        setSearchModalShown(false);
      };
    }, []),
  );

  const subs = profileStore.currentUser?.subs || [];

  const [tab, setTab] = useState('own');

  return (
    <View h="100%" gap={25}>
      <UserHeader
        user={profileStore.currentUser!}
        navigation={navigation}
        onLogout={() => setLogoutModalShown(true)}
        onSettings={() => setSettingsModalShown(true)}
      />

      <SubsBlock
        navigation={navigation}
        subs={subs}
        onSearch={() => setSearchModalShown(true)}
        rowSize={subsRowSize}
        displayedNum={displayedSubsNum}
      />

      <Tabs value={tab} setValue={setTab} tabs={[{
        value: 'own',
        header: 'Ваши посты',
        content: <PostList fetchData={fetchOwnPosts} navigation={navigation} />
      },{
        value: 'liked',
        header: 'Вам понравилось',
        content: <View><PostList fetchData={fetchLikedPosts} navigation={navigation} /></View>
      }]}/>

      <AlertModal
        isOpen={logoutModalShown}
        hide={() => setLogoutModalShown(false)}
        text="Вы точно хотите выйти из аккаунта?"
        onAccept={() => {
          navigation.navigate('Login');

          cacheManager.deleteToken();
          appState.logout();

          garmentStore.clearGarments();
          outfitStore.clear();
          tryOnStore.clear();
          userPhotoStore.clear();

          cacheManager.writeGarmentCards();
          cacheManager.writeOutfits();
          // profileStore.clear();
        }}
      />

      <SettingsModal
        isOpen={settingsModalShown}
        hide={() => setSettingsModalShown(false)}
      />
      
      <SearchUsersModal
        isOpen={searchModalShown}
        hide={() => setSearchModalShown(false)}
        subs={subs}
        navigation={navigation}
      />
    </View>
  );
});
