import { View } from "@gluestack-ui/themed";
import { observer } from "mobx-react-lite";
import React, { ReactNode, useEffect } from "react";
import Animated, { Easing, useAnimatedProps, useSharedValue, withDelay, withRepeat, withSequence, withTiming } from "react-native-reanimated";
import { Svg } from "react-native-svg";
import { ACTIVE_COLOR, WINDOW_HEIGHT, WINDOW_WIDTH } from "../consts";
import { G } from "react-native-svg";

import HangerIcon from '../../assets/icons/hanger.svg';
import GarmentIcon from '../../assets/icons/garment.svg';
import OutfitIcon from '../../assets/icons/outfit.svg';
import { cacheManager } from "../cacheManager/cacheManager";
import { initCentrifuge } from "../requests/centrifuge";
import { initStores } from "../requests/init";

const MOTION = WINDOW_HEIGHT / 8;

const AnimatedGroup = Animated.createAnimatedComponent(G);

interface BouncingCircleProps {
  id: number
  icon: ReactNode
}

const BouncingIcon = (props: BouncingCircleProps) => {
  const offset = useSharedValue(0);

  const circleProps = useAnimatedProps(() => ({
    transform: [{ translateY: offset.value }]
  }))

  const anim = withRepeat(
      withSequence(
          withDelay(200,
           withTiming(-MOTION, {duration: 600, easing: Easing.inOut(Easing.quad)}),
          ),
          withDelay(200, 
            withTiming(0, {duration: 600, easing: Easing.inOut(Easing.quad)}),  
          )
      ), -1
  )

  useEffect(() => {
    offset.value = withDelay(props.id * 400, anim);
  }, [])

  return (
    <AnimatedGroup
      x={WINDOW_WIDTH / 4 * (props.id + 1) - 25}
      y={WINDOW_HEIGHT / 2}
      animatedProps={circleProps}
    >
      {props.icon}
    </AnimatedGroup>
  )
}

interface LoadingScreenProps {
  navigation: any
}

export const LoadingScreen = observer((props: LoadingScreenProps) => {
  const icons = [
    <HangerIcon width={50} height={50} fill={ACTIVE_COLOR}/>,
    <OutfitIcon width={50} height={50} fill={ACTIVE_COLOR}/>,
    <GarmentIcon width={50} height={50} fill={ACTIVE_COLOR}/>,
  ]

  return (
    <View>
      <Svg>
          {
            [...Array(3).keys()].map(i => (
              <BouncingIcon
                key={i}
                id={i}
                icon={icons[i]}
              />
            ))
          }
      </Svg>
    </View>
  )
})
