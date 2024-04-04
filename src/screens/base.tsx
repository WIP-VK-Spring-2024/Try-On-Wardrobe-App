import React from 'react';
import {Footer} from '../components/Footer';
import {Box, CheckIcon, CloseIcon, KeyboardAvoidingView, ScrollView, Text, View} from '@gluestack-ui/themed';
import {observer} from 'mobx-react-lite';

import { Alert, AlertIcon, InfoIcon, AlertText } from '@gluestack-ui/themed';
import { appState } from '../stores/AppState';
import { Icon } from '@gluestack-ui/themed';
import { Pressable } from '@gluestack-ui/themed';
import { AddMenu } from '../components/AddMenu';


export const ConnectionErrorAlert = observer(() => {
  return (
    <Alert mx="$2.5" action="error" variant="solid" w="100%">
      <AlertIcon as={InfoIcon} mr="$3" />
      <AlertText>
        Не удалось достучаться до сервера.
      </AlertText>
      <Pressable onPress={()=>appState.closeError()}>
        <Icon as={CloseIcon} marginRight={10}/>
      </Pressable>
    </Alert>
  )
})

const SuccesAlert = observer((props: {msg: string}) => {
  return (
    <Alert mx="$2.5" action="success" variant="solid" w="100%">
      <AlertIcon as={CheckIcon} mr="$3" />
      <AlertText>
        {props.msg}
      </AlertText>
      <Pressable onPress={()=>appState.closeSuccessMessage()}>
        <Icon as={CloseIcon} marginRight={10}/>
      </Pressable>
    </Alert>
  )
})

export const BaseScreen = observer((props: any) => {
  const footer = props.footer || <Footer navigation={props.navigation} />;
  return (
    <>
      <View height="100%" {...props}>
      { appState.error==='network' && <ConnectionErrorAlert/> }
      { appState.successMessage!==undefined && <SuccesAlert msg={appState.successMessage}/> }
        <ScrollView showsVerticalScrollIndicator={false}>{props.children}</ScrollView>
        {footer}
      </View>
      { appState.createMenuVisible && <AddMenu navigation={props.navigation}/>}
    </>
  );
});
