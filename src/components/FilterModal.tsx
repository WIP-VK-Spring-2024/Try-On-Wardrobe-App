import { Button, CheckboxGroup, Divider, ModalBody, ModalContent, ModalFooter } from "@gluestack-ui/themed";
// import { Modal, ModalBackdrop } from "@gluestack-ui/themed";
import { observer } from "mobx-react-lite";
import React, { useRef } from "react";
import { RobotoText, Modal } from "./common";
import { ButtonText } from "@gluestack-ui/themed";
import { appState } from "../stores/AppState";
import { garmentStore } from "../stores/GarmentStore";
import { ACTIVE_COLOR } from "../consts";
import { MultipleSelectionStore } from "../stores/SelectionStore";
import { Checkbox } from "./Checkbox";
import { TagCheckboxBlock } from "./TagCheckboxBlock";

interface FilterModalProps {
  styleSelectionStore: MultipleSelectionStore<string>,
  tagsSelectionStore: MultipleSelectionStore<string>,
}

const StyleCheckboxBlock = observer(({styleSelectionStore}: {styleSelectionStore: MultipleSelectionStore<string>}) => {
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

export const FilterModal = observer(({
  styleSelectionStore,
  tagsSelectionStore
  }: FilterModalProps) => {
  const modalFooter = <>
    <Button
      size="lg"
      variant="outline"
      action="secondary"
      onPress={() => {
        styleSelectionStore.clearSelectedItems();
        tagsSelectionStore.clearSelectedItems();
        appState.setFilterModalVisible(false);
      }}
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
  </>

  return (
    <Modal
      isOpen={appState.filterModalVisible}
      hide={() => appState.setFilterModalVisible(false)}
      footer={modalFooter}
      >
      <RobotoText fontSize={28} marginVertical={10}>Стили</RobotoText>
      <StyleCheckboxBlock styleSelectionStore={styleSelectionStore}/>
      <Divider h="$0.5" marginTop={10} marginBottom={10}/>
      <RobotoText fontSize={28} marginBottom={10}>Теги</RobotoText>
      <TagCheckboxBlock tagStore={tagsSelectionStore}/>
    </Modal>
  );
});
