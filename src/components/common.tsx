import React, { PropsWithChildren } from 'react';
import {ChevronDownIcon, SelectBackdrop, SelectIcon, SelectInput, SelectItem, SelectPortal, Text} from '@gluestack-ui/themed';
import {observer} from 'mobx-react-lite';
import { Select } from '@gluestack-ui/themed';
import { SelectTrigger } from '@gluestack-ui/themed';
import { SelectContent } from '@gluestack-ui/themed';
import { SelectDragIndicatorWrapper } from '@gluestack-ui/themed';
import { SelectDragIndicator } from '@gluestack-ui/themed';
import { Input } from '@gluestack-ui/themed';
import { InputField } from '@gluestack-ui/themed';
import { Box } from '@gluestack-ui/themed';
import { StyledComponentProps } from '@gluestack-style/react/lib/typescript/types';
import { StyleProp, ViewProps, ViewStyle } from 'react-native';

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

export const UpdateableText = observer((props: PropsWithChildren & UpdateableTextProps) => {
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
