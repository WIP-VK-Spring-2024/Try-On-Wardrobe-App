import React from "react"
import { InputProps, RadioBtn } from "./InputForms"
import { Privacy } from "../stores/common"
import { RobotoText } from "./common"
import { observer } from "mobx-react-lite"
import { View, RadioGroup } from "@gluestack-ui/themed"

export const PrivacySelector = observer((props: InputProps<Privacy>) => {
  return (
    <View>
      <RobotoText>Статус аккаунта</RobotoText>
      <RadioGroup 
        value={props.value} 
        onChange={props.setValue}
        flexDirection="row"
        justifyContent="center"
        gap={40}
      >
        <RadioBtn
          label="Приватный"
          value="private"
          isChecked={false}
        />
        <RadioBtn
          label="Публичный"
          value="public"
          isChecked={true}
        />
      </RadioGroup>
    </View>
  )
})
