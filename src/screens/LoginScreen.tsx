import { View } from "@gluestack-ui/themed";
import { observer } from "mobx-react-lite";
import React, { PropsWithChildren, useState } from "react";
import { EmailInput, LoginInput, PasswordInput, SexSelector } from "../components/LoginForms";
import { PRIMARY_COLOR } from "../consts";
import { Tabs } from "../components/Tabs";

const TabContentContainer = observer((props: PropsWithChildren) => {
  return (
    <View
      flexDirection="column"
      gap={10}
      {...props}
    />
  )
})

const LoginTab = observer(() => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

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
    </TabContentContainer>
  )
})

const SignUpTab = observer(() => {
  const [login, setLogin] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [sex, setSex] = useState("female");

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
              header: 'Войти',
              content: <LoginTab/>
            },
            {
              value: 'sign-up',
              header: 'Регистрация',
              content: <SignUpTab/>
            },
          ]}
        />
      </View>
    </View>
  );
});
