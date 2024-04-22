import { Divider, Pressable, View, ScrollView } from "@gluestack-ui/themed";
import { observer } from "mobx-react-lite";
import React, { useState } from "react";
import { DimensionValue } from "react-native";
import { RobotoText } from "./common";
import { ACTIVE_COLOR } from "../consts";

interface TabHeaderProps {
  text: string
  isActive: boolean
  onSelect?: ()=>void
  wPercent?: number
}

export const TabContentContainer = observer((props: React.PropsWithChildren) => {
  return (
    <View
      flexDirection="column"
      gap={10}
      {...props}
    />
  )
})

const TabHeader = observer((props: TabHeaderProps) => {
  return (
    <Pressable
      onPress={props.onSelect}
      w={`${props.wPercent}%` as unknown as DimensionValue}
    >
      <RobotoText
        alignSelf='center'
        paddingLeft={5}
        paddingRight={5}
        borderBottomWidth={2}
        borderColor={props.isActive ? ACTIVE_COLOR : "#00000000"}
      >
        {props.text}
      </RobotoText>
    </Pressable>
  )
})

interface TabProps {
  value: string,
  header: string,
  content: React.ReactNode
}

interface TabsProps {
  tabs: TabProps[]
  value: string
  setValue: (value: string) => void
}

export const Tabs = observer(({tabs, value, setValue}: TabsProps) => {
  return (
    <View>
      <View
        flexDirection="row"
      >
        {
          tabs.map((tab, i) => (
            <TabHeader
              key={i}
              wPercent={100 / tabs.length}
              text={tab.header}
              isActive={tab.value === value}
              onSelect={()=>setValue(tab.value)}
            />
          ))
        }
      </View>

      <Divider h="$0.5" marginTop={10} marginBottom={10}/>

      <View>
        {
          tabs.find(tab => tab.value === value)?.content
        }
      </View>

    </View>
  )
})
