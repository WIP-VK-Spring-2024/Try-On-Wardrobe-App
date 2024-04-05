import React from "react";
import { observer } from "mobx-react-lite";
import { KitEditor } from "../components/editor/Editor";

export const KitEditorScreen = observer(({navigation}: {navigation: any}) => {
  return (
    <KitEditor/>
  )
});
