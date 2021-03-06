import { MouseEventHandler, TouchEventHandler, TouchEvent, MouseEvent } from 'react'

export interface SimpleGesturesDirections {
    directionDiagonal: 'right-top' | 'left-top' | 'right-bottom' | 'left-bottom'
    directionX: 'right' | 'left' | 'same'
    directionY: 'up' | 'down' | 'same'
    directionPoint: 'point'
}

export interface SimpleGesturesEventHandler {
    onStart: (x: number, y: number, e: TouchEvent | MouseEvent) => void
    onMove: (x: number, y: number, e: TouchEvent | MouseEvent) => void
    onEnd: (e: TouchEvent | MouseEvent) => void
}

export interface SimpleGesturesEventHandlerTouch {
    onTouchStart: TouchEventHandler<any>
    onTouchMove: TouchEventHandler<any>
    onTouchEnd: TouchEventHandler<any>
}

export interface SimpleGesturesEventHandlerMouse {
    onMouseDown: MouseEventHandler<any>
    onMouseMove: MouseEventHandler<any>
    onMouseUp: MouseEventHandler<any>
    onMouseLeave: MouseEventHandler<any>
}

export interface SimpleGesturesResult {
    time: number
    duration: number
    touches: number

    dirY: SimpleGesturesDirections['directionY']
    dirX: SimpleGesturesDirections['directionX']
    dir: SimpleGesturesDirections['directionDiagonal'] | SimpleGesturesDirections['directionX'] | SimpleGesturesDirections['directionY'] | SimpleGesturesDirections['directionPoint']

    // always `positive` number of px moved on the X-axis
    posMovedX: number
    // always `positive` number of px moved on the Y-axis
    posMovedY: number
    // `negative` or `positive` number of px moved on the X-axis
    movedX: number
    // `negative` or `positive` number of px moved on the Y-axis
    movedY: number

    startX: number
    startY: number
    lastX: number
    lastY: number

    lastOffsetX: number
    lastOffsetY: number

    // milli px per milli second velocity for X-axis
    mPxPerMsX: number
    // milli px per milli second velocity for Y-axis
    mPxPerMsY: number
}

export interface SimpleGesturesResultStart {
    taps: number
    touches: number
    startX: number
    startY: number
    startTime: number
    lastStartTime: number
    lastEndTime: number
}

export interface SimpleGesturesListenerTypes {
    start: simpleGesturesListenerStart
    move: simpleGesturesListener
    end: simpleGesturesListener
}

export type simpleGesturesListenerUnsub = () => void
export type simpleGesturesListener = (gesture: SimpleGesturesResult, e: TouchEvent | MouseEvent) => void
export type simpleGesturesListenerStart = (start: SimpleGesturesResultStart, e: TouchEvent | MouseEvent) => void
export type addSimpleGesturesListener = <A extends keyof SimpleGesturesListenerTypes = keyof SimpleGesturesListenerTypes>(on: A, listener: SimpleGesturesListenerTypes[A]) => simpleGesturesListenerUnsub

export interface SimpleGesturesOptions {
    // grid in which to count taps as the same than previous
    touchGrid: number
    // in `ms` how long taps after another, in the same grid spot, are counted as the same tap
    touchAsSameTap: number
    // min. movement in px, for the X-axis, before counting it as direction-change
    minMovementX: number
    // min. movement in px, for the Y-axis, before counting it as direction-change
    minMovementY: number
    // when true, the touch events will not do anything on multi touch
    noMultiTouch: boolean
    // use an offset for the `move` and `end` calculations, does not influence the `start`
    // be sure to use e.g. `useCallback` to keep a safe reference for performance reasons
    getOffset: (e: TouchEvent | MouseEvent) => SimpleGesturesGetOffsetCoordinates | undefined
}

export interface SimpleGesturesGetOffsetCoordinates {
    x: number | undefined
    y: number | undefined
}

export interface SimpleGesturesInternalState {
    // defaults to `0`
    touches: number
    // the last event that has happened, even when nothing else was executed
    lastEvent: undefined | 'mousedown' | 'mouseup' | 'mousemove' | 'touchmove' | 'touchstart' | 'touchend'
    // defaults to `-1`
    startX: number
    // defaults to `-1`
    lastX: number
    // defaults to `-1`
    lastStartGridX: number
    // defaults to `-1`
    startY: number
    // defaults to `-1`
    lastY: number
    // defaults to `-1`
    lastStartGridY: number
    // defaults to `-1`
    lastStartTime: number
    // defaults to `0`
    startOffsetX: number
    // defaults to `0`
    startOffsetY: number
    // defaults to `-1`
    lastTime: number
    // defaults to `-1`
    lastEndTime: number
    // defaults to `0`
    countTaps: number
    listeners: {
        start: [number, simpleGesturesListenerStart][]
        move: [number, simpleGesturesListener][]
        end: [number, simpleGesturesListener][]
    }
    listenerId: number
}
