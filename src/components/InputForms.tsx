import React from "react";
import { RadioLabel} from "@gluestack-ui/themed";
import { ACTIVE_COLOR } from "../consts";
import { Radio } from "@gluestack-ui/themed";
import { RadioIndicator } from "@gluestack-ui/themed";
import { RadioIcon } from "@gluestack-ui/themed";
import { CircleIcon } from "@gluestack-ui/themed";

export interface InputProps<T> {
  value: T,
  setValue: (value: T) => void,
}

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
