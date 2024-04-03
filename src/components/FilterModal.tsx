import { Button, CheckboxGroup, Divider, Icon, ModalBody, ModalContent, ModalFooter, ModalHeader, Radio, RadioGroup, RadioIndicator } from "@gluestack-ui/themed";
import { Heading } from "@gluestack-ui/themed";
import { ModalCloseButton } from "@gluestack-ui/themed";
import { Modal, ModalBackdrop } from "@gluestack-ui/themed";
import { observer } from "mobx-react-lite";
import React, { useRef, useState } from "react";
import { RobotoText } from "./common";
import { CloseIcon } from "@gluestack-ui/themed";
import { ButtonText } from "@gluestack-ui/themed";
import { appState } from "../stores/AppState";
import { CircleIcon } from "@gluestack-ui/themed";
import { RadioLabel } from "@gluestack-ui/themed";
import { RadioIcon } from "@gluestack-ui/themed";
import { View } from "@gluestack-ui/themed";
import { garmentStore } from "../stores/GarmentStore";
import { active_color, secondary_color } from "../consts";
import { Checkbox } from "@gluestack-ui/themed";
import { CheckboxIndicator } from "@gluestack-ui/themed";
import { CheckboxIcon } from "@gluestack-ui/themed";
import { CheckboxLabel } from "@gluestack-ui/themed";
import { CheckIcon } from "@gluestack-ui/themed";

export const FilterModal = observer(() => {
  // const [showModal, setShowModal] = useState(false);
  const ref = useRef();

  interface RadioBtnProps {
    value: string,
    label: string,
  }
  const RadioBtn = (props: RadioBtnProps) => {
    const circleIcon = () => <CircleIcon color={active_color}/>;

    return (
      <Radio size="md" isInvalid={false} isDisabled={false} {...props}>
        <RadioIndicator mr="$2">
          <RadioIcon as={circleIcon} color={active_color}/>
        </RadioIndicator>
        <RadioLabel>{props.label}</RadioLabel>
      </Radio>
    )
  }

  const StyleRadioBtnBlock = () => {
    return (
      <RadioGroup
        display="flex"
        flexDirection="row"
        flexWrap="wrap"
        gap={20}
        rowGap={10}
      >
        {
          garmentStore.styles.map((style, i) => {
            return (
              <RadioBtn
                key={i}
                value={style.uuid}
                label={style.name}
              />
            )
          })
        }
      </RadioGroup>
    )
  }

  const TagCheckbox = (props: {label: string, value: string}) => {
    return (
      <Checkbox size="md" isInvalid={false} isDisabled={false} value={props.value} aria-label="tag">
        <CheckboxIndicator mr="$2">
          <CheckboxIcon as={CheckIcon} />
        </CheckboxIndicator>
        <CheckboxLabel>{props.label}</CheckboxLabel>
      </Checkbox>
    )
  }

  const TagCheckboxBlock = observer(() => {
    const tags = garmentStore.tags;
    return (
      <CheckboxGroup
        aria-label="tags"
        value={tags}
      >
        {
          tags.map((tag, i) => <TagCheckbox key={i} value={tag} label={tag}/>)
        }
      </CheckboxGroup>
    )
  })

  return (
    <Modal
      isOpen={appState.filterModalVisible}
      onClose={() => {
        appState.setFilterModalVisible(false)
      }}
      size='full'
      finalFocusRef={ref}
      padding={20}
    >
      <ModalBackdrop/>
      <ModalContent>
        <ModalBody>
          <RobotoText fontSize={28} marginBottom={10}>Стили</RobotoText>
          <StyleRadioBtnBlock/>
          <Divider h="$0.5" marginTop={10} marginBottom={10}/>
          <RobotoText fontSize={28} marginBottom={10}>Теги</RobotoText>
          <TagCheckboxBlock/>
        </ModalBody>
        <ModalFooter
          display="flex"
          justifyContent="space-around"
        >
          <Button
            size="lg"
            action="primary"
            bg={active_color}
            mr="$3"
            onPress={() => {
              appState.setFilterModalVisible(false);
            }}
          >
            <ButtonText>Применить</ButtonText>
          </Button>
          <Button
            size="lg"
            action="secondary"
            onPress={() => {
              appState.setFilterModalVisible(false);
            }}
            bg={secondary_color}
          >
            <ButtonText>Сбросить</ButtonText>
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
});
