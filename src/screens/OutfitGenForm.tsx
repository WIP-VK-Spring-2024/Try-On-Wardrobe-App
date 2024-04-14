import { observer } from "mobx-react-lite";
import React, { useState } from "react";
import { BaseScreen } from "./BaseScreen";
import { FormControl, FormControlHelper, FormControlLabel, Textarea } from "@gluestack-ui/themed";
import { TextareaInput } from "@gluestack-ui/themed";
import { FormControlHelperText } from "@gluestack-ui/themed";
import { View } from "@gluestack-ui/themed";
import { CheckboxGroup } from "@gluestack-ui/themed";
import { outfitGenFormTagsStore, outfitPurposeStore } from "../stores/OutfitGenStores";
import { Checkbox } from "../components/Checkbox";
import { RobotoText } from "../components/common";
import { Divider } from "@gluestack-ui/themed";
import { TagCheckboxBlock } from "../components/TagCheckboxBlock";
import { BackHeader } from "../components/Header";
import { ButtonFooter } from "../components/Footer";
import { apiEndpoint } from "../../config";

const PurposeCheckboxGroup = observer(() => {
  const purposeByUUID = (uuid: string) => {
    return outfitPurposeStore.items.find(item => item.uuid === uuid)!;
  }

  return (
    <CheckboxGroup
      display="flex"
      flexDirection="row"
      flexWrap="wrap"
      aria-label="tags"
      gap={20}
      rowGap={10}
      value={outfitPurposeStore.selectedItems.map(purpose => purpose.uuid)}
      onChange={uuids => {
        const purposes = uuids.map(purposeByUUID);
        outfitPurposeStore.setSelectedItems(purposes);
      }}
    >
      {
        outfitPurposeStore.items.map((purpose, i) => 
          <Checkbox
            key={i} 
            value={purpose.uuid} 
            label={purpose.name}
            isChecked={outfitPurposeStore.isSelected(purposeByUUID(purpose.uuid))}
          />
        )
      }
    </CheckboxGroup>
  )
})

interface PromptFormProps {
  prompt: string
  setPrompt: (value: string) => void
}

const PromptForm = observer((props: PromptFormProps) => {
  const [prompt, setPrompt] = useState(props.prompt);

  return (
    <FormControl>
      <FormControlLabel>
          <RobotoText fontWeight="bold">Промпт</RobotoText>
      </FormControlLabel>
      <Textarea>
          <TextareaInput
            placeholder="Свидание, вечер" 
            value={prompt}
            onChangeText={setPrompt}
            onEndEditing={()=>props.setPrompt(prompt)}
            onFocus={()=>console.log('focus')}
          />
      </Textarea>
      <FormControlHelper>
          <FormControlHelperText>Опишите образ, который вы желаете</FormControlHelperText>
      </FormControlHelper>
    </FormControl>
  )
})

interface OutfitGenFormScreenProps {
  navigation: any
}

export const OutfitGenFormScreen = observer((props: OutfitGenFormScreenProps) => {

  const [prompt, setPrompt] = useState('');

  const footer = (
    <ButtonFooter
      text="Сгенерировать"
      onPress={() => {
        fetch(apiEndpoint + 'outfits/gen', {
          method: 'POST',
          body: JSON.stringify({
            prompt: prompt,
            purposes: outfitPurposeStore.selectedItems.map(p => p.name),
            amount: 4
          })
        })
        props.navigation.navigate('OutfitGenResult');
      }}
    />
  )

  return (
    <BaseScreen
      navigation={props.navigation}
      header={
        <BackHeader 
          navigation={props.navigation}
          text='Создание комплекта'
        />
      }
      footer={footer}
    >
      <View
        padding={20}
        gap={10}
      >
        <RobotoText fontWeight="bold">Цель</RobotoText>
        <PurposeCheckboxGroup/>
        <Divider h="$0.5" marginTop={10} marginBottom={10}/>
        <PromptForm
          prompt={prompt}
          setPrompt={setPrompt}
        />
        <Divider h="$0.5" marginTop={10} marginBottom={10}/>
        <TagCheckboxBlock tagStore={outfitGenFormTagsStore}/>
      </View>
    </BaseScreen>
  )
})
