import { observer } from "mobx-react-lite";
import React, { useState } from "react";
import { BaseScreen } from "./BaseScreen";
import ImageModal from "react-native-image-modal";
import { ACTIVE_COLOR, PRIMARY_COLOR, WINDOW_HEIGHT, WINDOW_WIDTH } from "../consts";
import { Avatar, Input, InputField, View } from "@gluestack-ui/themed";
import { AvatarFallbackText } from "@gluestack-ui/themed";
import { RobotoText } from "../components/common";
import { Pressable } from "@gluestack-ui/themed";

import ForwardIcon from '../../assets/icons/forward.svg';
import SendIcon from '../../assets/icons/send.svg';
import { getImageSource } from "../utils";
import { Image } from "@gluestack-ui/themed";
import { BackHeader } from "../components/Header";

interface PostCommentAvatarColumnProps {
  authorName: string
}

const PostCommentAvatarColumn = observer((props: PostCommentAvatarColumnProps) => {
  return (
    <View
      marginTop={10}
    >
      <Avatar bg={PRIMARY_COLOR} borderRadius="$full">
        <AvatarFallbackText>{props.authorName}</AvatarFallbackText>
      </Avatar>
    </View>
  )
})

interface PostCommentContentColumnProps {
  authorName: string
  text: string
}

const PostCommentContentColumn = observer((props: PostCommentContentColumnProps) => {
  return (
    <View
      flexDirection="column"
      margin={10}
      flexShrink={1}
    >
      <View>
        <RobotoText
          fontSize={18}
          fontWeight='bold'
        >
          {props.authorName}
        </RobotoText>
      </View>

      <View
        flex={1}
      >
        <RobotoText
          width="100%"
          flex={1}
          flexWrap="wrap"
          flexShrink={1}
          fontSize={16}
        >
          {props.text}
        </RobotoText>
      </View>
    </View>
  )
})

interface PostCommentProps extends 
  PostCommentAvatarColumnProps, 
  PostCommentContentColumnProps {
  
}
  
interface PostCommentFullProps extends PostCommentProps {
    active: boolean
    onPress?: () => void
}

const PostComment = observer((props: PostCommentFullProps) => {
  return (
    <Pressable
      flexDirection="row" 
      backgroundColor={props.active ? "#ffefd5" : "white"}
      padding={10}
      w="100%"
      onPress={props.onPress}
    >
      <PostCommentAvatarColumn authorName={props.authorName}/>
      <PostCommentContentColumn authorName={props.authorName} text={props.text}/>
    </Pressable>
  )
})

interface PostCommentBlockProps {
  posts: PostCommentProps[]
};

export const PostCommentBlock = observer((props: PostCommentBlockProps) => {
  const [activeId, setActiveId] = useState<number | null>(null);

  return (
    <View
      w="100%"
      flexDirection="column"
      gap={10}
    >
      {
        props.posts.map((post, i) => (
          <PostComment
            key={i}
            authorName={post.authorName}
            text={post.text}
            active={i === activeId}
          />
        ))
      }
    </View>
  )
})

const AddCommentForm = observer(() => {
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
          onPress={()=>console.log('send')}
        >
          <SendIcon width={40} height={40} fill={ACTIVE_COLOR}/>
        </Pressable>
      </Input>
    </View>
  )
})

interface PostScreenProps {
  navigation: any
  route: any
}

export const PostScreen = observer((props: PostScreenProps) => {
  const postData = props.route.params;
  
  console.log(props.route.params)

  return (
    <BaseScreen
      header={<BackHeader navigation={props.navigation} text="Пост"/>}
      navigation={props.navigation}
      footer={<AddCommentForm/>}
    >
      <View
        w="100%"
        marginBottom={100}
        gap={20}
      >
        <View
          flexDirection='column' 
          alignContent='center'
          margin={10}
          >
          <ImageModal
            style={{
              width: WINDOW_WIDTH - 30,
              height: WINDOW_HEIGHT / 2,
              alignSelf: 'center'
            }}
            source={getImageSource(postData.image)}
            resizeMode="contain"
            />
        </View>
          
        <PostCommentBlock
          posts={[
            {
              authorName: "nikstarling",
              text: "this is some long-long post text. It's purpose is to test rendering of comment"
            },
            {
              authorName: "nikstarling",
              text: "this is some long-long post text. It's purpose is to test rendering of comment"
            },
          ]}
        />

      </View>
    </BaseScreen>
  )
})
