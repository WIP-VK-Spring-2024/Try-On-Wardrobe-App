import React from "react";
import { observer } from "mobx-react-lite";
import { Pressable,  View } from "@gluestack-ui/themed";
import { ACTIVE_COLOR, DISABLED_COLOR } from "../consts";
import OutfitIcon from '../../assets/icons/outfit.svg';
import HangerIcon from '../../assets/icons/hanger.svg';

export type TryOnOutfitFooterStatus = 'outfit' | 'try-on'

interface TryOnOutfitFooterProps {
  status: TryOnOutfitFooterStatus
  setStatus: (status: TryOnOutfitFooterStatus) => void
}

export const TryOnOutfitFooter = observer(({status, setStatus} : TryOnOutfitFooterProps) => (
  <View alignItems="center" marginTop={5} marginBottom={0}>
    <View flexDirection="row" alignItems="center" gap={10}>
      <Pressable onPress={() => setStatus('outfit')}>
        <OutfitIcon width={45} height={45} fill={status === 'outfit' ? ACTIVE_COLOR : DISABLED_COLOR} />
      </Pressable>
      <Pressable onPress={() => setStatus('try-on')}>
        <HangerIcon width={35} height={35} stroke={status === 'try-on' ? ACTIVE_COLOR : DISABLED_COLOR} />
      </Pressable>
    </View>
  </View>
));
