import React from "react";
import { observer } from "mobx-react-lite";
import { MultipleSelectionStore } from "../stores/SelectionStore";
import { CheckboxGroup } from "@gluestack-ui/themed";
import { Checkbox } from "./Checkbox";

interface TagCheckboxBlockProps {
  tagStore: MultipleSelectionStore<string>
}

export const TagCheckboxBlock = observer(({tagStore}: TagCheckboxBlockProps) => {
  const tags = tagStore.items;
  return (
    <CheckboxGroup
      display="flex"
      flexDirection="row"
      flexWrap="wrap"
      gap={20}
      rowGap={10}
      aria-label="tags"
      value={tagStore.selectedItems}
      onChange={tags => tagStore.setSelectedItems(tags)}
    >
      {
        tags.map((tag, i) => <Checkbox key={i} value={tag} label={tag} isChecked={tagStore.isSelected(tag)}/>)
      }
    </CheckboxGroup>
  )
})
