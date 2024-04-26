import React from "react";
import { CheckboxIcon, CheckboxIndicator, CheckIcon, Checkbox as GlueStackCheckbox } from "@gluestack-ui/themed";
import { ACTIVE_COLOR, BASE_COLOR } from "../consts";
import { CheckboxLabel } from "@gluestack-ui/themed";

export const Checkbox = (props: {label: string, value: string, isChecked?: boolean, onChange?: (arg: boolean) => void}) => {
  const getBG = () => {
    if (props.isChecked === undefined)
      return undefined;

    if (props.isChecked)
      return ACTIVE_COLOR

    return "#ffffff";
  }

  const getBorderColor = () => {
    if (props.isChecked === undefined)
      return undefined;

    if (props.isChecked)
      return "f0f0f0"

    return BASE_COLOR
  }

  return (
    <GlueStackCheckbox 
      size="md" 
      isInvalid={false} 
      isDisabled={false} 
      value={props.value} 
      aria-label="tag"
      isChecked={props.isChecked}
      onChange={props.onChange}
    >
      <CheckboxIndicator
        mr="$2" 
        bg={getBG()} 
        borderColor={getBorderColor()}
      >
        <CheckboxIcon as={CheckIcon}/>
      </CheckboxIndicator>
      <CheckboxLabel>{props.label}</CheckboxLabel>
    </GlueStackCheckbox>
  )
}
