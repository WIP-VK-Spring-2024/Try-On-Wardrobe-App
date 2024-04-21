import { Pressable, View } from "@gluestack-ui/themed";
import { observer } from "mobx-react-lite";
import React, { PropsWithChildren, useState } from "react";
import { EmailInput, LoginInput, PasswordInput, SexSelector } from "../components/LoginForms";
import { ACTIVE_COLOR, PRIMARY_COLOR } from "../consts";
import { Tabs } from "../components/Tabs";
import { RobotoText } from "../components/common";
import { appState } from "../stores/AppState";
import { initCentrifuge } from "../requests/centrifuge";
import { initStores } from "../requests/init";
import { ajax } from "../requests/common";
import { cacheManager } from "../cacheManager/cacheManager";

interface LoginBtnProps {
  text: string
  onPress?: ()=>void
}
const LoginBtn = observer((props: LoginBtnProps) => {
  return (
    <Pressable
      padding={10}
      backgroundColor={ACTIVE_COLOR}
      borderRadius={10}
      onPress={props.onPress}
    >
      <RobotoText color="#ffffff" textAlign="center">{props.text}</RobotoText>
    </Pressable>
  )
})

const TabContentContainer = observer((props: PropsWithChildren) => {
  return (
    <View
      flexDirection="column"
      gap={10}
      {...props}
    />
  )
})

interface TabProps {
  navigation: any
}

const LoginTab = observer((props: TabProps) => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  const logIn = () => {
    const params = {
      name: login,
      password: password
    }

    ajax.apiPost('/login', {
      body: JSON.stringify(params)
    }).then(async resp => {
      console.log(resp);

      interface LoginSuccessResponse {
        token: string
        user_id: string
        user_name: string
      } 

      interface ErrorResponse {
        msg: string
      }

      type LoginResponse = LoginSuccessResponse | ErrorResponse;

      resp.json().then((json: LoginResponse) => {
        
        if ('msg' in json) {
          console.error(json.msg);
          return false;
        }
        
        console.log(json);
        appState.login(
          json.token,
          json.user_id
        );

        appState.setUserName(json.user_name)
        cacheManager.writeToken();

        initCentrifuge();
        initStores();

        props.navigation.navigate('Home');

        return true;
      })
    }).catch(reason => {
      console.error(reason);
    })
  }

  return (
    <TabContentContainer>
      <LoginInput
        value={login}
        setValue={setLogin}
      />
      <PasswordInput
        value={password}
        setValue={setPassword}
      />
      <LoginBtn
        text="Войти"
        onPress={logIn}
      />
    </TabContentContainer>
  )
})

const SignUpTab = observer((props: TabProps) => {
  const [login, setLogin] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [sex, setSex] = useState("female");

  const signUp = () => {
    const params = {
      name: login,
      email: email,
      password: password,
      gender: sex
    };

    ajax.apiPost('/users', {
      credentials: true,
      body: JSON.stringify(params)
    }).then(resp => {
      console.log(resp);
      resp.json().then(json => {
        console.log(json);
        resp.json().then((json: {token: string, user_id: string}) => {
          console.log(json);
          appState.login(
            json.token,
            json.user_id
          );
          props.navigation.navigate('Home');
        })
      })
    }).catch(reason => {
      console.error(reason);
    })
  }

  return (
    <TabContentContainer>
      <LoginInput
        value={login}
        setValue={setLogin}
      />
      <EmailInput
        value={email}
        setValue={setEmail}
      />
      <PasswordInput
        value={password}
        setValue={setPassword}
      />
      <SexSelector
        value={sex}
        setValue={setSex}
      />
      <LoginBtn
        text="Зарегистрироваться"
        onPress={signUp}
      />
    </TabContentContainer>
  )
})

interface LoginScreenProps {
  navigation: any
}

export const LoginScreen = observer((props: LoginScreenProps) => {
  return (
    <View
      w="100%"
      h="100%"
      backgroundColor={PRIMARY_COLOR}
      justifyContent="center"
      alignItems="center"
    >
      <View
        w="70%"
        padding={20}
        borderRadius={15}
        backgroundColor="#ffffff"
        gap={20}
      >
        <Tabs
          value="login"
          tabs={[
            {
              value: 'login',
              header: 'Вход',
              content: <LoginTab navigation={props.navigation}/>
            },
            {
              value: 'sign-up',
              header: 'Регистрация',
              content: <SignUpTab navigation={props.navigation}/>
            },
          ]}
        />
      </View>
    </View>
  );
});
