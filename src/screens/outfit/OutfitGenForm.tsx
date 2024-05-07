import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import { BaseScreen } from "../BaseScreen";
import { FormControl, FormControlHelper, FormControlLabel, Textarea } from "@gluestack-ui/themed";
import { TextareaInput } from "@gluestack-ui/themed";
import { FormControlHelperText } from "@gluestack-ui/themed";
import { View } from "@gluestack-ui/themed";
import { CheckboxGroup } from "@gluestack-ui/themed";
import { outfitGenFormTagsStore, outfitPurposeStore } from "../../stores/OutfitGenStores";
import { Checkbox } from "../../components/Checkbox";
import { RobotoText } from "../../components/common";
import { Divider } from "@gluestack-ui/themed";
import { BackHeader } from "../../components/Header";
import { ButtonFooter } from "../../components/Footer";
import { ajax } from "../../requests/common";


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
  return (
    <FormControl>
      <FormControlLabel>
          <RobotoText fontWeight="bold">Описание</RobotoText>
      </FormControlLabel>
      <Textarea>
          <TextareaInput
            placeholder="Свидание, вечер" 
            value={props.prompt}
            onChangeText={props.setPrompt}
          />
      </Textarea>
      <FormControlHelper>
          <FormControlHelperText>Опишите образ, который вы желаете сгенерировать</FormControlHelperText>
      </FormControlHelper>
    </FormControl>
  )
})

interface OutfitGenFormScreenProps {
  navigation: any
}

export const OutfitGenFormScreen = observer((props: OutfitGenFormScreenProps) => {``

  const [prompt, setPrompt] = useState('');
  const [useWeather, setUseWeather] = useState(true);

  const footer = (
    <ButtonFooter
      text="Сгенерировать"
      onPress={() => {
        console.log("Sending prompt:", prompt);

        const urlParams = new URLSearchParams({
          prompt: [prompt, ...outfitGenFormTagsStore.selectedItems].join(', '),
          amount: "4",
          use_weather: useWeather.toString(),
        });

        for (const purpose of outfitPurposeStore.selectedItems.map(p => p.name)) {
          urlParams.append("purposes", purpose)
        }

        ajax.apiGet('/outfits/gen?'+urlParams.toString(), {
          credentials: true
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
          text='Создание образа'
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
        <Checkbox
            label="Учитывать погоду в генерации"
            value="use_weather"
            isChecked={useWeather}
            onChange={weather => setUseWeather(weather)}
        />
      </View>
    </BaseScreen>
  )
})
