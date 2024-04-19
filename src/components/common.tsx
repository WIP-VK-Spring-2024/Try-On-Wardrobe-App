import React, { PropsWithChildren } from 'react';
import {ChevronDownIcon, SelectBackdrop, SelectIcon, SelectInput, SelectItem, SelectPortal, Text} from '@gluestack-ui/themed';
import {observer} from 'mobx-react-lite';
import { Select } from '@gluestack-ui/themed';
import { SelectTrigger } from '@gluestack-ui/themed';
import { SelectContent, View } from '@gluestack-ui/themed';
import { SelectDragIndicatorWrapper } from '@gluestack-ui/themed';
import { SelectDragIndicator } from '@gluestack-ui/themed';
import { Input, Menu, MenuItem, Pressable, InputField, Box } from '@gluestack-ui/themed';
import {  StyledComponentProps } from '@gluestack-style/react/lib/typescript/types';
import { StyleProp, TextProps, ViewProps, ViewStyle } from 'react-native';

import DotsIcon from '../../assets/icons/dots-vertical.svg'
import TrashIcon from '../../assets/icons/trash.svg'

export const RobotoText = observer((props: any) => {
  return (
    <Text style={{fontFamily: 'Roboto'}} {...props}>
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
  return (
    <>
     {
        props.inEditing
        ? 
        <Input
          variant="rounded"
          size="md"
          w="60%"
          isDisabled={false}
          isInvalid={false}
          isReadOnly={false}
          {...props}
        >
          <InputField 
            type="text" 
            value={props.text}
            onChangeText={props.onUpdate}
          />
        </Input>

        :  <RobotoText fontSize={24} textAlign='center' {...props}>
          {props.text}
        </RobotoText>
     }
    </>
  )
});

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
