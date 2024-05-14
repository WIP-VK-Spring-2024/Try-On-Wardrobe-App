import React from "react";
import { RobotoText } from "./common";
import { HStack, Spinner } from "@gluestack-ui/themed";
import { PRIMARY_COLOR } from "../consts";

export const LoadingSpinner = () => (
  <HStack>
    <Spinner size="large" color={PRIMARY_COLOR} />
    <RobotoText>Загрузка...</RobotoText>
  </HStack>
);
