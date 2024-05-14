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
import { FOOTER_HEIGHT, HEADER_HEIGHT, WINDOW_HEIGHT } from "../consts";

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
    <View height="100%" justifyContent="space-between">
      <Header navigation={props.navigation} rightMenu={null}/>
      <Tabs
        value={tab}
        setValue={setTab}
        showDivider={false}
        containerStyle={{
          height: WINDOW_HEIGHT - FOOTER_HEIGHT - HEADER_HEIGHT - 10,
          marginTop: 10,
        }}
        contentContainerStyle={{
          marginTop: 10,
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
            content: <View><PostList fetchData={fetchRecommended} navigation={props.navigation} retryInterval={1500} /></View>,
          }
        ]}  
      />
      <Footer navigation={props.navigation}/>
      { appState.createMenuVisible && <AddMenu navigation={props.navigation}/>}
    </View>
  )
});
