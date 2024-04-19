import React, { useEffect } from 'react';
import {Footer} from '../components/Footer';
import { View, CheckIcon, CloseIcon, ScrollView, Text,} from '@gluestack-ui/themed';
import {observer} from 'mobx-react-lite';

import { appState, Screen } from '../stores/AppState';
import { Icon } from '@gluestack-ui/themed';
import { Pressable } from '@gluestack-ui/themed';
import { AddMenu } from '../components/AddMenu';
import { useFocusEffect } from '@react-navigation/native';
import { Header } from '../components/Header';
import { ConnectionErrorAlert, SuccessAlert } from '../components/MessageAlert';

interface BaseScreenProps {
  header?: React.ReactNode; 
  footer?: React.ReactNode; 
  navigation: any;
  screen?: Screen;
}

export const BaseScreen = observer((props: BaseScreenProps & React.PropsWithChildren) => {
  const header = props.header || <Header/>;
  const footer = props.footer === null ? null : props.footer || <Footer navigation={props.navigation} />;

  useFocusEffect(
    React.useCallback(() => {
      if (props.screen) {
        appState.setScreen(props.screen);
      }
      appState.setCreateMenuVisible(false);
    }, [props.screen])
  );

  return (
    <>
      <View height="100%" {...props}>
        { header }
        { appState.error==='network' && <ConnectionErrorAlert/> }
        { appState.successMessage!==undefined && <SuccessAlert msg={appState.successMessage}/> }
        <ScrollView
          style={{
            flex: 1
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps='handled'
          >
            {props.children}
        </ScrollView>
        {footer}
      </View>
      { appState.createMenuVisible && <AddMenu navigation={props.navigation}/>}
    </>
  );
});
