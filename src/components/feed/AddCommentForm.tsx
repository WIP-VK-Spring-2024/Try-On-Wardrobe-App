import React, { useState } from "react";

import { PostCommentProps } from "./PostComment";
import { observer } from "mobx-react-lite";
import { InputField, View } from "@gluestack-ui/themed";
import { Input } from "@gluestack-ui/themed";
import { Pressable } from "@gluestack-ui/themed";
import { ACTIVE_COLOR } from "../../consts";

import ForwardIcon from '../../../assets/icons/forward.svg';
import SendIcon from '../../../assets/icons/send.svg';

interface AddCommentFormProps {
  addComment: (comment: PostCommentProps) => void
}

export const AddCommentForm = observer((props: AddCommentFormProps) => {
  const [value, setValue] = useState("");
  const [height, setHeight] = useState(25);

  return (
    <View
      flexDirection="row"
    >
      <Input
        backgroundColor="white"
        flex={1}
        isDisabled={false}
        isInvalid={false}
        isReadOnly={false}
        height={height}
        >
        <InputField
          multiline={true}
          type="text"
          placeholder="Комментарий"
          value={value}
          onChangeText={setValue}
          onContentSizeChange={(e) => {
            setHeight(e.nativeEvent.contentSize.height)
          }}
        />
        <Pressable
          onPress={()=>{
            props.addComment({
              authorName: 'anon',
              text: value
            });
            setValue('');
          }}
        >
          <SendIcon width={40} height={40} fill={ACTIVE_COLOR}/>
        </Pressable>
      </Input>
    </View>
  )
})
