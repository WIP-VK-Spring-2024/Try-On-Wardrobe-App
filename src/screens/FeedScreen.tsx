import React, { useState } from "react";
import { View } from "@gluestack-ui/themed";
import { observer } from "mobx-react-lite";
import { Header } from "../components/Header";
import { ajax } from "../requests/common";
import { Footer } from "../components/Footer";
import { convertPostResponse } from "../utils";
import { useFocusEffect } from "@react-navigation/native";
import { appState } from "../stores/AppState";
import { PostList } from "../components/Posts";
import { AddMenu } from "../components/AddMenu"
import { Tabs } from "../components/Tabs";

interface PostResponse {
  uuid: string
  created_at: string
  updated_at: string
  outfit_id: string
  outfit_image: string
  user_name: string
}

interface FeedScreenProps {
  navigation: any
}

const fetchData = (limit: number, since: string) => {
  return ajax.apiGet(`/posts?limit=${limit}&since=${since}`,{
    credentials: true
  }).then((resp: any) => {
    return resp.json().then((json: PostResponse[]) => {
      console.log(json);
      const data = json.map(convertPostResponse);
      return data;
    })
  })
}

const fetchRecommended = (limit: number, _: string) => {
  return ajax.apiGet(`/posts/recommended?limit=${limit}&sample_amount=100`,{
    credentials: true
  }).then((resp: any) => {
    return resp.json().then((json: PostResponse[]) => {
      console.log(json);
      const data = json.map(convertPostResponse);
      return data;
    })
  })
}

export const FeedScreen = observer((props: FeedScreenProps) => {
  useFocusEffect(() => {
    appState.setScreen('Feed');
  })

  const [tab, setTab] = useState('new');

  return (
    <View height="100%" gap={10}>
      <Header navigation={props.navigation} rightMenu={null}/>
      <Tabs
        value={tab}
        setValue={setTab}
        containerStyle={{
          height: "100%",
        }}
        contentContainerStyle={{
          flex: 1,
        }}
        tabs={[
          {
            value: 'new',
            header: 'Новое',
            content: <PostList fetchData={fetchData} navigation={props.navigation} />,
          },
          {
            value: 'recs',
            header: 'Рекомендации',
            content: <View><PostList fetchData={fetchRecommended} navigation={props.navigation} /></View>,
          }
        ]}  
      />
      <Footer navigation={props.navigation}/>
      { appState.createMenuVisible && <AddMenu navigation={props.navigation}/>}
    </View>
  )
});
