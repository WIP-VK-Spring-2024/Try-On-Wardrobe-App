import React, { useState } from "react";
import { observer } from "mobx-react-lite";

import { Divider, FormControl, FormControlLabel, FormControlLabelText, Input, Pressable, RadioGroup, RadioLabel, View } from "@gluestack-ui/themed";
import { ACTIVE_COLOR, BASE_COLOR, PRIMARY_COLOR } from "../consts";
import { RobotoText } from "../components/common";
import { InputField } from "@gluestack-ui/themed";
import { Gender } from "../stores/common";
import { InputProps, RadioBtn } from "./InputForms"

export const LoginInput = observer((props: InputProps<string>) => {
  return (
    <FormControl
      size="md"
      isDisabled={false}
      isInvalid={false}
      isReadOnly={false}
      isRequired={false}
    >
      <FormControlLabel mb="$1">
        <RobotoText>Логин</RobotoText>
      </FormControlLabel>
      <Input>
        <InputField
          type="text"
          value={props.value} 
          placeholder="логин" 
          onChangeText={props.setValue}
        />
      </Input>
    </FormControl>
  )
})

export const EmailInput = observer((props: InputProps<string>) => {
  return (
    <FormControl
      size="md"
      isDisabled={false}
      isInvalid={false}
      isReadOnly={false}
      isRequired={false}
    >
      <FormControlLabel mb="$1">
        <RobotoText>Почта</RobotoText>
      </FormControlLabel>
      <Input>
        <InputField
          type="text"
          value={props.value} 
          placeholder="почта@mail.com"
          onChangeText={props.setValue}
        />
      </Input>
    </FormControl>
  )
})

export const PasswordInput = observer((props: InputProps<string>) => {
  return (
    <FormControl
      size="md"
      isDisabled={false}
      isInvalid={false}
      isReadOnly={false}
      isRequired={false}
    >
      <FormControlLabel mb="$1">
        <RobotoText>Пароль</RobotoText>
      </FormControlLabel>
      <Input>
        <InputField 
          type="password"
          value={props.value} 
          placeholder="пароль" 
          onChangeText={props.setValue}
        />
      </Input>
      {/* <FormControlHelper>
        <RobotoText>
          Must be at least 6 characters.
        </RobotoText>
      </FormControlHelper>
      <FormControlError>
        <FormControlErrorIcon as={AlertCircleIcon} />
        <RobotoText>
          At least 6 characters are required.
        </RobotoText>
      </FormControlError> */}
    </FormControl>
  )
})

export const SexSelector = observer((props: InputProps<Gender>) => {

  return (
    <View>
      <RobotoText>Пол</RobotoText>
      <RadioGroup 
        value={props.value} 
        onChange={props.setValue}
        flexDirection="row"
        justifyContent="center"
        gap={40}
      >
        <RadioBtn
          label="М"
          value="male"
          isChecked={true}
        />
        <RadioBtn
          label="Ж"
          value="female"
          isChecked={false}
        />
      </RadioGroup>
    </View>
  )
})
