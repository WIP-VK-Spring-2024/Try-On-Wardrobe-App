import { observer } from 'mobx-react-lite';
import React, { useState } from 'react';
import { Box, Input, InputField } from '@gluestack-ui/themed';
import { ACTIVE_COLOR, SECONDARY_COLOR } from '../consts';
import { Pressable } from '@gluestack-ui/themed';
import { RobotoText} from './common';
import { Heading } from '@gluestack-ui/themed';
import { Button } from '@gluestack-ui/themed';

import HashTagIcon from '../../assets/icons/hashtag.svg';
import CrossIcon from '../../assets/icons/cross.svg';

export const Tag = observer((props: {name: string, removeTag: (name: string) => void}) => {
  return (
    <Box
      flexDirection='row'
      gap={5}
      alignItems='center'
    >
      <HashTagIcon />
      <RobotoText>{props.name}</RobotoText>

      <Pressable marginTop={4}
        onPress={() => {
          props.removeTag(props.name);
        }}
      >
        <CrossIcon width={10} height={10} stroke={ACTIVE_COLOR}/>
      </Pressable>
    </Box>
  )
});

interface TagBlockProps {
  tagInputValue: string
  setTagInputValue: (t: string) => void
  tags: string[]
  removeTag: (t: string) => void
  addTag: (t: string) => void
}

export const TagBlock = observer((props: TagBlockProps) => {
  const [tagInputValue, setTagInputValue] = useState(props.tagInputValue);
  
  return (
    <Box>
      <Heading>
        Теги
      </Heading>
      <Box
        display='flex'
        flexDirection='row'
        flexWrap='wrap'
        gap={20}
        rowGap={10}
        marginBottom={10}
      >
        {
          props.tags.map((tag, i) => {
            return (
              <Tag key={i} name={tag} removeTag={props.removeTag}/>
            )
          })
        }
      </Box>
      <Box display='flex' flexDirection='row' justifyContent='space-between'>
        <Input
          w="67%"
          variant="outline"
          size="md"
          isDisabled={false}
          isInvalid={false}
          isReadOnly={false}
          justifyContent='space-between'
        >
          <InputField
            type="text"
            value={tagInputValue}
            onChangeText={(text: string) => setTagInputValue(text)}
            onEndEditing={()=>props.setTagInputValue(tagInputValue)}
          />
        </Input>
        <Button
            bg={SECONDARY_COLOR}
            onPress={() => {
              const value = tagInputValue.trim()
              if (tagInputValue == '' || props.tags.includes(value)) {
                return;
              }
              setTagInputValue('');
              props.addTag(value);
            }}
          >
            <RobotoText color='#ffffff'>
              Добавить
            </RobotoText>
        </Button>
      </Box>
    </Box>
  )
});
