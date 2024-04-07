import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import {
  Group,
  Fill,
  Canvas,
  vec,
  Points,
} from "@shopify/react-native-skia";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { useSharedValue, useAnimatedStyle, useDerivedValue } from "react-native-reanimated";

import { autorun, toJS } from "mobx";
import { observer } from "mobx-react-lite";
import { Rectangle } from "./models";
import { garmentKit } from "../../stores/GarmentKitStore";
import { boundsExtra, rotateHandleHalfSize, rotateHandleLength, rotateHandleSize, scaleHandleHalfSize, scaleHandleSize } from "./consts";
import { EditorItem } from "./EditorItem";
import { RotateHandle } from "./RotateHandle";
import { ScaleHandle } from "./ScaleHandle";
import { GestureDetectorView } from "./GestureDetectorView";
import { EditorMenu } from "./EditorMenu";

export const KitEditor = observer(() => {
  const [basePosition, setBasePosition] = useState({x: 0, y: 0});

  const positions = useSharedValue<Rectangle[]>(garmentKit.items.map(item => ({...item.rect.getParams(), image: toJS(item.image)})))

  useEffect(() => {
    autorun(() => {
      positions.value = garmentKit.items.map(item => ({...item.rect.getParams(), image: toJS(item.image)}));
    })
  }, [])

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
      
      const newScale = diag / cDiag;

      const c = {
        x: scaleFixedCorner.value.x + p.halfWidth * newScale,
        y: scaleFixedCorner.value.y + p.halfHeight * newScale
      }

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
            positions.value.map((_, i) => (
              <EditorItem 
                key={i} 
                id={i} 
                positions={positions}
                image={positions.value[i].image}
              />
            ))
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

      <EditorMenu selectedId={activeId}/>

    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%"
  },
});