import React from 'react';
import {
  View,
  FormControl,
  Input,
  InputField,
  InputSlot,
  InputIcon,
} from '@gluestack-ui/themed';
import SearchIcon from '../../assets/icons/search.svg';
import { InputProps } from '../components/InputForms';
import { observer } from 'mobx-react-lite';

interface SearchInputProps extends InputProps<string> {
  onSearch: (query: string) => void
}

export const SearchInput = observer(({value, setValue, onSearch}: SearchInputProps) => {
  return (
    <FormControl
      size="md"
      isDisabled={false}
      isInvalid={false}
      isReadOnly={false}
      isRequired={false}
    >
      <Input alignItems='center' paddingLeft={5}>
        <InputSlot onPress={() => onSearch(value)} zIndex={1}>
          <SearchIcon width={20} height={20} fill={"#000000"} />
        </InputSlot>
        <InputField
          padding={0}
          type="text"
          value={value} 
          placeholder="Введите имя пользователя"
          onChangeText={setValue}
          onEndEditing={() => onSearch(value)}
        />
      </Input>
    </FormControl>
  )
})
