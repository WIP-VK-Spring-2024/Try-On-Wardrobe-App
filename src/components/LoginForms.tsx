import React, { useState } from "react";
import { observer } from "mobx-react-lite";

import { Divider, FormControl, FormControlLabel, FormControlLabelText, Input, Pressable, RadioGroup, RadioLabel, View } from "@gluestack-ui/themed";
import { ACTIVE_COLOR, BASE_COLOR, PRIMARY_COLOR } from "../consts";
import { RobotoText } from "../components/common";
import { InputField } from "@gluestack-ui/themed";
import { Radio } from "@gluestack-ui/themed";
import { RadioIndicator } from "@gluestack-ui/themed";
import { RadioIcon } from "@gluestack-ui/themed";
import { CircleIcon } from "@gluestack-ui/themed";

interface InputProps {
  value: string,
  setValue: (value: string) => void,
}

export const LoginInput = observer((props: InputProps) => {
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

export const EmailInput = observer((props: InputProps) => {
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

export const PasswordInput = observer((props: InputProps) => {
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

interface RadioBtnProps {
  label: string
  value: string
  isChecked: boolean
}

export const RadioBtn = (props: RadioBtnProps) => {
  const icon = () => <CircleIcon stroke={ACTIVE_COLOR}/>

  return (
    <Radio 
      value={props.value}
      size="md" 
      isInvalid={false} 
      isDisabled={false}
    >
      <RadioIndicator 
        mr="$2"
        borderColor={ACTIVE_COLOR}
      >
        <RadioIcon as={icon}/>
      </RadioIndicator>
      <RadioLabel>{props.label}</RadioLabel>
    </Radio>
  )
}

export const SexSelector = observer((props: InputProps) => {

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
