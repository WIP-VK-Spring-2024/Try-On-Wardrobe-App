import React, { useState } from "react";
import { observer } from "mobx-react-lite";

import { Divider, FormControl, FormControlLabel, FormControlLabelText, Input, Pressable, RadioGroup, RadioLabel, View } from "@gluestack-ui/themed";
import { ACTIVE_COLOR, PRIMARY_COLOR } from "../consts";
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
  const [value, setValue] = useState(props.value);

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
          value={value} 
          placeholder="логин" 
          onChangeText={setValue}
          onEndEditing={()=>{
            props.setValue(value);
          }}
        />
      </Input>
    </FormControl>
  )
})

export const EmailInput = observer((props: InputProps) => {
  const [value, setValue] = useState(props.value);

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
          value={value} 
          placeholder="почта@mail.com"
          onChangeText={setValue}
          onEndEditing={()=>{
            props.setValue(value);
          }}
        />
      </Input>
    </FormControl>
  )
})

export const PasswordInput = observer((props: InputProps) => {
  const [value, setValue] = useState(props.value);

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
          value={value} 
          placeholder="пароль" 
          onChangeText={setValue}
          onEndEditing={()=>{
            props.setValue(value);
          }}
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

export const SexSelector = observer((props: InputProps) => {
  return (
    <RadioGroup 
      value={props.value} 
      onChange={props.setValue}
      flexDirection="row"
      justifyContent="center"
      gap={40}
    >
      <Radio value="male" size="md" isInvalid={false} isDisabled={false}>
        <RadioIndicator mr="$2">
          <RadioIcon as={CircleIcon} />
        </RadioIndicator>
        <RadioLabel>М</RadioLabel>
      </Radio>

      <Radio value="female" size="md" isInvalid={false} isDisabled={false}>
        <RadioIndicator mr="$2">
          <RadioIcon as={CircleIcon} />
        </RadioIndicator>
        <RadioLabel>Ж</RadioLabel>
      </Radio>
    </RadioGroup>
  )
})
