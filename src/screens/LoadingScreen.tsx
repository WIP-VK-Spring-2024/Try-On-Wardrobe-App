import { View } from "@gluestack-ui/themed";
import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import Animated, { Easing, useAnimatedProps, useSharedValue, withDelay, withRepeat, withSequence, withTiming } from "react-native-reanimated";
import { Circle, Svg } from "react-native-svg";
import { WINDOW_HEIGHT, WINDOW_WIDTH } from "../consts";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export const LoadingScreen = observer(() => {
  const motion = WINDOW_HEIGHT / 4;
  const cy = useSharedValue(WINDOW_HEIGHT / 2);

  const animatedProps = useAnimatedProps(() => ({
    cy: withTiming(cy.value, {
      easing: Easing.bounce
    })
  }));

  useEffect(() => {
    cy.value = withRepeat(
      withDelay(1000, 
        withSequence(
          withDelay(500,             
            withSequence(
              withTiming(WINDOW_HEIGHT / 2 + motion, {duration: 200, easing: Easing.sin}),
    
              withTiming(WINDOW_HEIGHT / 2, {duration: 200, easing: Easing.sin}),
            ),
          ),
          withDelay(500,            
            withSequence(
              withTiming(WINDOW_HEIGHT / 2 - motion, {duration: 200, easing: Easing.sin}),

              withTiming(WINDOW_HEIGHT / 2, {duration: 200, easing: Easing.sin}),
            )
            )
        ))
    , -1)
  })

  return (
    <View>
      <Svg>
          <AnimatedCircle
          cx={WINDOW_WIDTH / 4}
          r={20}
          fill="#b58df1"
          animatedProps={animatedProps}
          />
      </Svg>
    </View>
  )
})
