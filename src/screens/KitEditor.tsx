import React, { useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import type { SkPicture } from "@shopify/react-native-skia";
import {
  Group,
  Fill,
  Canvas,
  Picture,
  Skia,
  PaintStyle,
  Circle,
  Rect,
  vec,
  Line,
  Points,
} from "@shopify/react-native-skia";
import type { NativeGesture, TouchData } from "react-native-gesture-handler";
import { Gesture, GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, { useSharedValue, useAnimatedStyle } from "react-native-reanimated";

import { Title } from "./components/Title";
import { runOnJS, runOnUI, useDerivedValue } from "@shopify/react-native-skia/src/external/reanimated/moduleWrapper";
import { SharedValue } from "react-native-gesture-handler/lib/typescript/handlers/gestures/reanimatedWrapper";

// const rectW = 100;
// const rectH = 100;

// const rectHalfW = rectW / 2;
// const rectHalfH = rectH / 2;

const rotateHandleLength = 20;
// const boundsLength = Math.max(rectHalfW, rectHalfH) + 10;

const boundsExtra = 10;

const rotateHandleSize = 25;
const rotateHandleHalfSize = rotateHandleSize / 2;

const scaleHandleSize = rotateHandleSize;
const scaleHandleHalfSize = scaleHandleSize / 2;

interface RectangleProps {
  x: number,
  y: number,
  angle: number,
  width: number,
  height: number,
  scale: number
}

interface Rectangle extends RectangleProps{
  halfWidth: number,
  halfHeight: number
}

class RectangleClass {
  x: number = 0;
  y: number = 0;
  angle: number = 0;
  width: number = 0;
  height: number = 0;

  halfWidth: number = 0;
  halfHeight: number = 0;

  scale: number = 1;

  constructor(props: RectangleProps) {
    this.x = props.x;
    this.y = props.y;
    this.angle = props.angle;
    this.width = props.width;
    this.height = props.height;

    this.halfWidth = props.width / 2;
    this.halfHeight = props.height / 2;

    this.scale = props.scale;
  }

  getParams() {
    return {
      x: this.x,
      y: this.y,
      angle: this.angle,
      width: this.width,
      height: this.height,
      halfWidth: this.halfWidth,
      halfHeight: this.halfHeight,
      scale: this.scale,
    }
  }
}

const rectangles = [
  new RectangleClass({
    x: 0,
    y: 0,
    angle: 0,
    width: 60,
    height: 40,
    scale: 3,
  }),
  new RectangleClass({
    x: 200,
    y: 40,
    angle: Math.PI / 4,
    width: 100,
    height: 100,
    scale: 1
  }),
  new RectangleClass({
    x: 50,
    y: 200,
    angle: Math.PI / 3,
    width: 100,
    height: 120,
    scale: 1
  }),
]

interface RotateHandleCoordsType {
  x: number,
  y: number,
  rx: number,
  ry: number
}

interface RotateHandleProps {
  rotateHandleCoords: SharedValue<RotateHandleCoordsType>,
  activeId: SharedValue<number | undefined>
}
const RotateHandle = (props: RotateHandleProps) => {
  const rotateHandleX = useDerivedValue(() => {
    return props.rotateHandleCoords.value.x;
  })

  const rotateHandleY = useDerivedValue(() => {
    return props.rotateHandleCoords.value.y
  })

  const rotateLineP1 = useDerivedValue(() => {
    return vec(
      props.rotateHandleCoords.value.x + rotateHandleHalfSize, 
      props.rotateHandleCoords.value.y + rotateHandleHalfSize
    )
  })

  const rotateLineP2 = useDerivedValue(() => {
    return vec(
      props.rotateHandleCoords.value.rx, 
      props.rotateHandleCoords.value.ry
    )
  })

  return (
    <>
      <Rect 
        x={rotateHandleX}
        y={rotateHandleY}
        width={rotateHandleSize}
        height={rotateHandleSize}
        color="lightblue"
      />
      <Line
        p1={rotateLineP1}
        p2={rotateLineP2}
        color="lightblue"
        strokeWidth={4}
      />
    </>
  )
}

interface ScaleHandleProps {
  coords: SharedValue<{x: number, y: number, rx: number, ry: number}>
}
const ScaleHandle = (props: ScaleHandleProps) => {
  const x = useDerivedValue(() => props.coords.value.x + props.coords.value.rx - scaleHandleHalfSize);
  const y = useDerivedValue(() => props.coords.value.y + props.coords.value.ry - scaleHandleHalfSize);

  return (
    <Rect
      x={x}
      y={y}
      width={scaleHandleSize}
      height={scaleHandleSize}
      color="lightblue"
  />
  )
}

const GestureDetectorView = (props: {gesture: NativeGesture, positions: SharedValue<Rectangle[]>, id: number}) => {
  const style = useAnimatedStyle(() => {
    return {
      position: "absolute",

      // backgroundColor: "red",

      top: props.positions.value[props.id].y,
      left: props.positions.value[props.id].x,

      width: props.positions.value[props.id].width,
      height: props.positions.value[props.id].height,

      transform: [
        {"rotate": `${props.positions.value[props.id].angle}rad`},
        {"scale": props.positions.value[props.id].scale},
      ]
    }
  }
  );

  return (
    <GestureDetector gesture={props.gesture}>
      <Animated.View style={style}/>
    </GestureDetector>
  )
}

const MyRect = (props: {id: number, positions: SharedValue<Rectangle[]>}) => {
  const x = useDerivedValue(() => props.positions.value[props.id].x);
  const y = useDerivedValue(() => props.positions.value[props.id].y);

  const width = useDerivedValue(() => props.positions.value[props.id].width);
  const height = useDerivedValue(() => props.positions.value[props.id].height);

  const origin = useDerivedValue(() => {
    return vec(
      x.value + props.positions.value[props.id].halfWidth, 
      y.value + props.positions.value[props.id].halfHeight,
    )
  })

  const tranforms = useDerivedValue(() => {
    return [
      {rotate: props.positions.value[props.id].angle},
      {scale: props.positions.value[props.id].scale},
    ]
  })

  return (
    <Rect
      x={x}
      y={y}
      width={width}
      height={height}
      transform={tranforms}
      origin={origin}
    />
  )
}

export const KitEditor = () => {
  const [basePosition, setBasePosition] = useState({x: 0, y: 0});

  // const positions = useSharedValue<Rectangle[]>([{x: 100, y: 20, angle: 0}, {x: 200, y: 400, angle: Math.PI / 4}]);

  const positions = useSharedValue<Rectangle[]>(rectangles.map(rect => rect.getParams()))

  const movingId = useSharedValue<number | undefined>(undefined);
  const activeId = useSharedValue<number | undefined>(undefined);

  const scaleFixedCorner = useSharedValue({x: 0, y: 0});

  const cursorPosition = useSharedValue({x: 0, y: 0});

  const aref = useRef<View | null>(null);

  const getPanGesture = (id: number) => {
    return Gesture.Native()
    .onTouchesDown((event) => {
      const touch = event.allTouches[0];

      movingId.value = id;
      activeId.value = id;

      const c = {
        x: positions.value[id].halfWidth,
        y: positions.value[id].halfHeight
      }

      const cursor = {
        x: touch.x,
        y: touch.y
      }

      const centerCursor = {
        x: cursor.x - c.x,
        y: cursor.y - c.y
      };

      const {scale, angle} = positions.value[id];

      cursorPosition.value = {
        x: c.x + (centerCursor.x * Math.cos(angle) - centerCursor.y * Math.sin(angle)) * scale,
        y: c.y + (centerCursor.x * Math.sin(angle) + centerCursor.y * Math.cos(angle)) * scale
      };

      const coords = {
        x: touch.absoluteX - basePosition.x - cursorPosition.value.x,
        y: touch.absoluteY - basePosition.y - cursorPosition.value.y
      };

      const oldPositions = [...positions.value];

      oldPositions[id].x = coords.x;
      oldPositions[id].y = coords.y;

      positions.value = oldPositions;

    })
    .onTouchesMove((event) => {
      const touch = event.allTouches[0];

      const coords = {
        x: touch.absoluteX - basePosition.x - cursorPosition.value.x,
        y: touch.absoluteY - basePosition.y - cursorPosition.value.y
      };

      const oldPositions = [...positions.value];

      oldPositions[id].x = coords.x;
      oldPositions[id].y = coords.y;

      positions.value = oldPositions;
    })
    .onTouchesUp((event) => {
      movingId.value = undefined;
    })
  }

  const scaleGesture = Gesture.Native()
    .onTouchesDown((event) => {
      if (activeId.value === undefined) {
        return;
      }

      const touch = event.allTouches[0];

      cursorPosition.value = {
        x: touch.x,
        y: touch.y
      };

      const coords = positions.value[activeId.value];

      scaleFixedCorner.value = {
        x: coords.x + coords.halfWidth - coords.halfWidth * coords.scale,
        y: coords.y + coords.halfHeight - coords.halfHeight * coords.scale
      };

    })
    .onTouchesMove((event) => {
      if (activeId.value === undefined) {
        return;
      }

      const touch = event.allTouches[0];

      const coords = {
        x: touch.absoluteX - basePosition.x - cursorPosition.value.x, 
        y: touch.absoluteY - basePosition.y - cursorPosition.value.y 
      };

      const p = positions.value[activeId.value];
  
      const cDiag = Math.sqrt(p.halfWidth * p.halfWidth + p.halfHeight * p.halfHeight);  

      const d = {
        x: (coords.x - scaleFixedCorner.value.x) / 2,
        y: (coords.y - scaleFixedCorner.value.y) / 2
      };

      const diag = Math.sqrt(d.x * d.x + d.y * d.y);

      const c = {
        x: scaleFixedCorner.value.x + d.x,
        y: scaleFixedCorner.value.y + d.y
      }

      const newScale = diag / cDiag;

      const oldPositions = [...positions.value];

      oldPositions[activeId.value].scale = newScale;
      oldPositions[activeId.value].x = c.x - p.halfWidth;
      oldPositions[activeId.value].y = c.y - p.halfHeight;

      positions.value = oldPositions;
    })

  const activeCoords = useDerivedValue(() => {
    if (activeId.value === undefined) {
      return {
        x: 0,
        y: 0,
        cx: 0,
        cy: 0,
        angle: 0,
        width: 0,
        height: 0,
        halfWidth: 0,
        halfHeight: 0,
        scale: 0
      }
    }

    const coords = positions.value[activeId.value];

    return {
      ...coords,
      cx: coords.x + coords.halfWidth,
      cy: coords.y + coords.halfHeight,
    }
  })

  const activeOrigin = useDerivedValue(() => {
    return vec(activeCoords.value.cx, activeCoords.value.cy);
  })

  const activeTranforms = useDerivedValue(() => {
    return [
      {rotate: activeCoords.value.angle}
    ]
  })

  const boundingBoxPoints = useDerivedValue(() => {
    if (activeId.value === undefined) {
      return [];
    }

    const coords = positions.value[activeId.value];

    const leftX = coords.x
                + coords.halfWidth
                - coords.halfWidth * coords.scale
                - boundsExtra

    const rightX = coords.x
                 + coords.halfWidth
                 + coords.halfWidth * coords.scale
                 + boundsExtra

    const topY = coords.y
               + coords.halfHeight
               - coords.halfHeight * coords.scale
               - boundsExtra

    const bottomY = coords.y
                  + coords.halfHeight
                  + coords.halfHeight * coords.scale
                  + boundsExtra


    return [
      vec(leftX, topY),
      vec(rightX, topY),
      vec(rightX, bottomY),
      vec(leftX, bottomY),
      vec(leftX, topY),
    ]
  });


  const rotateHandleCoords = useDerivedValue(() => {
    if (activeId.value === undefined) {
      return {
        x: -100,
        y: 0,
        rx: 0,
        ry: 0
      }
    }

    const coords = positions.value[activeId.value];

    const rotateHandleY = coords.y
                        + coords.halfHeight
                        - coords.halfHeight * coords.scale
                        - boundsExtra
                        - rotateHandleLength
                        - rotateHandleSize

    const rotateHandleRY = coords.y
                         + coords.halfHeight
                         - coords.halfHeight * coords.scale
                         - boundsExtra
                        
    return {
      x: coords.x + coords.halfWidth - rotateHandleHalfSize,
      y: rotateHandleY,
      rx: coords.x + coords.halfWidth,
      ry: rotateHandleRY
    }
  });

  const scaleHandleCoords = useDerivedValue(() => {
    if (activeId.value === undefined) {
      return {
        x: -100,
        y: 0,
        rx: 0,
        ry: 0
      }
    }

    const coords = positions.value[activeId.value];

    return {
      rx: coords.x + coords.halfWidth,
      ry: coords.y + coords.halfHeight,
     
      x: coords.halfWidth * coords.scale + boundsExtra,
      y: coords.halfHeight * coords.scale + boundsExtra,
    }
  })

  const rotateGesture = Gesture.Native()
    .onTouchesDown((event) => {
      if (activeId.value === undefined) {
        return;
      }

      const touch = event.allTouches[0];

      cursorPosition.value = {
        x: touch.x,
        y: touch.y
      };

      const coords = {
        x: touch.absoluteX - basePosition.x - cursorPosition.value.x, 
        y: touch.absoluteY - basePosition.y - cursorPosition.value.y
      };

      const angle = Math.atan2(
        coords.y - activeCoords.value.cy, 
        coords.x - activeCoords.value.cx
      );

      const oldPositions = [...positions.value];

      oldPositions[activeId.value].angle = angle + Math.PI / 2;

      positions.value = oldPositions;

    })
    .onTouchesMove((event) => {
      if (activeId.value === undefined) {
        return;
      }

      const touch = event.allTouches[0];

      const coords = {
        x: touch.absoluteX - basePosition.x - cursorPosition.value.x, 
        y: touch.absoluteY - basePosition.y - cursorPosition.value.y
      };

      const angle = Math.atan2(
        coords.y - activeCoords.value.cy, 
        coords.x - activeCoords.value.cx
      );

      const oldPositions = [...positions.value];

      oldPositions[activeId.value].angle = angle + Math.PI / 2;

      positions.value = oldPositions;
    })

  const rotateHandleStyle = useAnimatedStyle(() => {
    const originDiffY = rotateHandleCoords.value.y 
                      - activeCoords.value.y
                      - activeCoords.value.halfHeight
                      + rotateHandleHalfSize;
    return {
      position: "absolute",

      top: rotateHandleCoords.value.y,
      left: rotateHandleCoords.value.x,

      width: rotateHandleSize,
      height: rotateHandleSize,

      transform: [
        {translateY: -originDiffY},
        {rotate: `${activeCoords.value.angle}rad`},
        {translateY: originDiffY},
      ]
    }
  })

  const scaleHandleStyle = useAnimatedStyle(() => {
    return {
      position: "absolute",

      top: scaleHandleCoords.value.ry,
      left: scaleHandleCoords.value.rx,

      width: scaleHandleSize,
      height: scaleHandleSize,

      // backgroundColor: "#ff0000",

      transform: [
        {translateX: -scaleHandleHalfSize},
        {translateY: -scaleHandleHalfSize},
        {rotate: `${activeCoords.value.angle}rad`},
        {translateX: scaleHandleCoords.value.x},
        {translateY: scaleHandleCoords.value.y},
      ]
    }
  })

  const cancelSelectionGesture = Gesture.Tap()
    .onEnd(() => {
      activeId.value = undefined;
    })

  return (
    <View style={styles.container}>
      <View style={{ flex: 1 }}
        ref={aref}
        onLayout={() => {
          aref.current?.measure((x, y, w, h, px, py) => {
            setBasePosition({x: px, y: py});
          })
        }}
      >
        <Canvas style={styles.container}>
          <Fill color="white" />
          {
            positions.value.map((_, i) => <MyRect key={i} id={i} positions={positions}/>)
          }

          <Group
            transform={activeTranforms}
            origin={activeOrigin}
          >
            <Points
              points={boundingBoxPoints}
              mode="polygon"
              color="lightblue"
              style="stroke"
              strokeWidth={4}
            />
            <RotateHandle rotateHandleCoords={rotateHandleCoords} activeId={activeId}/>
            <ScaleHandle coords={scaleHandleCoords}/>
          </Group>

        </Canvas>

        <GestureDetector gesture={cancelSelectionGesture}>
          <View style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%"
          }}/>
        </GestureDetector>

        {
          positions.value.map((_, i) => {
            return (
              <GestureDetectorView key={i} gesture={getPanGesture(i)} positions={positions} id={i}/>
            )
          })
        }

        <GestureDetector gesture={rotateGesture}>
          <Animated.View style={rotateHandleStyle}/>
        </GestureDetector>

        <GestureDetector gesture={scaleGesture}>
          <Animated.View style={scaleHandleStyle}/>
        </GestureDetector>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
