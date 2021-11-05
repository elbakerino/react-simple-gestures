# React Simple Gestures

[![Github actions Build](https://github.com/elbakerino/react-simple-gestures/actions/workflows/blank.yml/badge.svg)](https://github.com/elbakerino/react-simple-gestures/actions)
[![MIT license](https://img.shields.io/npm/l/react-simple-gestures?style=flat-square)](https://github.com/elbakerino/react-simple-gestures/blob/master/LICENSE)
[![codecov](https://codecov.io/gh/elbakerino/react-simple-gestures/branch/main/graph/badge.svg?token=OX9UOZPMRF)](https://codecov.io/gh/elbakerino/react-simple-gestures)
![Typed](https://flat.badgen.net/badge/icon/Typed?icon=typescript&label&labelColor=blue&color=555555)
[![npm (scoped)](https://img.shields.io/npm/v/react-simple-gestures?style=flat-square)](https://www.npmjs.com/package/react-simple-gestures)

Hook to listen for simple touch and/or mouse gestures on components.

Easily detect the [direction](#directions) during and at the end of touch or mouse/drag-movement, use the result to determine your action and then re-render. This hook works stateless to improve performance.

[Demo to flick 'n swipe](https://simple-gestures.bemit.codes), here is [the demo code](./packages/demo/src/GestureArea.tsx).

The hook `useSimpleGestures` creates event handlers your can just spread to your component, add your handlers with `addListener`.

```shell
npm i --save react-simple-gestures
```

```tsx
import {
    useSimpleGestures,
    SimpleGesturesResult,
    SimpleGesturesResultStart,
} from 'react-simple-gestures'

const SomeComponent = () => {
    const {
        // default handler for usage with touch gestures
        handler,
        // mouse handler to listen for non-touch events
        handlerMouse,
        // use this to add your listeners to any event
        addListener,
        // for usage in other event handlers, get the current internal state
        getState,
    } = useSimpleGestures({
        // only count it as `left/right/up/down` after a change of px on an axis
        minMovementX: 50,
        minMovementY: 50,
    })

    React.useEffect(() => {
        // register listeners on `start`, `move` and `end` events

        const unsubStart = addListener('start', (evt: SimpleGesturesResultStart, e: TouchEvent | MouseEvent) => {
        })

        const unsubMove = addListener('move', (evt: SimpleGesturesResult, e: TouchEvent | MouseEvent) => {
            if(evt.dir === 'left' && evt.posMovedX > 150 && evt.mPxPerMsX > 200) {
                // "flicked" from left to right
                // adding own "must have moved min px" is easy in the own handlers
            }
        })

        const unsubEnd = addListener('end', (evt: SimpleGesturesResult, e: TouchEvent | MouseEvent) => {
            if(evt.dir === 'left' && evt.posMovedX > 150 && evt.mPxPerMsX > 200) {
                // same check, but after finishing the drag or touch-slide event
            }
        })

        // don't forget to unsubscribe them on unmount:
        return () => {
            unsubStart()
            unsubMove()
            unsubEnd()
        }
    }, [addListener])

    return <div
        style={{
            width: 500,
            height: 500,
        }}
        // spread the handler on to the element, they are just `onMouseDown`, `onTouchStart` etc.
        // use those wanted, either both or just one `handler` = `touch`, `handlerMouse` = `mouse`
        {...handler}
        {...handlerMouse}
    />
}
```

## Directions

Directions are collected in three variants, they describe the movement direction relatively to the start point:

- for `X-Axis`, available in result: `dirX` and `dir`
    - `right`, `left`, `same`
- for `Y-Axis`, available in result: `dirY` and `dir`
    - `up`, `down`, `same`
- for `XY-Axis`, available in result: `dir`
    - `right-top`, `left-top`, `right-bottom`, `left-bottom`, `point`

The XY-axis is built using the other two.

## Options

- `touchGrid: number`, grid in which to count taps as the same then previous
- `touchAsSameTap: number`m in `ms` how long taps after another, in the same grid spot, are counted as the same tap
- `minMovementX: number`, min. movement in px, for the X-axis, before counting it as direction-change
- `minMovementY: number`, min. movement in px, for the Y-axis, before counting it as direction-change
- `noMultiTouch: boolean`, defaults to `false`, when `true` does not execute `move` and `end` actions while the user makes a multi touch
- `getOffset: (e: TouchEvent | MouseEvent) => { x: number | undefined, y: number | undefined } | undefined`
    - allows supplying an offset to `move` and `end` calculation
    - e.g. calculate the movement relatively to start
    - e.g. allows scrolling to not mess up the pointer direction
        - e.g. invalid directions where the pane moved, but the cursor kept the same position on the pane

## Event Results

### Start

- `taps: number` number of taps in the same `touchGrid` position
- `touches: number` number of active touches, only for multi-touch
- `startX: number`
- `startY: number`
- `startTime: number` time of this `start` event in UTC ms
- `lastStartTime: number` time of the previous `start` event in UTC ms
- `lastEndTime: number` time of the last `end` event in UTC ms

### Move & End

- `time: number` of event in UTC ms
- `duration: number` in `ms` since `start`
- `touches: number` number of active touches, only for multi-touch
- `dir`, `dirX`, `dir`: see above [directions](#directions)
- `posMovedX: number`, always `positive` number of px moved on the X-axis
- `posMovedY: number`, always `positive` number of px moved on the Y-axis
- `movedX: number`, `negative` or `positive` number of px moved on the X-axis
- `movedY: number`, `negative` or `positive` number of px moved on the Y-axis
- `startX: number`
- `startY: number`
- `lastX: number`
- `lastY: number`
- `lastOffsetX: number`
- `lastOffsetY: number`
- `mPxPerMsY: number`, milli px per milli second velocity for Y-axis
- `mPxPerMsX: number`, milli px per milli second velocity for X-axis

### Typings

Checkout [packages/simple-gestures/src/SimpleGestures.ts](./packages/simple-gestures/src/SimpleGestures.ts) for further infos and the most important interfaces.

If you get errors related to `TouchEvent` or `MouseEvent` typings, it's important to use the ones exported by react:

```ts
import { TouchEvent, MouseEvent } from 'react'
```

## Versions

This project adheres to [semver](https://semver.org/), until `1.0.0` and beginning with `0.1.0`: all `0.x.0` releases are like MAJOR releases and all `0.0.x` like MINOR or PATCH, modules below `0.1.0` should be considered experimental.

## Develop

1. Clone/fork repository
2. `npm i`
3. `npm run bootstrap && npm run hoist`
4. Now run either:
    - `npm start` for launching demo app compilation of packages
    - `npm test` for running tests
    - `npm run tdd` for running tests in watch mode
    - `npm run build` for building the demo app and packages

## License

This project is free software distributed under the **MIT License**.

See: [LICENSE](LICENSE).

© 2021 [Michael Becker](https://mlbr.xyz)
