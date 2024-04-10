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
import { ACTIVE_COLOR, BASE_COLOR, PRIMARY_COLOR, SECONDARY_COLOR } from "../consts";
import { Checkbox as GlueStackCheckbox } from "@gluestack-ui/themed";
import { CheckboxIndicator } from "@gluestack-ui/themed";
import { CheckboxIcon } from "@gluestack-ui/themed";
import { CheckboxLabel } from "@gluestack-ui/themed";
import { CheckIcon } from "@gluestack-ui/themed";
import { MultipleSelectionStore } from "../stores/SelectionStore";

interface FilterModalProps {
  styleSelectionStore: MultipleSelectionStore<string>,
  tagsSelectionStore: MultipleSelectionStore<string>,
}
export const FilterModal = observer(({
  styleSelectionStore,
  tagsSelectionStore
  }: FilterModalProps) => {
  const ref = useRef();

  const Checkbox = (props: {label: string, value: string, isChecked?: boolean}) => {
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

  const StyleCheckboxBlock = observer(() => {
    const styles = styleSelectionStore.items;
    return (
      <CheckboxGroup
        display="flex"
        flexDirection="row"
        flexWrap="wrap"
        aria-label="tags"
        gap={20}
        rowGap={10}
        value={styleSelectionStore.selectedItems}
        onChange={tags => styleSelectionStore.setSelectedItems(tags)}
      >
        {
          styles.map((style, i) => 
            <Checkbox 
              key={i} 
              value={style} 
              label={garmentStore.getStyleByUUID(style)?.name || 'ошибка'}
              isChecked={styleSelectionStore.isSelected(style)}
            />
          )
        }
      </CheckboxGroup>
    )
  })

  const TagCheckboxBlock = observer(() => {
    const tags = tagsSelectionStore.items;
    return (
      <CheckboxGroup
        display="flex"
        flexDirection="row"
        flexWrap="wrap"
        gap={20}
        rowGap={10}
        aria-label="tags"
        value={tagsSelectionStore.selectedItems}
        onChange={tags => tagsSelectionStore.setSelectedItems(tags)}
      >
        {
          tags.map((tag, i) => <Checkbox key={i} value={tag} label={tag} isChecked={tagsSelectionStore.isSelected(tag)}/>)
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
          <StyleCheckboxBlock/>
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
            variant="outline"
            action="secondary"
            onPress={() => {
              styleSelectionStore.clearSelectedItems();
              tagsSelectionStore.clearSelectedItems();
              appState.setFilterModalVisible(false);
            }}
            // bg={PRIMARY_COLOR}
          >
            <ButtonText>Сбросить</ButtonText>
          </Button>

          <Button
            size="lg"
            action="primary"
            bg={ACTIVE_COLOR}
            onPress={() => {
              appState.setFilterModalVisible(false);
            }}
          >
            <ButtonText>Применить</ButtonText>
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
});
