import { Pressable, View } from "@gluestack-ui/themed";
import { observer } from "mobx-react-lite";
import React, { PropsWithChildren, useState } from "react";
import { EmailInput, LoginInput, PasswordInput, SexSelector } from "../components/LoginForms";
import { ACTIVE_COLOR, PRIMARY_COLOR } from "../consts";
import { Tabs, TabContentContainer } from "../components/Tabs";
import { RobotoText } from "../components/common";
import { appState } from "../stores/AppState";
import { initCentrifuge } from "../requests/centrifuge";
import { initStores } from "../requests/init";
import { ajax } from "../requests/common";
import { cacheManager } from "../cacheManager/cacheManager";
import { profileStore } from "../stores/ProfileStore";
import { Gender } from "../stores/common";
import { convertLoginResponse, LoginSuccessResponse } from "../utils"
import { ErrorMessage } from "../components/ErrorMessage"

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

interface TabProps {
  navigation: any
}

interface ErrorResponse {
  msg: string
}

type LoginResponse = LoginSuccessResponse | ErrorResponse;

const errorMsgTimeout = 5000;

const LoginTab = observer((props: TabProps) => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  const [errorMsg, setErrorMsg] = useState("");
  const [isErrorShown, setIsErrorShown] = useState(false);

  const [cancel, setCancel] = useState<NodeJS.Timeout>();
  const setError = (msg: string) => {
    clearTimeout(cancel);
    setErrorMsg(msg);
    setIsErrorShown(true);
    setCancel(setTimeout(() => setIsErrorShown(false), errorMsgTimeout));
  };

  const logIn = () => {
    if (login.length === 0 || password.length === 0) {
      return;
    }

    const params = {
      name: login,
      password: password
    }

    ajax.apiPost('/login', {
      body: JSON.stringify(params)
    }).then(async resp => {
      switch (resp.status) {
        case 404:
        case 403:
        case 400:
          setError('Неправильный логин или пароль');
          return;
        default:
          break;
      }

      resp.json().then(async (json: LoginResponse) => {
        if ('msg' in json) {
          console.error(json.msg);
          setError(json.msg);
          return false;
        }
        
        console.log(json);
        appState.login(
          json.token,
          json.user_id
        );

        profileStore.setUser(convertLoginResponse(json));
        cacheManager.writeToken();

        initCentrifuge();
        const initStatus = initStores();

        props.navigation.navigate('Loading');

        setLogin('');
        setPassword('');

        await initStatus;
        props.navigation.reset({
          index: 0,
          routes: [{ name: "Home" }]
        })

        return true;
      })
    }).catch(reason => {
      console.error(reason);
    })
  }

  return (
    <TabContentContainer>
      <ErrorMessage msg={errorMsg} shown={isErrorShown}/>

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
  const [sex, setSex] = useState<Gender>("female");

  const [errorMsg, setErrorMsg] = useState("");
  const [isErrorShown, setIsErrorShown] = useState(false);

  const [cancel, setCancel] = useState<NodeJS.Timeout>();
  const setError = (msg: string) => {
    clearTimeout(cancel);
    setErrorMsg(msg);
    setIsErrorShown(true);
    setCancel(setTimeout(() => setIsErrorShown(false), errorMsgTimeout));
  };

  const signUp = () => {
    if (login.length === 0 || email.length === 0 || password.length === 0) {
      return;
    }

    const params = {
      name: login,
      email: email,
      password: password,
      gender: sex
    };

    ajax
      .apiPost('/users', {
        body: JSON.stringify(params),
      })
      .then(resp => resp.json())
      .then(json => {
        console.log(json);

        if ('msg' in json) {
          if (json.msg === 'resource already exists') {
            setError('Пользователь с таким логином или почтой уже существует');
            return false;
          }
          
          if (!('errors' in json)) {
            setError(json.msg);
            return false;
          }

          const errors: string[] = [];

          if ('Email' in json.errors) {
            errors.push('Неправильный формат почты');
          }

          if ('Name' in json.errors) {
            errors.push('Логин может содержать только буквы русского и латинского алфавитов, цифры и следующие спецсимволы: "-_()+=~@^:?;$#№%*@|{}[\]!<>"');
          }

          setError(errors.join('\n\n'));
          return false;
        }

        appState.login(json.token, json.user_id);
        profileStore.setUser(convertLoginResponse(json));
        cacheManager.writeToken();

        props.navigation.reset({
          index: 0,
          routes: [{ name: "Home" }]
        })
      })
      .catch(reason => {
        console.error(reason);
      });
  }

  return (
    <TabContentContainer>
      <ErrorMessage msg={errorMsg} shown={isErrorShown}/>

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
  const [tab, setTab] = useState('login');

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
          value={tab}
          setValue={setTab}
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
