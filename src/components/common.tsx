import React from 'react';
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

export const RobotoText = observer((props: any) => {
  return (
    <Text style={{fontFamily: 'Roboto'}} {...props}>
      {props.children}
    </Text>
  );
});

export const CustomSelect = observer((props: {
  items: any[], 
  selectedItem: string | undefined,
  placeholder: string,
  onChange: ((value: string) => void) | undefined,
  disabled?: boolean
}) => {
  return (
    <Select {...props}
      onValueChange={props.onChange}
      selectedValue={props.selectedItem}
      isDisabled={props.disabled || false}
    >
      <SelectTrigger variant="outline" size="md">
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


export const UpdateableText = observer((props: {inEditing: boolean, text: string, onUpdate: (text: string)=>void}) => {
  return (
    <>
     {
        props.inEditing
        ? 
        <Input
          variant="rounded"
          size="md"
          w="90%"
          isDisabled={false}
          isInvalid={false}
          isReadOnly={false}
        >
          <InputField 
            type="text" 
            value={props.text}
            onChangeText={props.onUpdate}
          />
        </Input>

        :  <RobotoText fontSize={24} {...props}>
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
      {...props}
    >
      {props.icon}
      <RobotoText>{props.caption}</RobotoText>
    </Box>
  )
});
