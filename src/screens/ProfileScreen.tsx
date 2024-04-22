import React, { useEffect, useState } from "react";
import { profileStore, Subscription, User } from "../stores/ProfileStore";
import { observer } from "mobx-react-lite";
import {
  Avatar,
  AvatarFallbackText,
  View,
  Pressable,
  ChevronLeftIcon,
  Button,
  ButtonText,
  ScrollView,
} from '@gluestack-ui/themed';
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
import { updateUserSettings, searchUsers } from "../requests/user"
import SearchIcon from "../../assets/icons/search.svg"
import { Tabs } from "../components/Tabs"
import { SearchInput } from "../components/SearchInput"
import { InfiniteScrollList } from "../components/InfiniteScrollList"
import { ListRenderItemInfo } from "react-native"

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
  onSettings?: () => void
  navigation: any
  onLogout?: () => void
  user: User
}

const UserInfo = observer(({navigation, onLogout, onSettings, user}: UserInfoProps) => {
  return (
    <View flexDirection="row" alignItems="center" $base-padding="$2">
      <BackButton navigation={navigation} flex={3} />

      <View flexDirection="row" alignItems="center" flex={10} gap={20}>
        <Avatar bg={PRIMARY_COLOR} borderRadius="$full" size="lg">
          <AvatarFallbackText>{user.name}</AvatarFallbackText>
        </Avatar>

        <View>
          <RobotoText fontSize={18}>{user.name}</RobotoText>
          <RobotoText fontSize={14}>{user.email}</RobotoText>
        </View>
      </View>

      <View
        flexDirection="row"
        gap={10}
        flex={3}
        justifyContent="flex-end"
        alignItems="center"
        marginRight={5}>

        {onSettings &&
          <Pressable onPress={() => onSettings()}>
            <SettingsIcon width={iconSize} height={iconSize} fill="#000000" />
          </Pressable>}

        {onLogout &&
          <Pressable onPress={() => onLogout()}>
            <LogoutIcon
              width={iconSize}
              height={iconSize}
              fill="#000000"
              style={{
                transform: [{ rotate: '180deg' }],
              }}
            />
          </Pressable>}
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
        <RobotoText textAlign="center" fontSize={22}>Настройки</RobotoText>
        <View alignItems="flex-start" gap={15}>
          <PrivacySelector value={privacy} setValue={setPrivacy}/>
          <SexSelector value={gender} setValue={setGender}/>
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
    if (tab === 'all') {
      profileStore.setLastUserName('');
    }
  }, [query]);

  useEffect(() => {
    profileStore.setLastUserName('');
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

  const subsTabContents = (
    <ScrollView>
      <SubsList
        subs={subs.filter(searchPredicate)}
        navigation={navigation}
        rowSize={subsRowSize}
      />
    </ScrollView>
  );

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
          onSearch={() => tab === 'all' ? searchUsers(query, '') : undefined}
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

interface SubProps {
  uuid: string
  name: string
  navigation: any
}

const Sub = observer(({uuid, name, navigation}: SubProps) => {
  return (
    <Pressable
      alignItems="center"
      w={`${100 / subsRowSize}%`}
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
  onSearch: () => void
}

const displayedSubsNum = 4;
const subsRowSize = 4;

const SubsBlock = observer(({subs, navigation, onSearch}: SubBlockProps) => {
  return (
    <View flexDirection="row">
      <View flex={1} />
      <View gap={10} marginTop={20} flex={8}>
        <View flexDirection="row" alignItems="center" gap={10}>
          <RobotoText fontSize={18}>Подписки</RobotoText>
          <Pressable onPress={() => onSearch()}>
            <SearchIcon fill={'#000000'} width={20} height={20} />
          </Pressable>
        </View>

        <SubsList
          subs={subs}
          navigation={navigation}
          rowSize={subsRowSize}
          displayedNum={displayedSubsNum}
        />
      </View>
      <View flex={1} />
    </View>
  );
}); 

interface SubsListProps {
  subs: Subscription[]
  navigation: any
  displayedNum?: number
  rowSize: number
}

const SubsList = observer(({subs, navigation, rowSize, displayedNum}: SubsListProps) => {
  const rowNum = Math.ceil((displayedNum || subs.length) / rowSize);

  return (
    <>
      {[...Array(rowNum)].map((_, i) =>
        <View flexDirection="row" key={i}>
          {subs.slice(rowSize * i, rowSize * (i + 1)).map((item, j) => (
            <Sub
              uuid={item.uuid}
              name={item.name}
              navigation={navigation}
              key={j}
            />))}
        </View>
      )}
    </>
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
];

export const ProfileScreen = observer(({navigation, route}: {navigation: any, route: any}) => {
  const user: User = route.params.user
  const isCurrentUser = user.uuid === profileStore.currentUser?.uuid
  
  return isCurrentUser
    ? <CurrentUserProfileScreen navigation={navigation} />
    : <OtherUserProfileScreen navigation={navigation} user={user} />;
});

export const CurrentUserProfileScreen = observer(({navigation}: {navigation: any}) => {
  const [logoutModalShown, setLogoutModalShown] = useState(false);
  const [settingsModalShown, setSettingsModalShown] = useState(false);
  const [searchModalShown, setSearchModalShown] = useState(false);
  
  let stubSubs: Subscription[] = []
  for (let i = 0; i < 3; ++i) {
    stubSubs = stubSubs.concat(makeStubSubs())
    stubSubs = stubSubs.concat(makeStubSubs().reverse())
  }

  const subs = profileStore.currentUser?.subs.length === 0
              ? stubSubs
              : profileStore.currentUser!.subs;

  return (
    <BaseScreen navigation={navigation} header={null} footer={null}>
      <UserInfo
        user={profileStore.currentUser!}
        navigation={navigation}
        onLogout={() => setLogoutModalShown(true)}
        onSettings={() => setSettingsModalShown(true)}
      />

      <SubsBlock
        navigation={navigation}
        subs={subs}
        onSearch={() => setSearchModalShown(true)}
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
      
      <SearchUsersModal
        isOpen={searchModalShown}
        hide={() => setSearchModalShown(false)}
        subs={subs}
        navigation={navigation}
      />
    </BaseScreen>
  );
});

export const OtherUserProfileScreen = observer(({navigation, user}: {navigation: any, user: User}) => {
  let stubSubs: Subscription[] = []
  for (let i = 0; i < 3; ++i) {
    stubSubs = stubSubs.concat(makeStubSubs())
  }

  return (
    <BaseScreen navigation={navigation} header={null} footer={null}>
      <UserInfo
        user={user}
        navigation={navigation}
      />

      {/* <SubsBlock navigation={navigation} subs={stubSubs} /> */}
    </BaseScreen>
  );
});
