import React, { Children, PropsWithChildren, useEffect, useState } from 'react';
import { ChevronDownIcon, SelectBackdrop, SelectIcon, SelectInput, SelectItem, SelectPortal, Text } from '@gluestack-ui/themed';
import { observer } from 'mobx-react-lite';
import { Select } from '@gluestack-ui/themed';
import { SelectTrigger } from '@gluestack-ui/themed';
import { SelectContent, View } from '@gluestack-ui/themed';
import { SelectDragIndicatorWrapper } from '@gluestack-ui/themed';
import { SelectDragIndicator, Icon, ButtonGroup, Heading } from '@gluestack-ui/themed';
import { Input, Menu, MenuItem, Pressable, InputField, ButtonText, Button, Box } from '@gluestack-ui/themed';

import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogCloseButton,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogContent,
  AlertDialogHeader,
} from '@gluestack-ui/themed';

import {
  Modal as GluestackModal,
  ModalBackdrop,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  ModalContent,
  ModalHeader,
} from '@gluestack-ui/themed';

import { StyledComponentProps } from '@gluestack-style/react/lib/typescript/types';
import { DimensionValue, StyleProp, TextProps, TextStyle, ViewProps, ViewStyle } from 'react-native';

import { ACTIVE_COLOR, PRIMARY_COLOR } from "../consts"
import DotsIcon from '../../assets/icons/dots-vertical.svg'
import TrashIcon from '../../assets/icons/trash.svg'

import { CloseIcon } from '@gluestack-ui/themed';

export const RobotoText = observer((props: any) => {
  return (
    <Text style={{fontFamily: 'Roboto-Regular'}} {...props}>
      {props.children}
    </Text>
  );
});

interface CustomSelectProps extends StyledComponentProps<StyleProp<ViewStyle>, unknown, ViewProps, "Select"> {
  items: any[], 
  selectedItem: string | undefined,
  placeholder: string,
  onChange: ((value: string) => void) | undefined,
  disabled?: boolean
}

export const CustomSelect = observer((props: CustomSelectProps) => {
  return (
    <Select {...props}
      onValueChange={props.onChange}
      selectedValue={props.selectedItem}
      isDisabled={props.disabled || false}
    >
      <SelectTrigger variant="underlined" size="md">
        <SelectInput placeholder={props.placeholder}/>
        <SelectIcon mr="$3" as={ChevronDownIcon}/>
      </SelectTrigger>
      <SelectPortal>
        <SelectBackdrop/>
        <SelectContent>
          <SelectDragIndicatorWrapper>
            <SelectDragIndicator />
          </SelectDragIndicatorWrapper>
          {
            props.items.map((item, i) => {
              return (
                <SelectItem
                  key={i}
                  label={item.name}
                  value={item.uuid}
                />
              )
            })
          }
        </SelectContent>
      </SelectPortal>
    </Select>
  )
});

interface UpdateableTextProps {
  inEditing: boolean,
  text: string,
  onUpdate: (text: string)=>void
}

export const UpdateableText = observer((props: PropsWithChildren & UpdateableTextProps & TextProps) => {
    const [text, setText] = useState(props.text);

    useEffect(() => {
      props.onUpdate(text);
    }, [props.inEditing]);

    return props.inEditing ? (
      <Input
        variant="rounded"
        size="md"
        w="100%"
        isDisabled={false}
        isInvalid={false}
        isReadOnly={false}
        {...props}>
        <InputField
          type="text"
          value={text}
          onChangeText={text => {
            setText(text);
          }}
          onEndEditing={() => props.onUpdate(text)}
        />
      </Input>
    ) : (
      <RobotoText fontSize={24} textAlign="center" {...props}>
        {props.text}
      </RobotoText>
    );
  }
);

export const IconWithCaption = observer((props: {icon: React.ReactNode, caption: string}) => {
  return (
    <Box
      display='flex'
      flexDirection='column'
      alignItems='center'
      {...props}
    >
      {props.icon}
      <RobotoText>{props.caption}</RobotoText>
    </Box>
  )
});

export const UnorderedList = (props: {
  items: string[];
  margin?: number;
  fontSize?: number;
}) => {
  return (
    <View marginLeft={props.margin}>
      {props.items.map((item, i) => (
        <RobotoText
          key={i}
          fontSize={props.fontSize}>{`\u2022 ${item}`}
        </RobotoText>
      ))}
    </View>
  );
};

interface DeleteMenuProps {
  onPress: () => void;
}

export const DeleteMenu = (props: DeleteMenuProps) => {
  return (
    <Menu
      placement="bottom right"
      trigger={({ ...triggerProps }) => {
        return (
          <Pressable {...triggerProps}>
              <DotsIcon width={40} height={40}/>
          </Pressable>
        )
      }}
    >
      <MenuItem key="Delete" textValue="Delete" gap={10} onPress={props.onPress}>
        <TrashIcon width={25} height={25}/>
        <RobotoText>Удалить</RobotoText>
      </MenuItem>
    </Menu>
  )
}

interface AlertModalProps {
  onAccept: () => void
  onReject?: () => void
  header?: string
  yesText?: string
  noText?: string
  text: string
  hide: () => void
  isOpen: boolean
}

export const AlertModal = observer(({onAccept, onReject, text, isOpen, hide, header, noText, yesText} : AlertModalProps) => {
  return (
    <AlertDialog
      isOpen={isOpen}
      onClose={() => hide()}
    >
      <AlertDialogBackdrop />
      <AlertDialogContent>
        <AlertDialogHeader>
          <Heading size="lg">{header || 'Вы уверены?'}</Heading>
          <AlertDialogCloseButton>
            <Icon as={CloseIcon} />
          </AlertDialogCloseButton>
        </AlertDialogHeader>
        <AlertDialogBody>
          <RobotoText size="md">{text}</RobotoText>
        </AlertDialogBody>
        <AlertDialogFooter        >
          <ButtonGroup space="lg">
            <Button
              size="lg"
              variant="outline"
              action="secondary"
              onPress={() => {
                hide();
                onReject && onReject();
              }}
            >
              <ButtonText>{noText || 'Нет'}</ButtonText>
            </Button>

            <Button
              size="lg"
              bg={ACTIVE_COLOR}
              onPress={() => {
                onAccept();
                hide();
              }}
            >
              <ButtonText>{yesText || 'Да'}</ButtonText>
            </Button>
          </ButtonGroup>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
});

interface DeletionModalProps {
  deleteUUID?: string
  onAccept: (uuid: string) => void
  text: string
  hide: () => void
  isOpen: boolean
}

export const DeletionModal = observer(({onAccept, text, isOpen, hide, deleteUUID} : DeletionModalProps) => {
  return (
    <AlertModal
      text={text}
      yesText="Удалить"
      noText="Не удалять"
      hide={hide}
      isOpen={isOpen}
      onAccept={() => deleteUUID && onAccept(deleteUUID)}
    />
  );
});

interface ModalProps {
  isOpen: boolean
  hide: () => void
  ref?: React.RefObject<any>
  footer?: JSX.Element
  h?: DimensionValue
  scrollEnabled?: boolean
}

export const Modal = observer(({isOpen, hide, ref, children, footer, h, scrollEnabled}: ModalProps & React.PropsWithChildren) => {
  return (
    <GluestackModal
      isOpen={isOpen}
      onClose={() => hide()}
      size='full'
      finalFocusRef={ref}
      padding={20}
    >
      <ModalBackdrop/>
      <ModalContent h={h}>
        <ModalBody scrollEnabled={scrollEnabled || false}>
          <Pressable position='absolute' top={10} right={0} zIndex={1} onPress={() => hide()}>
            <CloseIcon />
          </Pressable>
          {children}
        </ModalBody>
        <ModalFooter
          justifyContent="space-around"
        >
          {footer}
        </ModalFooter>
      </ModalContent>
    </GluestackModal>
  );
});
