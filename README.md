# React Simple Gestures

[![Github actions Build](https://github.com/elbakerino/react-simple-gestures/actions/workflows/blank.yml/badge.svg)](https://github.com/elbakerino/react-simple-gestures/actions)
[![MIT license](https://img.shields.io/npm/l/react-simple-gestures?style=flat-square)](https://github.com/elbakerino/react-simple-gestures/blob/master/LICENSE)
[![codecov](https://codecov.io/gh/elbakerino/react-simple-gestures/branch/main/graph/badge.svg?token=OX9UOZPMRF)](https://codecov.io/gh/elbakerino/react-simple-gestures)
![Typed](https://flat.badgen.net/badge/icon/Typed?icon=typescript&label&labelColor=blue&color=555555)
[![npm (scoped)](https://img.shields.io/npm/v/react-simple-gestures?style=flat-square)](https://www.npmjs.com/package/react-simple-gestures)

Hook to listen for simple touch and/or mouse gestures on components.

Easily detect the direction at the end of a touch or mouse/drag-movement, use `mPxPerMs` (milli-px-per-milli-second) to determine if it was a longer slide or more a flick or just a tap.

[Demo to flick 'n swipe.](https://simple-gestures.bemit.codes)

```tsx
import {
    useSimpleGestures,
    SimpleGesturesResult,
    SimpleGesturesResultStart,
} from 'react-simple-gestures'

const SomeComponent = () => {
    const {
        handler,
        // optional also use the mouse handler to also listen for click/drag-style events
        handlerMouse,
        addListener,
    } = useSimpleGestures({
        // only count it as `left/right/up/down` after a change of px on an axis:
        minMovementX: 50,
        minMovementY: 50,
    })

    React.useEffect(() => {
        // register an listener on `start`, `move` or/and `end` events

        const unsubStart = addListener('start', (evt: SimpleGesturesResultStart, e: TouchEvent | MouseEvent) => {
        })

        const unsubMove = addListener('move', (evt: SimpleGesturesResult, e: TouchEvent | MouseEvent) => {
            if(evt.dir === 'left' && evt.posMovedX > 50 && evt.mPxPerMsX > 200) {
                // "flicked" from left to right
                // adding own "must have moved min px" is easy in the own handlers
            }
        })

        const unsubEnd = addListener('end', (evt: SimpleGesturesResult, e: TouchEvent | MouseEvent) => {
            if(evt.dir === 'left' && evt.posMovedX > 50 && evt.mPxPerMsX > 200) {
                // same check, but after finishing the drag or touch-slide event
            }
        })

        // don't forget to clean them up on unmount:
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
        {...handler}
        {...handlerMouse}
    />
}
```

## Directions

Directions are collected in three variants:

- for `X-Axis`, available in result: `dirX` and `dir`
    - `right`, `left`, `same`
- for `Y-Axis`, available in result: `dirY` and `dir`
    - `up`, `down`, `same`
- for `XY-Axis`, available in result: `dir`
    - `left-bottom-right-top`, `right-bottom-left-top`, `left-top-right-bottom`, `right-top-left-bottom`, `point`

The XY-axis is built using the other two.

## Options

- `touchGrid: number`, grid in which to count taps as the same than previous
- `touchAsSameTap: number`m in `ms` how long taps after another, in the same grid spot, are counted as the same tap
- `minMovementX: number`, min. movement in px, for the X-axis, before counting it as direction-change
- `minMovementY: number`, min. movement in px, for the Y-axis, before counting it as direction-change

## Event Results

### Start

- `taps: number` number of taps in the same `touchGrid` position
- `startX: number`
- `startY: number`
- `startTime: number`
- `lastStartTime: number`
- `lastEndTime: number`

### Move & End

- `duration: number`
- `dir`, `dirX`, `dir`: see above [directions](#directions)
- `posMovedX: number`, always `positive` number of px moved on the X-axis
- `posMovedY: number`, always `positive` number of px moved on the Y-axis
- `movedX: number`, `negative` or `positive` number of px moved on the X-axis
- `movedY: number`, `negative` or `positive` number of px moved on the Y-axis
- `startX: number`
- `startY: number`, milli px per milli second velocity for X-axis
- `mPxPerMsX: number`, milli px per milli second velocity for Y-axis
- `mPxPerMsY: number`

## Versions

This project adheres to [semver](https://semver.org/), until `1.0.0` and beginning with `0.1.0`: all `0.x.0` releases are like MAJOR releases and all `0.0.x` like MINOR or PATCH, modules below `0.1.0` should be considered experimental.

## License

This project is free software distributed under the **MIT License**.

See: [LICENSE](LICENSE).

© 2021 bemit UG (haftungsbeschränkt)

### License Icons

The icons in the badges of the readme's are either from [simpleicons](https://simpleicons.org) or are licensed otherwise:

- [Play Icon © Chanut is Industries, CC BY 3.0](https://www.iconfinder.com/icons/928430/go_media_music_play_playing_start_icon)
- [Experiment Icon © Ardiansyah Ardi, CC BY 3.0](https://www.iconfinder.com/icons/4951169/chemical_experiment_glass_lab_medical_icon)
- [Doc Icons © PICOL, CC BY 3.0](https://www.iconfinder.com/iconsets/picol-vector)

***

Created by [Michael Becker](https://mlbr.xyz)
