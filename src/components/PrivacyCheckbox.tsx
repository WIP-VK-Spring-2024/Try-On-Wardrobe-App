import React from 'react';
import { Privacy } from '../stores/common';
import { Checkbox } from './Checkbox'
import { observer } from 'mobx-react-lite'

interface PrivacyCheckboxProps {
  value: Privacy
  text?: string
  setValue: (privacy: Privacy) => void
}

export const PrivacyCheckbox = observer(({text, value, setValue} : PrivacyCheckboxProps) => {
  return (
    <Checkbox
        label={text || "Публичный аккаунт"}
        value="privacy"
        isChecked={value === 'public'}
        onChange={isPublic => setValue(isPublic ? 'public' : 'private')}
      />
  );
});
