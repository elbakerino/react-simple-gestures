import { MouseEventHandler, TouchEventHandler, TouchEvent, MouseEvent } from 'react'

export interface SimpleGesturesDirections {
    directionDiagonal: 'left-bottom-right-top' | 'right-bottom-left-top' | 'left-top-right-bottom' | 'right-top-left-bottom'
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
    onTouchEnd: SimpleGesturesEventHandler['onEnd']
}

export interface SimpleGesturesEventHandlerMouse {
    onMouseDown: MouseEventHandler<any>
    onMouseMove: MouseEventHandler<any>
    onMouseUp: SimpleGesturesEventHandler['onEnd']
    onMouseLeave: SimpleGesturesEventHandler['onEnd']
}

export interface SimpleGesturesActions {
    handler: SimpleGesturesEventHandlerTouch
    handlerMouse: SimpleGesturesEventHandlerMouse
    addListener: addSimpleGesturesListener
}

export interface SimpleGesturesResult {
    time: number
    duration: number
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
    // milli px per milli second velocity for X-axis
    mPxPerMsX: number
    // milli px per milli second velocity for Y-axis
    mPxPerMsY: number
}

export interface SimpleGesturesResultStart {
    taps: number
    startX: number
    startY: number
    startTime: number
    lastStartTime: number
    lastEndTime: number
}

export interface SimpleGesturesListenerType {
    start: simpleGesturesListenerStart
    move: simpleGesturesListener
    end: simpleGesturesListener
}

export type simpleGesturesListenerUnsub = () => void
export type simpleGesturesListener = (gesture: SimpleGesturesResult, e: TouchEvent | MouseEvent) => void
export type simpleGesturesListenerStart = (start: SimpleGesturesResultStart, e: TouchEvent | MouseEvent) => void
export type addSimpleGesturesListener = <A extends keyof SimpleGesturesListenerType = keyof SimpleGesturesListenerType>(on: A, listener: SimpleGesturesListenerType[A]) => simpleGesturesListenerUnsub

export interface SimpleGesturesOptions {
    // grid in which to count taps as the same than previous
    touchGrid: number
    // in `ms` how long taps after another, in the same grid spot, are counted as the same tap
    touchAsSameTap: number
    // min. movement in px, for the X-axis, before counting it as direction-change
    minMovementX: number
    // min. movement in px, for the Y-axis, before counting it as direction-change
    minMovementY: number
}

export interface SimpleGesturesInternalState {
    startX: number
    lastX: number
    lastStartGridX: number
    startY: number
    lastY: number
    lastStartGridY: number
    lastStartTime: number
    lastTime: number
    lastEndTime: number
    countTaps: number
    listeners: {
        start: [number, simpleGesturesListenerStart][]
        move: [number, simpleGesturesListener][]
        end: [number, simpleGesturesListener][]
    }
    listenerId: number
}
