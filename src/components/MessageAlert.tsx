import { observer } from 'mobx-react-lite';
import React from 'react';

import { Alert, AlertIcon, InfoIcon, AlertText, Icon } from '@gluestack-ui/themed';
import { CloseIcon } from '@gluestack-ui/themed';
import { Pressable } from '@gluestack-ui/themed';
import { appState } from '../stores/AppState';
import { CheckIcon } from '@gluestack-ui/themed';

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
});
  
export const ErrorAlert = observer(() => {
  return (
    <Alert mx="$2.5" action="error" variant="solid" w="100%">
      <AlertIcon as={InfoIcon} mr="$3" />
      <AlertText>
        {appState.error}
      </AlertText>
      <Pressable onPress={()=>appState.closeError()}>
        <Icon as={CloseIcon} marginRight={10}/>
      </Pressable>
    </Alert>
  )
});
  
export const SuccessAlert = observer((props: {msg: string}) => {
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
});
