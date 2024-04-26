import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import { Box, View } from '@gluestack-ui/themed';
import { Pressable } from '@gluestack-ui/themed';
import { UpdateableText } from '../components/common';

import EditIcon from '../../assets/icons/edit.svg';

interface UpdateableTextInputProps {
  inEditing: boolean;
  setInEditing: (val: boolean) => void
  text?: string
  onUpdate: (text: string) => void
}

export const UpdateableTextInput = observer(
  ({inEditing, setInEditing, text, onUpdate} : UpdateableTextInputProps) => {
    return (
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="center"
        alignItems="center"
        gap={20}>
        <View flex={1}></View>
        <Pressable
          flex={10}
          onPress={() => {
            setInEditing(true);
          }}>
          <UpdateableText
            numberOfLines={1}
            text={text || ''}
            inEditing={inEditing}
            onUpdate={onUpdate}
          />
        </Pressable>
        <Pressable
          flex={1}
          onPress={() => {
            setInEditing(!inEditing);
          }}>
          <EditIcon stroke="#000000" />
        </Pressable>
      </Box>
    );
  },
);
