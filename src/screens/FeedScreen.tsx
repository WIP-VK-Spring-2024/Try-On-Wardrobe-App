import { View } from "@gluestack-ui/themed";
import { observer } from "mobx-react-lite";
import React from "react";
import { Header } from "../components/Header";
import { ajax } from "../requests/common";
import { Footer } from "../components/Footer";
import { convertPostResponse } from "../utils";
import { useFocusEffect } from "@react-navigation/native";
import { appState } from "../stores/AppState";
import { PostList } from "../components/Posts";
import { AddMenu } from "../components/AddMenu"

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

export const FeedScreen = observer((props: FeedScreenProps) => {
  useFocusEffect(() => {
    appState.setScreen('Feed');
  })

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
  
  return (
    <View height="100%">
      <Header navigation={props.navigation} rightMenu={null}/>

      <PostList 
        fetchData={fetchData}
        navigation={props.navigation}
      />
      
      <Footer navigation={props.navigation}/>
      { appState.createMenuVisible && <AddMenu navigation={props.navigation}/>}
    </View>
  )
});
